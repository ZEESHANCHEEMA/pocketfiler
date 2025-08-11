# API Configuration Setup

This directory contains the API configuration for the React application, following the same pattern as `src2` but adapted for the web application.

## Files

### `apiConfig.js`
Contains all API configuration including:
- API URLs for different environments
- API endpoints organized by feature
- Error messages
- HTTP status codes
- Feature flags for debugging

### `README.md`
This documentation file

## Configuration

### Environment Variables
Create a `.env` file in your project root with:
```
REACT_APP_API_URL=your-api-url-here
```

### API URLs
The following URLs are configured:
- Development: `http://13.57.230.64:4000`
- Local: `http://localhost:4000`
- Production: `https://backend.pocketfiler.com`

## Usage

### Importing Configuration
```javascript
import { API_CONFIG, API_ENDPOINTS, API_ERROR_MESSAGES } from '../config/apiConfig';
```

### Using API Endpoints
```javascript
import api from '../services/apiInterceptor';
import { API_ENDPOINTS } from '../config/apiConfig';

// Make API call
const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
```

### Using Auth Service
```javascript
import AuthService from '../services/authService';

// Login
const result = await AuthService.login(credentials);

// Check authentication
const isAuthenticated = AuthService.isAuthenticated();
```

### Using Login Service
```javascript
import LoginService from '../services/loginService';

// Login with credentials
const result = await LoginService.loginWithCredentials(email, password);

// Google login
const result = await LoginService.loginWithGoogle(googleData);

// LinkedIn login
const result = await LoginService.loginWithLinkedIn(linkedinCode);
```

## Features

### Enhanced Error Handling
- Network error detection
- Timeout handling
- Authentication error handling
- User-friendly error messages

### Logging
- Request/response logging (configurable)
- Error logging
- Authentication state logging

### Authentication
- Token management
- User data storage
- Automatic token injection in requests
- Automatic logout on authentication errors

### Backward Compatibility
- Maintains existing localStorage structure
- Compatible with existing Redux middleware
- No breaking changes to existing components

## Migration from Old Setup

The new setup is backward compatible. Existing code will continue to work, but you can gradually migrate to use the new services:

1. **Old way:**
```javascript
import { API_URL } from '../services/client';
const response = await axios.post(`${API_URL}/auth/login`, data);
```

2. **New way:**
```javascript
import { API_ENDPOINTS } from '../config/apiConfig';
import api from '../services/apiInterceptor';
const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, data);
```

Or even better:
```javascript
import LoginService from '../services/loginService';
const result = await LoginService.loginWithCredentials(email, password);
```

## Testing

To test the API setup:

1. Enable debug mode in `apiConfig.js`:
```javascript
DEBUG_MODE: true,
ENABLE_LOGGING: true,
```

2. Check browser console for detailed logs
3. Test different authentication scenarios
4. Verify error handling works correctly

## Troubleshooting

### Common Issues

1. **API URL not working**
   - Check the API_URL in `apiConfig.js`
   - Verify the server is running
   - Check network connectivity

2. **Authentication errors**
   - Verify token is being stored correctly
   - Check token expiration
   - Verify API endpoints are correct

3. **CORS errors**
   - Ensure the API server allows requests from your domain
   - Check if the API URL is correct

4. **Network errors**
   - Check internet connection
   - Verify API server is accessible
   - Check firewall settings

### Debug Mode

Enable debug mode to get detailed logs:
```javascript
DEBUG_MODE: true,
ENABLE_LOGGING: true,
```

This will log:
- All API requests and responses
- Authentication state changes
- Error details
- Token management

## Security

- API keys should be stored in environment variables
- Never commit API keys to version control
- Use HTTPS in production
- Implement proper token expiration handling
- Clear sensitive data on logout 