import { generateCypherFromRaw, saveToGraphSeedData3 } from './genCypherFromRaw';
import { LLMConfig, getConfigFromEnv } from './config';

// Example 1: Using environment variables (recommended)
async function exampleWithEnvVars() {
  try {
    console.log('Example 1: Using environment variables');
    const config = getConfigFromEnv();

    const result = await generateCypherFromRaw(config);
    console.log(`Generated ${result.peopleQueries.length} node queries`);
    console.log(`Generated ${result.peopleRelationsQueries.length} relationship queries`);

    // Save to file
    await saveToGraphSeedData3(config);
    console.log('Saved to graphSeedData3.ts');

  } catch (error) {
    console.error('Error:', error);
  }
}

// Example 2: Using custom configuration
async function exampleWithCustomConfig() {
  try {
    console.log('\nExample 2: Using custom configuration');

    const customConfig: LLMConfig = {
      provider: 'gemini',
      apiKey: 'your-api-key-here',
      model: 'gemini-1.5-flash',
      maxRetries: 5,
      delayBetweenRequests: 2000
    };

    const result = await generateCypherFromRaw(customConfig);
    console.log(`Generated ${result.peopleQueries.length} node queries`);
    console.log(`Generated ${result.peopleRelationsQueries.length} relationship queries`);

    // Save to custom path
    await saveToGraphSeedData3(customConfig, './neo4j/custom-output.ts');
    console.log('Saved to custom-output.ts');

  } catch (error) {
    console.error('Error:', error);
  }
}

// Example 3: Processing only specific people
async function exampleWithSpecificPeople() {
  try {
    console.log('\nExample 3: Processing specific people');

    // Import peopleRaw and modify it to only include specific people
    const { peopleRaw } = await import('./peopleRaw');

    // Create a subset for testing
    const testPeople = {
      'أبو عبيدة بن الجراح': peopleRaw['أبو عبيدة بن الجراح']
    };

    // You could modify the generateCypherFromRaw function to accept custom data
    // For now, this is just a demonstration
    console.log('Test people:', Object.keys(testPeople));

  } catch (error) {
    console.error('Error:', error);
  }
}

// Example 4: Batch processing with delays
async function exampleWithBatchProcessing() {
  try {
    console.log('\nExample 4: Batch processing with delays');

    const config = getConfigFromEnv();

    // Add longer delays for batch processing
    const batchConfig: LLMConfig = {
      ...config,
      delayBetweenRequests: 3000, // 3 seconds between requests
      maxRetries: 5
    };

    const result = await generateCypherFromRaw(batchConfig);
    console.log(`Generated ${result.peopleQueries.length} node queries`);
    console.log(`Generated ${result.peopleRelationsQueries.length} relationship queries`);

  } catch (error) {
    console.error('Error:', error);
  }
}

// Main function to run examples
async function runExamples() {
  console.log('Running Cypher generation examples...\n');

  // Run examples based on what's available
  try {
    // Try to get config from environment
    const config = getConfigFromEnv();
    console.log(`Found ${config.provider} API key, running examples...\n`);

    await exampleWithEnvVars();
    await exampleWithCustomConfig();
    await exampleWithSpecificPeople();
    await exampleWithBatchProcessing();

  } catch (error) {
    console.log('No API key found, showing example structure only:');
    console.log('1. Set GEMINI_API_KEY or PERPLEXITY_API_KEY environment variable');
    console.log('2. Run: npm run gen:cypher');
    console.log('3. Or import and use the functions programmatically');
  }
}

// Run examples if this file is executed directly
if (require.main === module) {
  runExamples();
}

export {
  exampleWithEnvVars,
  exampleWithCustomConfig,
  exampleWithSpecificPeople,
  exampleWithBatchProcessing
};
