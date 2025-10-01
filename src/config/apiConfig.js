// API Configuration for src
//
// 🔐 API KEY SETUP INSTRUCTIONS:
//
// Method 1 (Recommended - Most Secure):
// 1. Create a .env file in your project root
// 2. Add your API keys:
//    REACT_APP_API_URL=your-api-url-here
//    OPENAI_API_KEY=your-openai-key-here
//    OPENROUTER_API_KEY=your-openrouter-key-here
// 3. Add .env to .gitignore to keep keys secure
//
// Method 2 (Quick Testing):
// 1. Replace the API URLs directly in this file
// 2. Remove the process.env.REACT_APP_API_URL || part
// 3. Add your key directly: API_URL: 'your-url-here'
//
// Method 3 (Free Testing):
// 1. Set USE_MOCK_API: true to use free mock AI
// 2. No API key needed for testing

export const API_CONFIG = {
  // API URLs - Development
  API_URL: process.env.REACT_APP_API_URL || "http://13.57.230.64:4000",

  // Alternative URLs (uncomment to use):
  // API_URL: "http://localhost:4000",
  // API_URL: "http://192.168.18.26:3001",
  // API_URL: "https://backend.pocketfiler.com",
  // API_URL: "https://api.pocketfiler.com",

  // API Timeout
  TIMEOUT: 10000,

  // Feature Flags
  DEBUG_MODE: true, // Enable detailed logging for testing
  ENABLE_LOGGING: true, // Enable API request/response logging

  // AI Configuration
  ENABLE_AI_FEATURES: true, // Set to false to disable AI features
  USE_MOCK_API: false, // Set to true to use free mock AI
  USE_OPENROUTER: true, // Set to true to use OpenRouter instead of OpenAI

  // OpenAI Configuration - Updated to match src2
  OPENAI_API_KEY:
    process.env.OPENAI_API_KEY ||
    "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",
  OPENAI_MODEL: "gpt-3.5-turbo",
  OPENAI_MAX_TOKENS: 1000,
  OPENAI_TEMPERATURE: 0.7,
  OPENAI_ENDPOINT: "https://api.openai.com/v1/chat/completions",

  // OpenRouter Configuration - Optimized for Contract Generation
  OPENROUTER_API_KEY:
    process.env.OPENROUTER_API_KEY ||
    "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",
  OPENROUTER_MODEL: "openai/gpt-4o-mini", // Cost-effective but powerful model
  OPENROUTER_MAX_TOKENS: 1500, // Increased for longer contracts
  OPENROUTER_TEMPERATURE: 0.3, // Lower temperature for more consistent legal writing
  OPENROUTER_ENDPOINT: "https://openrouter.ai/api/v1/chat/completions",

  // Alternative OpenRouter Models (uncomment to use):
  // OPENROUTER_MODEL: 'anthropic/claude-3-haiku', // Fast and cost-effective
  // OPENROUTER_MODEL: 'google/gemini-pro', // Good for structured content
  // OPENROUTER_MODEL: 'openai/gpt-4o', // Most powerful but expensive
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    FORGOT_PASSWORD: "/auth/forgot",
    RESET_PASSWORD: "/auth/resetpassword",
    VERIFY_CODE: "/auth/verify/code",
    UPDATE_VERIFICATION_CODE: "/auth/updateVerificationCode",
    GET_USER_BY_ID: "/auth/getuserByid",
    GOOGLE_SIGNUP: "/auth/googlesignname",
    LINKEDIN_LOGIN: "/linkedin/login",
    GET_TERMS_AND_CONDITIONS: "/auth/getTermAndConditions",
  },
  USER: {
    GET_PROFILE: "/api/getUserInfo",
    UPDATE_PROFILE: "/api/updateUser",
    GET_PROFILE_IMAGE: "/api/getUserProfileImage",
    ADD_WALLET_ADDRESS: "/api/addWallet",
    ADD_EMAIL_ADDRESS: "/api/addEmailAddress",
    ADD_EMAIL_ADDRESS_GOOGLE: "/api/addEmailAddressGoogle",
  },
  CONTRACT: {
    GET_TEMPLATES: "/contract/getTemplates",
    CREATE_CONTRACT: "/contract/create",
    GET_CONTRACTS: "/contract/getContracts",
    GET_CONTRACT_BY_ID: "/contract/getContractById",
    CREATE_CONTRACT_API: "/contract/createContract",
    UPLOAD_CONTRACT_FILE: "/contract/uploadContractFile",
    CHECK_WITH_AI: "/contract/checkWithAi", // Mobile-compatible AI endpoint
    CHECK_GRAMMAR: "/contract/checkGrammar", // Legacy grammar endpoint
  },
  AI_CHAT: {
    CREATE_CHAT: "/ai/chat",
    GET_CHAT_HISTORY: "/ai/chat",
    GET_SINGLE_CHAT: "/ai/chat/:chatId/history",
    SEND_MESSAGE: "/ai/chat/:chatId/message",
    UPDATE_CHAT_TITLE: "/ai/chat/:chatId/title",
    DELETE_CHAT: "/ai/chat/:chatId",
  },
  PROJECT: {
    GET_PROJECTS: "/project/getProjects",
    CREATE_PROJECT: "/project/create",
    GET_PROJECT_BY_ID: "/project/getProjectById",
  },
  AI: {
    CHAT: "/api/chat",
  },
  REFERRAL: {
    GET_LINK: "/auth/referral/link",
    GET_REWARDS: "/auth/referral/rewards",
    GET_LIST: "/auth/referral/list",
    REDEEM: "/auth/referral/redeem",
  },
};

// Enhanced Contract AI Prompts for OpenRouter
export const CONTRACT_AI_PROMPTS = {
  SYSTEM_PROMPT: `You are a professional legal contract writer with expertise in creating comprehensive, legally sound documents. 

Your task is to generate professional contract content based on user requirements.

CRITICAL INSTRUCTIONS:
1. ALWAYS fill in actual details when the user provides them
2. If user mentions specific names, addresses, locations, or details - USE THEM DIRECTLY
3. Only use [PLACEHOLDERS] for information the user hasn't specified
4. Replace existing placeholders with real information when available
5. Format all responses in clean HTML with proper structure
6. Use clear headings (h1, h2, h3) for different sections
7. Include standard contract sections: Parties, Purpose, Terms, Conditions, Termination, Governing Law, Signatures
8. Make content legally comprehensive but accessible
9. Use professional legal language while maintaining clarity
10. Structure content with proper paragraphs and lists
11. Ensure all sections are complete and well-organized

HTML FORMATTING:
- Use <h1> for main title
- Use <h2> for major sections
- Use <h3> for subsections
- Use <p> for paragraphs
- Use <ul><li> for lists
- Use <strong> for emphasis
- Use <br> for line breaks where needed

EXAMPLE: If user says "contract between John and Mary from New York", fill in:
- Lessor: John
- Lessee: Mary
- Addresses: New York (or specific addresses if provided)
- Governing Law: New York law`,

  USER_PROMPT_TEMPLATE: (
    userPrompt
  ) => `Generate a professional contract for: ${userPrompt}

CRITICAL REQUIREMENTS:
- Fill in ALL actual details mentioned by the user (names, addresses, locations, etc.)
- Replace [PLACEHOLDERS] with real information when available
- Only use [PLACEHOLDERS] for information not specified by the user
- Create a complete, legally sound contract
- Include all standard contract sections
- Use proper HTML formatting
- Make it comprehensive and professional
- Include relevant legal clauses and protections
- Add signature blocks at the end
- Apply the appropriate governing law based on the user's location/requirements

The contract should be ready for use with minimal editing needed.`,
};

// Enhanced Error Messages for OpenRouter (matching src2)
export const AI_ERROR_MESSAGES = {
  API_KEY_MISSING:
    "OpenRouter API key is not configured. Please add your API key to the configuration.",
  API_REQUEST_FAILED:
    "Failed to connect to OpenRouter API. Please check your internet connection.",
  INVALID_RESPONSE:
    "Received invalid response from AI service. Please try again.",
  RATE_LIMIT: "Rate limit exceeded. Please wait a moment and try again.",
  QUOTA_EXCEEDED: "API quota exceeded. Please check your OpenRouter account.",
  GENERIC_ERROR:
    "An error occurred while generating AI content. Please try again.",
  OPENROUTER_SPECIFIC:
    "OpenRouter service error. Please check your API key and account status.",
};

// Error Messages
export const API_ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your internet connection.",
  TIMEOUT_ERROR: "Request timeout. Please try again.",
  UNAUTHORIZED: "Unauthorized access. Please login again.",
  FORBIDDEN: "Access forbidden. Please check your permissions.",
  NOT_FOUND: "Resource not found.",
  SERVER_ERROR: "Server error. Please try again later.",
  GENERIC_ERROR: "An error occurred. Please try again.",
  INVALID_RESPONSE: "Invalid response from server.",
  AUTH_REQUIRED: "Authentication required. Please login.",
  TOKEN_EXPIRED: "Session expired. Please login again.",
  // AI-specific error messages
  API_KEY_MISSING:
    "OpenAI API key is not configured. Please add your API key to the configuration.",
  API_REQUEST_FAILED:
    "Failed to connect to AI API. Please check your internet connection.",
  RATE_LIMIT: "Rate limit exceeded. Please wait a moment and try again.",
  QUOTA_EXCEEDED: "API quota exceeded. Please check your AI service account.",
  OPENROUTER_SPECIFIC:
    "OpenRouter service error. Please check your API key and account status.",
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TIMEOUT: 408,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
};
