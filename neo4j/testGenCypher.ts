import { generateCypherFromRaw, saveToGraphSeedData3 } from './genCypherFromRaw';

// Mock LLM response for testing
const mockLLMResponse = {
  nodes: [
    {
      name: "أبو عبيدة بن الجراح",
      slug: "abu-ubaydah-ibn-al-jarrah",
      fullName: "أبو عبيدة بن الجراح بن هلال بن أهيب بن ضبة بن الحارث بن فهر بن مالك بن النضر بن كنانة بن خزيمة بن مدركة بن إلياس بن مضر بن نزار بن معد بن عدنان"
    },
    {
      name: "الجراح بن هلال",
      slug: "al-jarrah-ibn-hilal",
      fullName: "الجراح بن هلال بن أهيب بن ضبة بن الحارث بن فهر بن مالك بن النضر بن كنانة بن خزيمة بن مدركة بن إلياس بن مضر بن نزار بن معد بن عدنان"
    },
    {
      name: "هلال بن أهيب",
      slug: "hilal-ibn-ahib",
      fullName: "هلال بن أهيب بن ضبة بن الحارث بن فهر بن مالك بن النضر بن كنانة بن خزيمة بن مدركة بن إلياس بن مضر بن نزار بن معد بن عدنان"
    }
  ],
  relations: [
    {
      fromSlug: "abu-ubaydah-ibn-al-jarrah",
      toSlug: "al-jarrah-ibn-hilal",
      relationship: "FATHER"
    },
    {
      fromSlug: "al-jarrah-ibn-hilal",
      toSlug: "hilal-ibn-ahib",
      relationship: "FATHER"
    }
  ]
};

// Mock the LLM API calls for testing
jest.mock('./genCypherFromRaw', () => ({
  ...jest.requireActual('./genCypherFromRaw'),
  callGeminiAPI: jest.fn().mockResolvedValue(JSON.stringify(mockLLMResponse)),
  callPerplexityAPI: jest.fn().mockResolvedValue(JSON.stringify(mockLLMResponse))
}));

async function testGeneration() {
  console.log('Testing Cypher generation with mock data...');

  try {
    // Test with mock config
    const mockConfig = {
      provider: 'gemini' as const,
      apiKey: 'test-key'
    };

    const result = await generateCypherFromRaw(mockConfig);

    console.log('Generated queries:');
    console.log('Nodes:', result.peopleQueries.length);
    console.log('Relations:', result.peopleRelationsQueries.length);

    console.log('\nSample node query:');
    console.log(result.peopleQueries[0]);

    console.log('\nSample relation query:');
    console.log(result.peopleRelationsQueries[0]);

  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testGeneration();
}
