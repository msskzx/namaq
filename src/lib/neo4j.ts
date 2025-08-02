import neo4j, { Driver, Session } from 'neo4j-driver';
import 'dotenv/config';

interface Neo4jConfig {
  uri: string;
  username: string;
  password: string;
  database: string;
}

// Get Neo4j configuration from environment variables
const neo4jConfig: Neo4jConfig = {
  uri: process.env.NEO4J_URI || '', // Use an empty string as fallback
  username: process.env.NEO4J_USERNAME || '', // Use an empty string as fallback
  password: process.env.NEO4J_PASSWORD || '', // Use an empty string as fallback
  database: process.env.NEO4J_DATABASE || 'neo4j' // Default database
};

// Create a driver instance
let driver: Driver | null = null;

// Function to get a Neo4j driver instance
function getDriver(): Driver {
  if (!driver) {
    try {
      // Explicitly check for credentials and throw a specific error
      if (!neo4jConfig.uri || !neo4jConfig.username || !neo4jConfig.password) {
        throw new Error('Neo4j credentials are not set. Please check your .env file or environment variables.');
      }

      driver = neo4j.driver(
        neo4jConfig.uri,
        neo4j.auth.basic(neo4jConfig.username, neo4jConfig.password),
        {
          maxConnectionPoolSize: 50,
          connectionTimeout: 30000,
          maxTransactionRetryTime: 30000,
          disableLosslessIntegers: true
        }
      );
      console.log('Neo4j driver initialized successfully');
    } catch (error) {
      console.error('Failed to create Neo4j driver:', error);
      throw error;
    }
  }
  return driver;
}

// Function to get a database session
function getSession(database: string = neo4jConfig.database): Session {
  const session = getDriver().session({
    database,
    defaultAccessMode: neo4j.session.READ
  });
  return session;
}

// Function to test the connection
async function testConnection(): Promise<boolean> {
  const session = getSession();
  try {
    const result = await session.run('RETURN 1 as test');
    return result.records.length > 0;
  } catch (error) {
    console.error('Neo4j connection test failed:', error);
    return false;
  } finally {
    await session.close();
  }
}

async function executeCypher(query: string, operation: string) {
  try {
    console.log(`Executing: ${operation}`);
    await getSession().run(query);
    console.log(`✅ Success: ${operation}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Error during ${operation}:`, error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Executes a series of Cypher queries within a single write transaction.
 * All queries must succeed for the transaction to be committed.
 * This is the recommended approach for multiple write operations.
 * @param queries An array of Cypher query strings to execute.
 * @param operation A descriptive string for logging purposes.
 * @returns An object with success status or an error message.
 */
async function executeTransaction(queries: string[], operation: string): Promise<{ success: boolean; error?: string }> {
  const session = getSession();
  try {
    console.log(`Executing transaction: ${operation}`);

    // Use a write transaction to guarantee all queries succeed or fail together
    await session.executeWrite(async tx => {
      for (const query of queries) {
        await tx.run(query);
      }
    });

    console.log(`✅ Success: ${operation}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Error during ${operation}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  } finally {
    // CRITICAL: Always close the session to release the connection back to the pool
    await session.close();
  }
}

// Handle application shutdown
process.on('beforeExit', async () => {
  if (driver) {
    await driver.close();
    console.log('Neo4j driver connection closed');
  }
});

// Export the functions
export { getDriver, getSession, testConnection, executeCypher, executeTransaction };

// Test the connection when this module is imported
// This is optional and can be removed if not needed
if (process.env.NODE_ENV !== 'test') {
  testConnection().then(success => {
    if (success) {
      console.log('Successfully connected to Neo4j AuraDB');
    }
  });
}


