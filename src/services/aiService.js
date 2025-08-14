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

  // Check AI service status (Mobile-compatible)
  static async checkAIService() {
    try {
      console.log('🔍 Checking AI service status...');
      
      // Check if API is configured
      if (!API_CONFIG.ENABLE_AI_FEATURES) {
        return { available: false, error: 'AI features are disabled' };
      }

      // Check if API keys are configured
      const isUsingOpenRouter = API_CONFIG.USE_OPENROUTER;
      const apiKey = isUsingOpenRouter
        ? API_CONFIG.OPENROUTER_API_KEY
        : API_CONFIG.OPENAI_API_KEY;
      
      if (!apiKey || apiKey === 'your-api-key-here') {
        return { available: false, error: 'API key not configured' };
      }

      // Test backend API availability
      try {
        const response = await fetch(`${API_CONFIG.API_URL}/health`, {
          method: 'GET',
          timeout: 5000
        });
        
        if (response.ok) {
          return { available: true, message: 'AI service is available' };
        } else {
          return { available: false, error: 'Backend service unavailable' };
        }
      } catch (error) {
        console.log('⚠️ Backend health check failed, but continuing with API keys...');
        // If backend is not available, we can still use direct API calls
        return { available: true, message: 'AI service available (direct API)' };
      }
      
    } catch (error) {
      console.error('❌ AI service status check failed:', error);
      return { available: false, error: error.message || 'Service check failed' };
    }
  }

  // Check contract clauses with AI using the backend API (Mobile-compatible endpoint)
  static async checkWithAi(contractText, prompt = '') {
    try {
      console.log("🔍 Starting AI contract analysis with text length:", contractText?.length || 0);
      console.log("📤 Base API URL:", API_CONFIG.API_URL);
      console.log("📝 Contract text preview:", contractText?.substring(0, 100) + "...");
      console.log("📝 AI Prompt:", prompt);

      // Get auth token from localStorage
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
      console.log("🔑 Auth token available:", !!token);

      // Use the /contract/checkWithAi endpoint (mobile-compatible)
      console.log("🔄 Using /contract/checkWithAi endpoint...");
      
      // Prepare request data exactly like mobile version
      const requestData = {
        text: contractText || 'Contract content will be added here...',
        prompt: prompt
      };

      console.log('📤 Sending AI Request to backend:', {
        url: `${API_CONFIG.API_URL}/contract/checkWithAi`,
        data: requestData
      });

      const response = await fetch(`${API_CONFIG.API_URL}/contract/checkWithAi`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(requestData)
      });

      console.log("📥 Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Server error response:", errorText);
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ AI Response from backend:', data);
      console.log('📊 Response structure:', {
        hasData: !!data,
        dataType: typeof data,
        keys: data ? Object.keys(data) : [],
        message: data?.message,
        data: data?.data,
        result: data?.result
      });

      // Handle different response structures exactly like mobile version
      let aiResponse = '';
      
      if (data) {
        // Try different possible response structures (mobile-compatible)
        if (data.botResponse) {
          aiResponse = data.botResponse;
        } else if (data.data) {
          aiResponse = data.data;
        } else if (data.message) {
          aiResponse = data.message;
        } else if (data.result) {
          aiResponse = data.result;
        } else if (data.response) {
          aiResponse = data.response;
        } else if (data.content) {
          aiResponse = data.content;
        } else if (data.text) {
          aiResponse = data.text;
        } else if (data.analysis) {
          aiResponse = data.analysis;
        } else if (typeof data === 'string') {
          aiResponse = data;
      } else {
          aiResponse = 'AI analysis completed successfully';
        }
      }

      // Clean up the AI response - remove markdown code blocks if present (mobile-compatible)
      let cleanAiResponse = aiResponse;
      console.log('🔧 Original AI Response:', aiResponse.substring(0, 200) + '...');
      
      if (aiResponse.includes('```html')) {
        // Extract content between ```html and ```
        const htmlMatch = aiResponse.match(/```html\s*([\s\S]*?)\s*```/);
        if (htmlMatch) {
          cleanAiResponse = htmlMatch[1];
          console.log('📝 Extracted HTML content:', cleanAiResponse.substring(0, 200) + '...');
        }
      }
      
      console.log('🎯 Final content to insert:', cleanAiResponse.substring(0, 200) + '...');

      // Extract highlighted sections if available
      let highlightedSections = [];
      if (data.highlightedSections && Array.isArray(data.highlightedSections)) {
        highlightedSections = data.highlightedSections;
      } else if (data.originalText && Array.isArray(data.originalText)) {
        highlightedSections = data.originalText;
      } else if (data.corrections && Array.isArray(data.corrections)) {
        // Convert grammar corrections to highlighted sections format
        highlightedSections = data.corrections.map((correction, index) => ({
          text: correction.original || correction.incorrect,
          originalText: correction.original || correction.incorrect,
          correctedText: correction.corrected || correction.suggestion,
          type: 'spelling',
          lineNumber: index + 1,
          title: `Grammar Error ${index + 1}`,
          description: correction.explanation || `Should be: ${correction.corrected || correction.suggestion}`
        }));
      } else if (data.suggestions && Array.isArray(data.suggestions)) {
        // Handle the actual API response format
        highlightedSections = data.suggestions.map((suggestion, index) => {
          const originalText = data.originalText.substring(suggestion.start, suggestion.end);
        return {
            text: originalText,
            originalText: originalText,
            correctedText: suggestion.suggestion || originalText,
            type: 'spelling',
            lineNumber: index + 1,
            title: `Grammar Error ${index + 1}`,
            description: suggestion.issue || suggestion.shortMessage || 'Spelling error detected'
          };
        });
      }

      console.log("📊 Extracted analysis length:", cleanAiResponse.length);
      console.log("🎯 Highlighted sections count:", highlightedSections.length);

      return {
        success: true,
        analysis: cleanAiResponse,
        highlightedSections: highlightedSections,
        message: 'AI contract analysis completed successfully'
      };

    } catch (error) {
      console.error('❌ AI Contract Analysis Error:', error);
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      return {
        success: false,
        analysis: '',
        highlightedSections: [],
        message: error.message || 'Failed to analyze contract with AI'
      };
    }
  }

  // Check contract clauses with AI using the backend API (Legacy grammar endpoint)
  static async checkClausesWithAI(contractText) {
    try {
      console.log("🔍 Starting grammar check with text length:", contractText?.length || 0);
      console.log("📤 Base API URL:", API_CONFIG.API_URL);
      console.log("📝 Contract text preview:", contractText?.substring(0, 100) + "...");

      // Get auth token from localStorage
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
      console.log("🔑 Auth token available:", !!token);

      // Use the /contract/checkGrammar endpoint
      console.log("🔄 Using /contract/checkGrammar endpoint...");
      // Use direct fetch with hardcoded URL
      console.log("🔄 Using direct fetch with hardcoded URL...");
      const response = await fetch('http://13.57.230.64:4000/contract/checkGrammar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          text: contractText
        })
      });

      console.log("📥 Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Server error response:", errorText);
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("🤖 Response data received:", data);

      // Extract analysis text from various possible response structures
      let analysis = '';
      if (data.response) {
        analysis = data.response;
      } else if (data.message) {
        analysis = data.message;
      } else if (data.content) {
        analysis = data.content;
      } else if (data.text) {
        analysis = data.text;
      } else if (data.analysis) {
        analysis = data.analysis;
      } else if (data.botResponse) {
        analysis = data.botResponse;
      } else if (data.result) {
        analysis = data.result;
      } else if (typeof data === 'string') {
        analysis = data;
      } else {
        analysis = JSON.stringify(data);
      }

      // Extract highlighted sections if available
      let highlightedSections = [];
      if (data.highlightedSections && Array.isArray(data.highlightedSections)) {
        highlightedSections = data.highlightedSections;
      } else if (data.originalText && Array.isArray(data.originalText)) {
        highlightedSections = data.originalText;
      } else if (data.corrections && Array.isArray(data.corrections)) {
        // Convert grammar corrections to highlighted sections format
        highlightedSections = data.corrections.map((correction, index) => ({
          text: correction.original || correction.incorrect,
          originalText: correction.original || correction.incorrect,
          correctedText: correction.corrected || correction.suggestion,
          type: 'spelling',
          lineNumber: index + 1,
          title: `Grammar Error ${index + 1}`,
          description: correction.explanation || `Should be: ${correction.corrected || correction.suggestion}`
        }));
      } else if (data.suggestions && Array.isArray(data.suggestions)) {
        // Handle the actual API response format
        highlightedSections = data.suggestions.map((suggestion, index) => {
          const originalText = data.originalText.substring(suggestion.start, suggestion.end);
          return {
            text: originalText,
            originalText: originalText,
            correctedText: suggestion.suggestion || originalText,
            type: 'spelling',
            lineNumber: index + 1,
            title: `Grammar Error ${index + 1}`,
            description: suggestion.issue || suggestion.shortMessage || 'Spelling error detected'
          };
        });
      }

      console.log("📊 Extracted analysis length:", analysis.length);
      console.log("🎯 Highlighted sections count:", highlightedSections.length);

      return {
        success: true,
        analysis: analysis,
        highlightedSections: highlightedSections,
        message: 'Grammar check completed successfully'
      };

    } catch (error) {
      console.error('❌ Grammar Check Error:', error);
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      return {
        success: false,
        analysis: '',
        highlightedSections: [],
        message: error.message || 'Failed to check grammar'
      };
    }
  }

  // Helper method to format grammar corrections
  static formatGrammarCorrections(corrections) {
    if (!Array.isArray(corrections)) {
      return 'Grammar check completed.';
    }

    let formattedResponse = '1. **SPELLING & GRAMMAR ERRORS**:\n';
    
    corrections.forEach((correction, index) => {
      const original = correction.original || correction.incorrect || 'unknown';
      const corrected = correction.corrected || correction.suggestion || 'corrected';
      const explanation = correction.explanation || `Should be: ${corrected}`;
      
      formattedResponse += `${index + 1}. "${original}" should be "${corrected}" - ${explanation}\n`;
    });

    return formattedResponse;
  }

  // Smart Template System (Mobile-compatible)
  static getContractTemplates() {
    return [
      {
        id: 'nda',
        title: 'NDA (Non-Disclosure Agreement)',
        category: 'Confidentiality',
        description: 'Protect confidential information and trade secrets',
        sections: [
          'Confidentiality clauses',
          'Non-use and non-disclosure terms',
          'Return of materials',
          'Governing law'
        ],
        keywords: ['nda', 'non-disclosure', 'confidentiality', 'secrets']
      },
      {
        id: 'employment',
        title: 'Employment Agreement',
        category: 'Employment',
        description: 'Define employment terms and conditions',
        sections: [
          'Position and duties',
          'Compensation structure',
          'Benefits and termination',
          'Non-compete clauses'
        ],
        keywords: ['employment', 'job', 'hire', 'employee', 'work']
      },
      {
        id: 'service',
        title: 'Service Agreement',
        category: 'Services',
        description: 'Define service delivery terms',
        sections: [
          'Scope of services',
          'Compensation terms',
          'Deliverables timeline',
          'Intellectual property rights'
        ],
        keywords: ['service', 'consulting', 'freelance', 'contractor']
      },
      {
        id: 'software',
        title: 'Software Development',
        category: 'Technology',
        description: 'Software development and licensing terms',
        sections: [
          'Development phases',
          'Project timeline',
          'Deliverables',
          'Warranties and support'
        ],
        keywords: ['software', 'development', 'app', 'programming', 'code']
      }
    ];
  }

  // Smart Template Selection (Mobile-compatible)
  static selectTemplate(prompt) {
    const templates = this.getContractTemplates();
    const promptLower = prompt.toLowerCase();
    
    // Find best matching template
    let bestMatch = null;
    let bestScore = 0;
    
    templates.forEach(template => {
      let score = 0;
      
      // Check keywords
      template.keywords.forEach(keyword => {
        if (promptLower.includes(keyword)) {
          score += 2;
        }
      });
      
      // Check title
      if (promptLower.includes(template.title.toLowerCase())) {
        score += 3;
      }
      
      // Check category
      if (promptLower.includes(template.category.toLowerCase())) {
        score += 1;
      }
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = template;
      }
    });
    
    return bestMatch || templates[0]; // Default to first template if no match
  }

  // Dynamic Content Generation (Mobile-compatible)
  static generateTemplateContent(template, userDetails = {}) {
    const { names = [], locations = [], companies = [] } = userDetails;
    
    let content = `<h1>${template.title}</h1>`;
    content += `<p><strong>Category:</strong> ${template.category}</p>`;
    content += `<p><strong>Description:</strong> ${template.description}</p>`;
    content += `<hr>`;
    
    // Add template-specific content
    switch (template.id) {
      case 'nda':
        content += this.generateNDAContent(names, companies);
        break;
      case 'employment':
        content += this.generateEmploymentContent(names, companies);
        break;
      case 'service':
        content += this.generateServiceContent(names, companies);
        break;
      case 'software':
        content += this.generateSoftwareContent(names, companies);
        break;
      default:
        content += this.generateGenericContent(names, companies);
    }
    
    return content;
  }

  // Template-specific content generators
  static generateNDAContent(names, companies) {
    const party1 = names[0] || '[PARTY 1 NAME]';
    const party2 = names[1] || '[PARTY 2 NAME]';
    const company1 = companies[0] || '[COMPANY 1]';
    const company2 = companies[1] || '[COMPANY 2]';
    
    return `
      <h2>NON-DISCLOSURE AGREEMENT</h2>
      
      <h3>Parties</h3>
      <p>This Non-Disclosure Agreement (the "Agreement") is entered into on [DATE] by and between:</p>
      <p><strong>${party1}</strong> (${company1}) ("Disclosing Party")</p>
      <p><strong>${party2}</strong> (${company2}) ("Receiving Party")</p>
      
      <h3>Purpose</h3>
      <p>The parties wish to explore a potential business relationship and may disclose confidential information to each other.</p>
      
      <h3>Confidential Information</h3>
      <p>"Confidential Information" means any information disclosed by the Disclosing Party to the Receiving Party, either directly or indirectly, in writing, orally or by inspection of tangible objects, which is designated as "Confidential," "Proprietary" or some similar designation.</p>
      
      <h3>Non-Use and Non-Disclosure</h3>
      <p>The Receiving Party agrees not to use any Confidential Information for any purpose except to evaluate and engage in discussions concerning a potential business relationship between the parties.</p>
      
      <h3>Return of Materials</h3>
      <p>Upon the termination of this Agreement, the Receiving Party will return to the Disclosing Party all copies of Confidential Information in tangible form.</p>
      
      <h3>Term</h3>
      <p>This Agreement will remain in effect for a period of [DURATION] from the date of this Agreement.</p>
      
      <h3>Governing Law</h3>
      <p>This Agreement will be governed by the laws of [JURISDICTION].</p>
      
      <h3>Signatures</h3>
      <p>IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.</p>
      
      <p><strong>${party1}</strong><br>
      Date: _________________</p>
      
      <p><strong>${party2}</strong><br>
      Date: _________________</p>
    `;
  }

  static generateEmploymentContent(names, companies) {
    const employee = names[0] || '[EMPLOYEE NAME]';
    const employer = companies[0] || '[EMPLOYER COMPANY]';
    const position = '[POSITION TITLE]';
    
    return `
      <h2>EMPLOYMENT AGREEMENT</h2>
      
      <h3>Parties</h3>
      <p>This Employment Agreement (the "Agreement") is entered into on [DATE] by and between:</p>
      <p><strong>${employer}</strong> ("Employer")</p>
      <p><strong>${employee}</strong> ("Employee")</p>
      
      <h3>Position and Duties</h3>
      <p>Employee will serve as ${position} and will perform such duties as may be assigned by Employer from time to time.</p>
      
      <h3>Compensation</h3>
      <p>Employee will receive an annual salary of [SALARY AMOUNT] payable in accordance with Employer's standard payroll practices.</p>
      
      <h3>Benefits</h3>
      <p>Employee will be eligible to participate in Employer's benefit plans in accordance with the terms of those plans.</p>
      
      <h3>Termination</h3>
      <p>Either party may terminate this Agreement with [NOTICE PERIOD] written notice to the other party.</p>
      
      <h3>Non-Compete</h3>
      <p>During employment and for [DURATION] thereafter, Employee will not compete with Employer in [GEOGRAPHIC AREA].</p>
      
      <h3>Governing Law</h3>
      <p>This Agreement will be governed by the laws of [JURISDICTION].</p>
      
      <h3>Signatures</h3>
      <p>IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.</p>
      
      <p><strong>${employer}</strong><br>
      Date: _________________</p>
      
      <p><strong>${employee}</strong><br>
      Date: _________________</p>
    `;
  }

  static generateServiceContent(names, companies) {
    const serviceProvider = names[0] || companies[0] || '[SERVICE PROVIDER]';
    const client = names[1] || companies[1] || '[CLIENT]';
    
    return `
      <h2>SERVICE AGREEMENT</h2>
      
      <h3>Parties</h3>
      <p>This Service Agreement (the "Agreement") is entered into on [DATE] by and between:</p>
      <p><strong>${serviceProvider}</strong> ("Service Provider")</p>
      <p><strong>${client}</strong> ("Client")</p>
      
      <h3>Scope of Services</h3>
      <p>Service Provider will provide the following services: [DESCRIPTION OF SERVICES]</p>
      
      <h3>Compensation</h3>
      <p>Client will pay Service Provider [COMPENSATION AMOUNT] for the services provided under this Agreement.</p>
      
      <h3>Timeline</h3>
      <p>Services will be completed by [COMPLETION DATE] unless otherwise agreed in writing.</p>
      
      <h3>Deliverables</h3>
      <p>Service Provider will deliver the following: [LIST OF DELIVERABLES]</p>
      
      <h3>Intellectual Property</h3>
      <p>All intellectual property created under this Agreement will belong to [OWNERSHIP TERMS].</p>
      
      <h3>Termination</h3>
      <p>Either party may terminate this Agreement with [NOTICE PERIOD] written notice.</p>
      
      <h3>Governing Law</h3>
      <p>This Agreement will be governed by the laws of [JURISDICTION].</p>
      
      <h3>Signatures</h3>
      <p>IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.</p>
      
      <p><strong>${serviceProvider}</strong><br>
      Date: _________________</p>
      
      <p><strong>${client}</strong><br>
      Date: _________________</p>
    `;
  }

  static generateSoftwareContent(names, companies) {
    const developer = names[0] || companies[0] || '[DEVELOPER]';
    const client = names[1] || companies[1] || '[CLIENT]';
    
    return `
      <h2>SOFTWARE DEVELOPMENT AGREEMENT</h2>
      
      <h3>Parties</h3>
      <p>This Software Development Agreement (the "Agreement") is entered into on [DATE] by and between:</p>
      <p><strong>${developer}</strong> ("Developer")</p>
      <p><strong>${client}</strong> ("Client")</p>
      
      <h3>Project Description</h3>
      <p>Developer will develop the following software: [PROJECT DESCRIPTION]</p>
      
      <h3>Development Phases</h3>
      <ul>
        <li>Phase 1: [DESCRIPTION] - [TIMELINE]</li>
        <li>Phase 2: [DESCRIPTION] - [TIMELINE]</li>
        <li>Phase 3: [DESCRIPTION] - [TIMELINE]</li>
      </ul>
      
      <h3>Deliverables</h3>
      <p>Developer will deliver: [LIST OF DELIVERABLES]</p>
      
      <h3>Compensation</h3>
      <p>Client will pay Developer [COMPENSATION AMOUNT] for the development services.</p>
      
      <h3>Intellectual Property</h3>
      <p>All intellectual property rights in the developed software will belong to [OWNERSHIP TERMS].</p>
      
      <h3>Warranties</h3>
      <p>Developer warrants that the software will function as specified for [WARRANTY PERIOD].</p>
      
      <h3>Support</h3>
      <p>Developer will provide support and maintenance for [SUPPORT PERIOD].</p>
      
      <h3>Governing Law</h3>
      <p>This Agreement will be governed by the laws of [JURISDICTION].</p>
      
      <h3>Signatures</h3>
      <p>IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.</p>
      
      <p><strong>${developer}</strong><br>
      Date: _________________</p>
      
      <p><strong>${client}</strong><br>
      Date: _________________</p>
    `;
  }

  static generateGenericContent(names, companies) {
    const party1 = names[0] || '[PARTY 1]';
    const party2 = names[1] || '[PARTY 2]';
    
    return `
      <h2>CONTRACT AGREEMENT</h2>
      
      <h3>Parties</h3>
      <p>This Agreement is entered into on [DATE] by and between:</p>
      <p><strong>${party1}</strong></p>
      <p><strong>${party2}</strong></p>
      
      <h3>Purpose</h3>
      <p>[DESCRIBE THE PURPOSE OF THIS AGREEMENT]</p>
      
      <h3>Terms and Conditions</h3>
      <p>[SPECIFY THE TERMS AND CONDITIONS]</p>
      
      <h3>Payment Terms</h3>
      <p>[SPECIFY PAYMENT TERMS IF APPLICABLE]</p>
      
      <h3>Termination</h3>
      <p>[SPECIFY TERMINATION CONDITIONS]</p>
      
      <h3>Governing Law</h3>
      <p>This Agreement will be governed by the laws of [JURISDICTION].</p>
      
      <h3>Signatures</h3>
      <p>IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.</p>
      
      <p><strong>${party1}</strong><br>
      Date: _________________</p>
      
      <p><strong>${party2}</strong><br>
      Date: _________________</p>
    `;
  }

  // Mock AI Service for Free Testing (Mobile-compatible)
  static async mockAIService(prompt, contractText = '') {
    try {
      console.log('🤖 Using Mock AI Service for testing...');
      console.log('📝 Prompt:', prompt);
      console.log('📄 Contract text length:', contractText.length);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Select template based on prompt
      const template = this.selectTemplate(prompt);
      console.log('📋 Selected template:', template.title);

      // Extract user details
      const userDetails = this.extractUserDetails(prompt);
      console.log('👥 Extracted details:', userDetails);

      // Generate content
      const content = this.generateTemplateContent(template, userDetails);

      // Add some AI analysis
      const analysis = `
        <h2>AI Analysis Results</h2>
        <p><strong>Template Used:</strong> ${template.title}</p>
        <p><strong>Analysis:</strong> This contract has been generated using the ${template.title} template. The content includes all standard legal sections and follows best practices for contract drafting.</p>
        
        <h3>Key Sections Included:</h3>
        <ul>
          ${template.sections.map(section => `<li>${section}</li>`).join('')}
        </ul>
        
        <h3>Recommendations:</h3>
        <ul>
          <li>Review all placeholder text and replace with actual information</li>
          <li>Verify governing law and jurisdiction</li>
          <li>Ensure all parties are correctly identified</li>
          <li>Add specific terms and conditions as needed</li>
        </ul>
        
        <hr>
        ${content}
      `;

      return {
        success: true,
        analysis: analysis,
        highlightedSections: [],
        message: `Generated contract using ${template.title} template (Mock AI)`
      };

    } catch (error) {
      console.error('❌ Mock AI Service Error:', error);
      return {
        success: false,
        analysis: '',
        highlightedSections: [],
        message: error.message || 'Mock AI service failed'
      };
    }
  }

  // Enhanced contract generation with smart template selection (Mobile-compatible)
  static async generateContractWithTemplates(prompt, existingContent = '') {
    try {
      console.log('🤖 Starting smart contract generation with templates...');
      console.log('📝 Prompt:', prompt);
      
      // Select appropriate template based on prompt
      const selectedTemplate = this.selectTemplate(prompt);
      console.log('📋 Selected template:', selectedTemplate.title);
      
      // Extract user details from prompt
      const userDetails = this.extractUserDetails(prompt);
      console.log('👥 Extracted user details:', userDetails);
      
      // Generate template-based content
      const templateContent = this.generateTemplateContent(selectedTemplate, userDetails);
      
      // If we have existing content, merge it
      if (existingContent) {
        const enhancedPrompt = `Template: ${selectedTemplate.title}\n\nExisting Content:\n${existingContent}\n\nUser Request: ${prompt}\n\nPlease enhance the existing content based on the template structure and user requirements.`;
        
        // Use AI to enhance the content
        const aiResult = await this.generateContractContent(enhancedPrompt, existingContent);
        
        if (aiResult.success) {
          return {
            success: true,
            content: aiResult.content,
            template: selectedTemplate,
            message: `Generated contract using ${selectedTemplate.title} template`
          };
        }
      }
      
      // Return template content if no AI enhancement needed
      return {
        success: true,
        content: templateContent,
        template: selectedTemplate,
        message: `Generated contract using ${selectedTemplate.title} template`
      };
      
    } catch (error) {
      console.error('❌ Smart contract generation error:', error);
      return {
        success: false,
        content: '',
        error: error.message || 'Failed to generate contract with templates'
      };
    }
  }

  // Extract user details from prompt (Mobile-compatible)
  static extractUserDetails(prompt) {
    const details = {
      names: [],
      companies: [],
      locations: [],
      amounts: []
    };
    
    // Extract names (simple pattern matching)
    const namePattern = /\b([A-Z][a-z]+ [A-Z][a-z]+)\b/g;
    const names = prompt.match(namePattern);
    if (names) {
      details.names = names;
    }
    
    // Extract companies
    const companyPattern = /\b([A-Z][a-zA-Z\s&]+(?:Inc|Corp|LLC|Ltd|Company|Co))\b/g;
    const companies = prompt.match(companyPattern);
    if (companies) {
      details.companies = companies;
    }
    
    // Extract locations
    const locationPattern = /\b([A-Z][a-z]+(?: [A-Z][a-z]+)*,?\s*[A-Z]{2})\b/g;
    const locations = prompt.match(locationPattern);
    if (locations) {
      details.locations = locations;
    }
    
    // Extract amounts
    const amountPattern = /\$[\d,]+(?:\.\d{2})?/g;
    const amounts = prompt.match(amountPattern);
    if (amounts) {
      details.amounts = amounts;
    }
    
    return details;
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