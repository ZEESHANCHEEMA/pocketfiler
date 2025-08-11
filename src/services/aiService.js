import api from './apiInterceptor';
import { API_CONFIG, API_ENDPOINTS, CONTRACT_AI_PROMPTS, API_ERROR_MESSAGES } from '../config/apiConfig';

class AIService {
  // Enhanced contract generation using direct API calls (like src2)
  static async generateContractContent(prompt, existingContent = '') {
    try {
      if (!prompt.trim()) {
        throw new Error('Please enter a prompt for contract generation');
      }

      // Check if AI features are enabled
      if (!API_CONFIG.ENABLE_AI_FEATURES) {
        throw new Error('AI features are currently disabled');
      }

      console.log('🤖 Generating contract content with AI...');
      console.log('📝 Prompt:', prompt);
      console.log('📄 Existing content length:', existingContent.length);

      // Check if using OpenRouter or OpenAI
      const isUsingOpenRouter = API_CONFIG.USE_OPENROUTER;
      const apiKey = isUsingOpenRouter
        ? API_CONFIG.OPENROUTER_API_KEY
        : API_CONFIG.OPENAI_API_KEY;
      const endpoint = isUsingOpenRouter
        ? API_CONFIG.OPENROUTER_ENDPOINT
        : API_CONFIG.OPENAI_ENDPOINT;
      const model = isUsingOpenRouter
        ? API_CONFIG.OPENROUTER_MODEL
        : API_CONFIG.OPENAI_MODEL;
      const maxTokens = isUsingOpenRouter
        ? API_CONFIG.OPENROUTER_MAX_TOKENS
        : API_CONFIG.OPENAI_MAX_TOKENS;
      const temperature = isUsingOpenRouter
        ? API_CONFIG.OPENROUTER_TEMPERATURE
        : API_CONFIG.OPENAI_TEMPERATURE;

      // Debug logging
      console.log('🔧 AI Configuration:');
      console.log('- Using OpenRouter:', isUsingOpenRouter);
      console.log('- Model:', model);
      console.log('- Max Tokens:', maxTokens);
      console.log('- Temperature:', temperature);
      console.log('- Endpoint:', endpoint);

      // Check if API key is configured
      if (!apiKey || apiKey === 'your-api-key-here') {
        throw new Error(isUsingOpenRouter
          ? 'OpenRouter API key is not configured'
          : 'OpenAI API key is not configured');
      }

      // Prepare headers based on API provider
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      };

      // Add OpenRouter-specific headers for app attribution (optional)
      if (isUsingOpenRouter) {
        headers['HTTP-Referer'] = 'https://pocketfiler.app';
        headers['X-Title'] = 'PocketFiler';
      }

      // Create enhanced prompt that includes existing content
      const enhancedPrompt = existingContent
        ? `Existing Contract Content:\n${existingContent}\n\nUser Request: ${prompt}\n\nCRITICAL INSTRUCTIONS:\n1. Fill in ALL actual details mentioned by the user (names, addresses, locations, etc.)\n2. Replace [PLACEHOLDERS] with real information when available\n3. Only use [PLACEHOLDERS] for information not specified by the user\n4. Make the contract specific to the actual parties and location mentioned`
        : prompt;

      const requestBody = {
        model: model,
        messages: [
          {
            role: 'system',
            content: CONTRACT_AI_PROMPTS.SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: CONTRACT_AI_PROMPTS.USER_PROMPT_TEMPLATE(enhancedPrompt),
          },
        ],
        max_tokens: maxTokens,
        temperature: temperature,
      };

      console.log('📤 Sending AI Request:');
      console.log('- Prompt:', prompt);
      console.log('- Request Body:', JSON.stringify(requestBody, null, 2));

      // Real API call (OpenRouter or OpenAI)
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody),
      });

      console.log('📥 AI Response Status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ AI API Error:', errorData);

        let errorMessage = API_ERROR_MESSAGES.API_REQUEST_FAILED;

        if (response.status === 401) {
          errorMessage = isUsingOpenRouter
            ? 'Invalid OpenRouter API key. Please check your API key.'
            : 'Invalid API key. Please check your OpenAI API key.';
        } else if (response.status === 429) {
          errorMessage = API_ERROR_MESSAGES.RATE_LIMIT;
        } else if (response.status === 402) {
          errorMessage = API_ERROR_MESSAGES.QUOTA_EXCEEDED;
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('✅ AI Response Data:', data);

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error(API_ERROR_MESSAGES.INVALID_RESPONSE);
      }

      const aiResponse = data.choices[0].message.content;
      console.log('🤖 AI Generated Content:', aiResponse);

      return {
        success: true,
        content: aiResponse,
        message: 'Contract content generated successfully'
      };
    } catch (error) {
      console.error('❌ AI generation error:', error);
      
      let errorMessage = API_ERROR_MESSAGES.GENERIC_ERROR;
      
      if (error.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  }

  // Enhanced contract review and suggestions using direct API calls
  static async reviewContract(contractContent) {
    try {
      if (!contractContent || contractContent.trim() === '') {
        throw new Error('No contract content provided for review');
      }

      console.log('🔍 Reviewing contract content...');

      // Check if using OpenRouter or OpenAI
      const isUsingOpenRouter = API_CONFIG.USE_OPENROUTER;
      const apiKey = isUsingOpenRouter
        ? API_CONFIG.OPENROUTER_API_KEY
        : API_CONFIG.OPENAI_API_KEY;
      const endpoint = isUsingOpenRouter
        ? API_CONFIG.OPENROUTER_ENDPOINT
        : API_CONFIG.OPENAI_ENDPOINT;
      const model = isUsingOpenRouter
        ? API_CONFIG.OPENROUTER_MODEL
        : API_CONFIG.OPENAI_MODEL;
      const maxTokens = isUsingOpenRouter
        ? API_CONFIG.OPENROUTER_MAX_TOKENS
        : API_CONFIG.OPENAI_MAX_TOKENS;
      const temperature = isUsingOpenRouter
        ? API_CONFIG.OPENROUTER_TEMPERATURE
        : API_CONFIG.OPENAI_TEMPERATURE;

      // Check if API key is configured
      if (!apiKey || apiKey === 'your-api-key-here') {
        throw new Error(isUsingOpenRouter
          ? 'OpenRouter API key is not configured'
          : 'OpenAI API key is not configured');
      }

      // Prepare headers based on API provider
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      };

      // Add OpenRouter-specific headers for app attribution (optional)
      if (isUsingOpenRouter) {
        headers['HTTP-Referer'] = 'https://pocketfiler.app';
        headers['X-Title'] = 'PocketFiler';
      }

      const reviewPrompt = `Please review this contract and provide detailed suggestions for improvement. Analyze the contract for:
1. Missing essential clauses
2. Legal compliance issues
3. Ambiguous language
4. Incomplete sections
5. Best practices recommendations

Contract content to review: ${contractContent}

Please provide your analysis in a structured format with clear sections.`;

      const requestBody = {
        model: model,
        messages: [
          {
            role: 'system',
            content: 'You are a professional legal contract reviewer with expertise in contract law and best practices.',
          },
          {
            role: 'user',
            content: reviewPrompt,
          },
        ],
        max_tokens: maxTokens,
        temperature: temperature,
      };

      console.log('📤 Sending AI Review Request...');

      // Real API call (OpenRouter or OpenAI)
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ AI Review API Error:', errorData);

        let errorMessage = API_ERROR_MESSAGES.API_REQUEST_FAILED;

        if (response.status === 401) {
          errorMessage = isUsingOpenRouter
            ? 'Invalid OpenRouter API key. Please check your API key.'
            : 'Invalid API key. Please check your OpenAI API key.';
        } else if (response.status === 429) {
          errorMessage = API_ERROR_MESSAGES.RATE_LIMIT;
        } else if (response.status === 402) {
          errorMessage = API_ERROR_MESSAGES.QUOTA_EXCEEDED;
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('✅ AI Review Response Data:', data);

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error(API_ERROR_MESSAGES.INVALID_RESPONSE);
      }

      const aiResponse = data.choices[0].message.content;
      console.log('🤖 AI Review Content:', aiResponse);

      return {
        success: true,
        suggestions: aiResponse,
        message: 'Contract review completed'
      };
    } catch (error) {
      console.error('❌ Contract review error:', error);
      return {
        success: false,
        error: error.message || API_ERROR_MESSAGES.GENERIC_ERROR
      };
    }
  }

  // Generate contract clauses using direct API calls
  static async generateClauses(contractType, requirements = '') {
    try {
      const prompt = `Generate legal clauses for a ${contractType} contract. Requirements: ${requirements}`;
      
      console.log('📋 Generating clauses for:', contractType);

      // Check if using OpenRouter or OpenAI
      const isUsingOpenRouter = API_CONFIG.USE_OPENROUTER;
      const apiKey = isUsingOpenRouter
        ? API_CONFIG.OPENROUTER_API_KEY
        : API_CONFIG.OPENAI_API_KEY;
      const endpoint = isUsingOpenRouter
        ? API_CONFIG.OPENROUTER_ENDPOINT
        : API_CONFIG.OPENAI_ENDPOINT;
      const model = isUsingOpenRouter
        ? API_CONFIG.OPENROUTER_MODEL
        : API_CONFIG.OPENAI_MODEL;
      const maxTokens = isUsingOpenRouter
        ? API_CONFIG.OPENROUTER_MAX_TOKENS
        : API_CONFIG.OPENAI_MAX_TOKENS;
      const temperature = isUsingOpenRouter
        ? API_CONFIG.OPENROUTER_TEMPERATURE
        : API_CONFIG.OPENAI_TEMPERATURE;

      // Check if API key is configured
      if (!apiKey || apiKey === 'your-api-key-here') {
        throw new Error(isUsingOpenRouter
          ? 'OpenRouter API key is not configured'
          : 'OpenAI API key is not configured');
      }

      // Prepare headers based on API provider
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      };

      // Add OpenRouter-specific headers for app attribution (optional)
      if (isUsingOpenRouter) {
        headers['HTTP-Referer'] = 'https://pocketfiler.app';
        headers['X-Title'] = 'PocketFiler';
      }

      const requestBody = {
        model: model,
        messages: [
          {
            role: 'system',
            content: 'You are a professional legal contract writer with expertise in creating comprehensive, legally sound contract clauses.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: maxTokens,
        temperature: temperature,
      };

      // Real API call (OpenRouter or OpenAI)
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to generate clauses');
      }

      const data = await response.json();

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response from AI service');
      }

      const aiResponse = data.choices[0].message.content;

      return {
        success: true,
        clauses: aiResponse,
        message: 'Clauses generated successfully'
      };
    } catch (error) {
      console.error('❌ Clause generation error:', error);
      return {
        success: false,
        error: error.message || API_ERROR_MESSAGES.GENERIC_ERROR
      };
    }
  }

  // Translate contract content using direct API calls
  static async translateContract(content, targetLanguage) {
    try {
      if (!content || !targetLanguage) {
        throw new Error('Content and target language are required');
      }

      console.log('🌐 Translating contract to:', targetLanguage);

      // Check if using OpenRouter or OpenAI
      const isUsingOpenRouter = API_CONFIG.USE_OPENROUTER;
      const apiKey = isUsingOpenRouter
        ? API_CONFIG.OPENROUTER_API_KEY
        : API_CONFIG.OPENAI_API_KEY;
      const endpoint = isUsingOpenRouter
        ? API_CONFIG.OPENROUTER_ENDPOINT
        : API_CONFIG.OPENAI_ENDPOINT;
      const model = isUsingOpenRouter
        ? API_CONFIG.OPENROUTER_MODEL
        : API_CONFIG.OPENAI_MODEL;
      const maxTokens = isUsingOpenRouter
        ? API_CONFIG.OPENROUTER_MAX_TOKENS
        : API_CONFIG.OPENAI_MAX_TOKENS;
      const temperature = isUsingOpenRouter
        ? API_CONFIG.OPENROUTER_TEMPERATURE
        : API_CONFIG.OPENAI_TEMPERATURE;

      // Check if API key is configured
      if (!apiKey || apiKey === 'your-api-key-here') {
        throw new Error(isUsingOpenRouter
          ? 'OpenRouter API key is not configured'
          : 'OpenAI API key is not configured');
      }

      // Prepare headers based on API provider
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      };

      // Add OpenRouter-specific headers for app attribution (optional)
      if (isUsingOpenRouter) {
        headers['HTTP-Referer'] = 'https://pocketfiler.app';
        headers['X-Title'] = 'PocketFiler';
      }

      const requestBody = {
        model: model,
        messages: [
          {
            role: 'system',
            content: 'You are a professional translator with expertise in legal document translation.',
          },
          {
            role: 'user',
            content: `Translate this contract content to ${targetLanguage}: ${content}`,
          },
        ],
        max_tokens: maxTokens,
        temperature: temperature,
      };

      // Real API call (OpenRouter or OpenAI)
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to translate contract');
      }

      const data = await response.json();

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response from AI service');
      }

      const aiResponse = data.choices[0].message.content;

      return {
        success: true,
        translatedContent: aiResponse,
        message: `Contract translated to ${targetLanguage}`
      };
    } catch (error) {
      console.error('❌ Translation error:', error);
      return {
        success: false,
        error: error.message || API_ERROR_MESSAGES.GENERIC_ERROR
      };
    }
  }

  // Check if AI service is available using direct API calls
  static async checkAIService() {
    try {
      // Check if using OpenRouter or OpenAI
      const isUsingOpenRouter = API_CONFIG.USE_OPENROUTER;
      const apiKey = isUsingOpenRouter
        ? API_CONFIG.OPENROUTER_API_KEY
        : API_CONFIG.OPENAI_API_KEY;
      const endpoint = isUsingOpenRouter
        ? API_CONFIG.OPENROUTER_ENDPOINT
        : API_CONFIG.OPENAI_ENDPOINT;
      const model = isUsingOpenRouter
        ? API_CONFIG.OPENROUTER_MODEL
        : API_CONFIG.OPENAI_MODEL;

      // Check if API key is configured
      if (!apiKey || apiKey === 'your-api-key-here') {
        return {
          success: false,
          available: false,
          error: isUsingOpenRouter
            ? 'OpenRouter API key is not configured'
            : 'OpenAI API key is not configured'
        };
      }

      // Prepare headers based on API provider
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      };

      // Add OpenRouter-specific headers for app attribution (optional)
      if (isUsingOpenRouter) {
        headers['HTTP-Referer'] = 'https://pocketfiler.app';
        headers['X-Title'] = 'PocketFiler';
      }

      const requestBody = {
        model: model,
        messages: [
          {
            role: 'user',
            content: 'Test',
          },
        ],
        max_tokens: 10,
        temperature: 0,
      };

      // Test the AI service with a simple request
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody),
      });
      
      if (response.ok) {
        return {
          success: true,
          available: true,
          message: 'AI service is available'
        };
      } else {
        return {
          success: false,
          available: false,
          error: 'AI service is not responding'
        };
      }
    } catch (error) {
      console.error('❌ AI service check failed:', error);
      return {
        success: false,
        available: false,
        error: 'AI service is not available'
      };
    }
  }

  // Get AI configuration status
  static getAIConfigStatus() {
    return {
      aiEnabled: API_CONFIG.ENABLE_AI_FEATURES,
      useOpenRouter: API_CONFIG.USE_OPENROUTER,
      useMockAPI: API_CONFIG.USE_MOCK_API,
      debugMode: API_CONFIG.DEBUG_MODE,
      model: API_CONFIG.USE_OPENROUTER ? API_CONFIG.OPENROUTER_MODEL : API_CONFIG.OPENAI_MODEL
    };
  }
}

export default AIService; 