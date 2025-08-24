import { peopleRaw } from './peopleRaw';
import { LLMConfig, validateConfig, defaultLLMConfig, getConfigFromEnv } from './config';

// Types for the LLM response
interface PersonNode {
  name: string;
  slug: string;
  fullName: string;
}

interface PersonRelation {
  fromSlug: string;
  toSlug: string;
  relationship: 'FATHER' | 'SON';
}

interface LLMResponse {
  nodes: PersonNode[];
  relations: PersonRelation[];
}

// Function to call Gemini API with retry logic
async function callGeminiAPI(prompt: string, config: LLMConfig): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.model || 'gemini-1.5-flash'}:generateContent?key=${config.apiKey}`;

  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= (config.maxRetries || 3); attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response format from Gemini API');
      }

      return data.candidates[0].content.parts[0].text;

    } catch (error) {
      lastError = error as Error;

      if (attempt < (config.maxRetries || 3)) {
        console.log(`Attempt ${attempt + 1} failed, retrying in ${config.delayBetweenRequests || 1000}ms...`);
        await new Promise(resolve => setTimeout(resolve, config.delayBetweenRequests || 1000));
      }
    }
  }

  throw new Error(`Gemini API failed after ${config.maxRetries || 3} attempts: ${lastError?.message || 'Unknown error'}`);
}

// Function to call Perplexity API with retry logic
async function callPerplexityAPI(prompt: string, config: LLMConfig): Promise<string> {
  const url = 'https://api.perplexity.ai/chat/completions';

  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= (config.maxRetries || 3); attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: config.model || 'llama-3.1-sonar-small-128k-online',
          messages: [{
            role: 'user',
            content: prompt
          }],
          max_tokens: 4000
        })
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from Perplexity API');
      }

      return data.choices[0].message.content;

    } catch (error) {
      lastError = error as Error;

      if (attempt < (config.maxRetries || 3)) {
        console.log(`Attempt ${attempt + 1} failed, retrying in ${config.delayBetweenRequests || 1000}ms...`);
        await new Promise(resolve => setTimeout(resolve, config.delayBetweenRequests || 1000));
      }
    }
  }

  throw new Error(`Perplexity API failed after ${config.maxRetries || 3} attempts: ${lastError?.message || 'Unknown error'}`);
}

// Function to parse LLM response
function parseLLMResponse(response: string): LLMResponse {
  try {
    // Try to extract JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // If no JSON found, try to parse manually
    throw new Error('No valid JSON found in response');
  } catch (error) {
    console.error('Failed to parse LLM response as JSON:', error);
    console.log('Raw response:', response);

    // Return empty response as fallback
    return { nodes: [], relations: [] };
  }
}

// Function to generate Cypher queries from parsed data
function generateCypherQueries(data: LLMResponse): {
  peopleQueries: string[];
  peopleRelationsQueries: string[];
} {
  const peopleQueries: string[] = [];
  const peopleRelationsQueries: string[] = [];

  // Generate MERGE queries for nodes
  data.nodes.forEach(node => {
    const query = `MERGE (:Person { slug: "${node.slug}" }) ON CREATE SET name = "${node.name}", fullName = "${node.fullName}"`;
    peopleQueries.push(query);
  });

  // Generate MERGE queries for relationships
  data.relations.forEach(relation => {
    const query = `MATCH (from:Person {slug: "${relation.fromSlug}"}), (to:Person {slug: "${relation.toSlug}"}) MERGE (from)-[:${relation.relationship}]->(to)`;
    peopleRelationsQueries.push(query);
  });

  return { peopleQueries, peopleRelationsQueries };
}

// Main function to process raw people data
export async function generateCypherFromRaw(config: LLMConfig): Promise<{
  peopleQueries: string[];
  peopleRelationsQueries: string[];
}> {
  // Validate configuration
  validateConfig(config);

  const allNodes: PersonNode[] = [];
  const allRelations: PersonRelation[] = [];

  for (const [personName, genealogy] of Object.entries(peopleRaw)) {
    console.log(`Processing: ${personName}`);

    const prompt = `
You are an expert in Arabic genealogy and Neo4j Cypher queries. I need you to parse the following Arabic genealogical text and extract the family tree structure.

Person: ${personName}
Genealogy: ${genealogy}

Please analyze this text and extract:
1. All the people mentioned in the genealogy chain
2. The father-son relationships between them

Return your response as a valid JSON object with this exact structure:
{
  "nodes": [
    {
      "name": "Arabic name",
      "slug": "english-slug",
      "fullName": "Full Arabic name with genealogy"
    }
  ],
  "relations": [
    {
      "fromSlug": "son-slug",
      "toSlug": "father-slug", 
      "relationship": "FATHER"
    }
  ]
}

Important rules:
- The first person in the genealogy is the main person (${personName})
- Each "ابن" (ibn) indicates a father-son relationship
- Generate slugs by transliterating Arabic names to English
- Use "FATHER" relationship type (son -> father)
- Include the main person in the nodes array
- Make sure all slugs are unique and follow kebab-case format
- The fullName should be the complete Arabic name as it appears in the text

Example slug format: "umar-ibn-al-khattab", "abu-bakr-as-siddiq"
`;

    try {
      let response: string;

      if (config.provider === 'gemini') {
        response = await callGeminiAPI(prompt, config);
      } else {
        response = await callPerplexityAPI(prompt, config);
      }

      const parsedData = parseLLMResponse(response);

      // Add nodes and relations to our collections
      allNodes.push(...parsedData.nodes);
      allRelations.push(...parsedData.relations);

      console.log(`Successfully processed ${personName}: ${parsedData.nodes.length} nodes, ${parsedData.relations.length} relations`);

    } catch (error) {
      console.error(`Error processing ${personName}:`, error);
    }
  }

  // Remove duplicates
  const uniqueNodes = Array.from(new Map(allNodes.map(node => [node.slug, node])).values());
  const uniqueRelations = Array.from(new Map(allRelations.map(rel =>
    [`${rel.fromSlug}-${rel.toSlug}-${rel.relationship}`, rel]
  )).values());

  console.log(`Total unique nodes: ${uniqueNodes.length}`);
  console.log(`Total unique relations: ${uniqueRelations.length}`);

  return generateCypherQueries({
    nodes: uniqueNodes,
    relations: uniqueRelations
  });
}

// Function to save results to a new file
export async function saveToGraphSeedData(
  config: LLMConfig,
  outputPath: string = './neo4j/graphSeedData3.ts'
): Promise<void> {
  try {
    const { peopleQueries, peopleRelationsQueries } = await generateCypherFromRaw(config);

    const fileContent = `/**
 * Auto-generated Cypher queries from raw people data using LLM parsing.
 * Generated on: ${new Date().toISOString()}
 * 
 * This file contains MERGE queries to create Person nodes and relationships.
 * MERGE ensures nodes are only created if they don't already exist.
 */

/**
 * An array of Cypher queries to create all Person nodes.
 * Each item in the array is a single MERGE query.
 */
export const peopleQueries = [
${peopleQueries.map(query => `  '${query};'`).join(',\n')}
];

/**
 * An array of Cypher queries to create all relationships between Person nodes.
 * Each item in the array is a single MATCH...MERGE query.
 */
export const peopleRelationsQueries = [
${peopleRelationsQueries.map(query => `  '${query};'`).join(',\n')}
];
`;

    // Write to file using Node.js fs module
    const fs = require('fs');
    const path = require('path');

    // Ensure the directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write the file
    fs.writeFileSync(outputPath, fileContent, 'utf8');

    console.log(`\nResults saved to ${outputPath}`);
    console.log(`Total nodes: ${peopleQueries.length}`);
    console.log(`Total relations: ${peopleRelationsQueries.length}`);

  } catch (error) {
    console.error('Error generating Cypher queries:', error);
    throw error;
  }
}

// Example usage
if (require.main === module) {
  try {
    // Get configuration from environment
    const config = getConfigFromEnv();

    console.log(`Using ${config.provider} API`);
    console.log(`Output will be saved to: ./neo4j/graphSeedData3.ts`);

    saveToGraphSeedData(config)
      .then(() => {
        console.log('Successfully generated graphSeedData3.ts');
      })
      .catch((error) => {
        console.error('Failed to generate graphSeedData3.ts:', error);
        process.exit(1);
      });
  } catch (error) {
    console.error('Configuration error:', error);
    console.error('Please set GEMINI_API_KEY or PERPLEXITY_API_KEY environment variable');
    process.exit(1);
  }
}
