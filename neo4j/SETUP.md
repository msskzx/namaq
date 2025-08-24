# Setup Guide for LLM API Keys

## Environment Variables

Create a `.env` file in your project root with one of the following:

### Option 1: Gemini API (Free tier available)
```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

### Option 2: Perplexity Pro
```bash
PERPLEXITY_API_KEY=your_perplexity_api_key_here
```

## Getting API Keys

### Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API key" in the top right
4. Create a new API key
5. Copy the key to your `.env` file

### Perplexity Pro API Key
1. Go to [Perplexity AI](https://www.perplexity.ai/)
2. Sign up for Pro account
3. Go to Settings → API Keys
4. Generate a new API key
5. Copy the key to your `.env` file

## Usage

After setting up your API key, you can run:

```bash
# Generate Cypher queries
npm run gen:cypher

# Run examples
npm run gen:cypher:example
```

## Notes

- Only one API key is needed at a time
- The system automatically detects which provider to use
- Gemini offers a free tier with generous limits
- Perplexity Pro offers higher quality but requires subscription
