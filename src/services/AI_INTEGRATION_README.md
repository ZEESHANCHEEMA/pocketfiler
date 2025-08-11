# AI Integration for Contract Creation

This document describes the enhanced AI integration for contract creation in the `src` directory, following the same patterns as `src2` but adapted for the web application.

## Overview

The AI integration provides the following features:
- **Contract Generation**: Generate contracts using AI prompts
- **Contract Review**: AI-powered contract analysis and suggestions
- **Clause Generation**: Generate specific legal clauses
- **Translation**: Translate contracts to different languages
- **Service Status Monitoring**: Real-time AI service availability checking

## Architecture

### 1. Configuration (`src/config/apiConfig.js`)
- AI service configuration (OpenAI/OpenRouter)
- API endpoints for AI services
- Error messages and status codes
- Feature flags for enabling/disabling AI features

### 2. AI Service (`src/services/aiService.js`)
- Centralized AI service with enhanced error handling
- Support for multiple AI providers (OpenAI, OpenRouter)
- Comprehensive logging and debugging
- Service status monitoring

### 3. Components Integration
- **ContractEditor**: Main contract creation with AI
- **AIClauseChecker**: AI-powered contract review
- **ContractEditor Modal**: Modal version of contract editor

## Features

### Contract Generation
```javascript
import AIService from '../services/aiService';

// Generate contract content
const result = await AIService.generateContractContent(prompt, existingContent);
if (result.success) {
  // Use result.content
  console.log('Generated contract:', result.content);
} else {
  console.error('AI generation failed:', result.error);
}
```

### Contract Review
```javascript
// Review existing contract
const result = await AIService.reviewContract(contractContent);
if (result.success) {
  // Use result.suggestions
  console.log('AI suggestions:', result.suggestions);
}
```

### Clause Generation
```javascript
// Generate specific clauses
const result = await AIService.generateClauses('NDA', 'confidentiality requirements');
if (result.success) {
  console.log('Generated clauses:', result.clauses);
}
```

### Translation
```javascript
// Translate contract
const result = await AIService.translateContract(contractContent, 'Spanish');
if (result.success) {
  console.log('Translated content:', result.translatedContent);
}
```

## Configuration

### Environment Variables
Create a `.env` file in your project root:
```env
REACT_APP_API_URL=http://13.57.230.64:4000
REACT_APP_OPENAI_API_KEY=your-openai-key-here
REACT_APP_OPENROUTER_API_KEY=your-openrouter-key-here
```

### AI Configuration Options
```javascript
// In src/config/apiConfig.js
export const API_CONFIG = {
  // Enable/disable AI features
  ENABLE_AI_FEATURES: true,
  
  // Choose AI provider
  USE_OPENROUTER: true, // Use OpenRouter instead of OpenAI
  
  // OpenAI Configuration
  OPENAI_API_KEY: process.env.REACT_APP_OPENAI_API_KEY,
  OPENAI_MODEL: 'gpt-3.5-turbo',
  
  // OpenRouter Configuration
  OPENROUTER_API_KEY: process.env.REACT_APP_OPENROUTER_API_KEY,
  OPENROUTER_MODEL: 'openai/gpt-4o-mini',
  
  // Debug mode
  DEBUG_MODE: true,
  ENABLE_LOGGING: true,
};
```

## Usage Examples

### 1. Basic Contract Generation
```javascript
// In a React component
const [prompt, setPrompt] = useState('');
const [contractContent, setContractContent] = useState('');

const generateContract = async () => {
  const result = await AIService.generateContractContent(prompt);
  if (result.success) {
    setContractContent(result.content);
  } else {
    ErrorToast(result.error);
  }
};
```

### 2. Contract Review with Suggestions
```javascript
const reviewContract = async (contractText) => {
  const result = await AIService.reviewContract(contractText);
  if (result.success) {
    // Parse and display suggestions
    const suggestions = parseAISuggestions(result.suggestions);
    setSuggestions(suggestions);
  }
};
```

### 3. Service Status Monitoring
```javascript
const checkAIService = async () => {
  const status = await AIService.checkAIService();
  if (status.available) {
    console.log('AI service is available');
  } else {
    console.log('AI service is unavailable:', status.error);
  }
};
```

## Error Handling

The AI service includes comprehensive error handling:

### Network Errors
```javascript
// Automatic detection and user-friendly messages
if (!error.response) {
  error.message = 'Network error. Please check your internet connection.';
}
```

### API Errors
```javascript
// Specific error handling for different status codes
switch (error.response.status) {
  case 401:
    errorMessage = 'Authentication failed. Please check your API key.';
    break;
  case 429:
    errorMessage = 'Rate limit exceeded. Please wait a moment and try again.';
    break;
  case 402:
    errorMessage = 'API quota exceeded. Please check your account.';
    break;
}
```

### User Feedback
```javascript
// Toast notifications for user feedback
if (result.success) {
  SuccessToast('Contract generated successfully');
} else {
  ErrorToast(result.error);
}
```

## Debugging

### Enable Debug Mode
```javascript
// In apiConfig.js
DEBUG_MODE: true,
ENABLE_LOGGING: true,
```

### Console Logs
The AI service provides detailed console logging:
- 🤖 AI service status
- 📝 Prompt and response logging
- ✅ Success operations
- ❌ Error details
- 🔍 Contract review process

### Service Status
```javascript
// Check AI configuration
const config = AIService.getAIConfigStatus();
console.log('AI Config:', config);
```

## Migration from Old Implementation

### Before (Old Implementation)
```javascript
// Old way - direct API call
const res = await axios.post(`${API_URL}/api/chat`, {
  prompt: promptText,
});
setImageSrc(res?.data?.message?.content);
```

### After (Enhanced Implementation)
```javascript
// New way - using AIService
const result = await AIService.generateContractContent(promptText);
if (result.success) {
  setImageSrc(result.content);
  SuccessToast(result.message);
} else {
  ErrorToast(result.error);
}
```

## Testing

### 1. Test AI Service Availability
```javascript
const testAIService = async () => {
  const status = await AIService.checkAIService();
  console.log('AI Service Status:', status);
};
```

### 2. Test Contract Generation
```javascript
const testContractGeneration = async () => {
  const result = await AIService.generateContractContent(
    'Create a simple NDA between Company A and Company B'
  );
  console.log('Generation Result:', result);
};
```

### 3. Test Contract Review
```javascript
const testContractReview = async () => {
  const contractText = 'This is a sample contract...';
  const result = await AIService.reviewContract(contractText);
  console.log('Review Result:', result);
};
```

## Troubleshooting

### Common Issues

1. **AI Service Not Available**
   - Check API keys in configuration
   - Verify network connectivity
   - Check service status with `AIService.checkAIService()`

2. **Rate Limiting**
   - Implement retry logic with exponential backoff
   - Check API quota usage
   - Consider upgrading API plan

3. **Authentication Errors**
   - Verify API keys are correct
   - Check API key permissions
   - Ensure keys are properly set in environment variables

4. **Invalid Responses**
   - Check AI service configuration
   - Verify prompt format
   - Review API response structure

### Debug Steps

1. **Enable Debug Mode**
   ```javascript
   DEBUG_MODE: true,
   ENABLE_LOGGING: true,
   ```

2. **Check Console Logs**
   - Look for 🤖, 📝, ✅, ❌ emoji indicators
   - Review error messages and stack traces

3. **Test API Connectivity**
   ```javascript
   const status = await AIService.checkAIService();
   console.log('Service Status:', status);
   ```

4. **Verify Configuration**
   ```javascript
   const config = AIService.getAIConfigStatus();
   console.log('AI Config:', config);
   ```

## Security Considerations

1. **API Key Management**
   - Store API keys in environment variables
   - Never commit keys to version control
   - Use different keys for development and production

2. **Request Validation**
   - Validate user input before sending to AI
   - Sanitize prompts to prevent injection attacks
   - Implement rate limiting on client side

3. **Response Validation**
   - Validate AI responses before displaying
   - Sanitize HTML content from AI
   - Implement content filtering

## Performance Optimization

1. **Caching**
   - Cache AI responses for similar prompts
   - Implement request deduplication
   - Store generated contracts locally

2. **Loading States**
   - Show loading indicators during AI operations
   - Implement progressive loading for large contracts
   - Provide user feedback for long operations

3. **Error Recovery**
   - Implement retry logic for failed requests
   - Provide fallback options when AI is unavailable
   - Graceful degradation for partial failures

## Future Enhancements

1. **Advanced AI Features**
   - Multi-language contract generation
   - Legal compliance checking
   - Contract template suggestions

2. **Integration Improvements**
   - Real-time collaboration features
   - Version control for contracts
   - Advanced editing capabilities

3. **User Experience**
   - AI-powered contract templates
   - Smart form filling
   - Automated contract analysis

## Support

For issues with AI integration:
1. Check the console logs for detailed error information
2. Verify API configuration and keys
3. Test AI service availability
4. Review network connectivity
5. Check API quota and rate limits 