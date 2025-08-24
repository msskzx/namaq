# Neo4j Cypher Generation from Raw Arabic Text

This system automatically generates Neo4j Cypher queries from raw Arabic genealogical text using Large Language Models (LLMs).

## Overview

The `genCypherFromRaw.ts` file processes the `peopleRaw.ts` data and uses an LLM to:
1. Parse Arabic genealogical text
2. Extract family tree relationships
3. Generate unique slugs for each person
4. Create MERGE Cypher queries for nodes and relationships

## Features

- **MERGE Operations**: Uses `MERGE` instead of `CREATE` to avoid duplicate nodes
- **Dual LLM Support**: Works with both Gemini 2.5 (free) and Perplexity Pro
- **Automatic Slug Generation**: Converts Arabic names to English slugs
- **Relationship Mapping**: Creates FATHER relationships between generations
- **Duplicate Prevention**: Automatically removes duplicate nodes and relationships

## Setup

### 1. Get API Keys

#### For Gemini (Free):
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create a new API key
3. Set environment variable: `GEMINI_API_KEY=your_key_here`

#### For Perplexity Pro:
1. Go to [Perplexity AI](https://www.perplexity.ai/)
2. Get your API key from settings
3. Set environment variable: `PERPLEXITY_API_KEY=your_key_here`

### 2. Environment Variables

Add to your `.env` file:
```bash
# Choose one:
GEMINI_API_KEY=your_gemini_key_here
PERPLEXITY_API_KEY=your_perplexity_key_here
```

## Usage

### Command Line

Generate Cypher queries using the npm script:
```bash
npm run gen:cypher
```

### Programmatic Usage

```typescript
import { generateCypherFromRaw, saveToGraphSeedData3 } from './neo4j/genCypherFromRaw';

const config = {
  provider: 'gemini', // or 'perplexity'
  apiKey: process.env.GEMINI_API_KEY || process.env.PERPLEXITY_API_KEY || ''
};

// Generate queries
const result = await generateCypherFromRaw(config);

// Save to file
await saveToGraphSeedData3(config, './neo4j/graphSeedData3.ts');
```

## Input Format

The system expects data in this format (from `peopleRaw.ts`):

```typescript
export const peopleRaw = {
  'أبو عبيدة بن الجراح': 'عامر بن عبد الله بن الجراح بن هلال بن أهيب بن ضبة بن الحارث بن فهر بن مالك بن النضر بن كنانة بن خزيمة بن مدركة بن إلياس بن مضر بن نزار بن معد بن عدنان ، القرشي الفهري المكي .',
  // ... more people
};
```

## Output Format

The system generates two arrays of Cypher queries:

### Node Queries (MERGE)
```cypher
MERGE (:Person { slug: "abu-ubaydah-ibn-al-jarrah" }) 
ON CREATE SET name = "أبو عبيدة بن الجراح", 
             fullName = "أبو عبيدة بن الجراح بن هلال بن أهيب..."
```

### Relationship Queries (MATCH + MERGE)
```cypher
MATCH (from:Person {slug: "abu-ubaydah-ibn-al-jarrah"}), 
      (to:Person {slug: "al-jarrah-ibn-hilal"}) 
MERGE (from)-[:FATHER]->(to)
```

## How It Works

1. **Text Parsing**: The LLM analyzes Arabic genealogical text to identify:
   - Individual people
   - Father-son relationships
   - Complete genealogical chains

2. **Slug Generation**: Arabic names are converted to English slugs using transliteration rules

3. **Query Generation**: Cypher queries are created using:
   - `MERGE` for nodes (prevents duplicates)
   - `MATCH` + `MERGE` for relationships

4. **Deduplication**: Duplicate nodes and relationships are automatically removed

## Example Processing

**Input:**
```
'أبو عبيدة بن الجراح': 'عامر بن عبد الله بن الجراح بن هلال بن أهيب بن ضبة...'
```

**LLM Output:**
```json
{
  "nodes": [
    {
      "name": "أبو عبيدة بن الجراح",
      "slug": "abu-ubaydah-ibn-al-jarrah",
      "fullName": "أبو عبيدة بن الجراح بن هلال بن أهيب..."
    },
    {
      "name": "الجراح بن هلال",
      "slug": "al-jarrah-ibn-hilal",
      "fullName": "الجراح بن هلال بن أهيب..."
    }
  ],
  "relations": [
    {
      "fromSlug": "abu-ubaydah-ibn-al-jarrah",
      "toSlug": "al-jarrah-ibn-hilal",
      "relationship": "FATHER"
    }
  ]
}
```

**Generated Cypher:**
```cypher
MERGE (:Person { slug: "abu-ubaydah-ibn-al-jarrah" }) 
ON CREATE SET name = "أبو عبيدة بن الجراح", 
             fullName = "أبو عبيدة بن الجراح بن هلال بن أهيب...";

MATCH (from:Person {slug: "abu-ubaydah-ibn-al-jarrah"}), 
      (to:Person {slug: "al-jarrah-ibn-hilal"}) 
MERGE (from)-[:FATHER]->(to);
```

## Benefits

- **Scalable**: Can process large amounts of raw text data
- **Accurate**: LLM understands Arabic genealogical context
- **Efficient**: Uses MERGE to prevent duplicate operations
- **Flexible**: Works with varying text formats and styles
- **Maintainable**: Automatically generates consistent Cypher queries

## Troubleshooting

### Common Issues

1. **API Key Errors**: Ensure your API key is set correctly
2. **Rate Limiting**: LLM APIs have rate limits; add delays if needed
3. **JSON Parsing Errors**: The LLM might return malformed JSON; check the prompt
4. **Memory Issues**: Large datasets might cause memory problems; process in batches

### Debug Mode

Enable detailed logging by setting:
```bash
DEBUG=cypher-gen npm run gen:cypher
```

## Future Enhancements

- **Batch Processing**: Process multiple people simultaneously
- **Relationship Types**: Support for more relationship types (mother, spouse, etc.)
- **Validation**: Add validation for generated queries
- **Caching**: Cache LLM responses to avoid repeated API calls
- **Error Recovery**: Better error handling and retry logic
