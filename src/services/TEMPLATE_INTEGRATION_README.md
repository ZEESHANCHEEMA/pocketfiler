# Contract Templates Integration

This document describes the enhanced contract templates integration in the `src` directory, following the same patterns as `src2` but adapted for the web application.

## Overview

The template integration provides the following features:
- **Template Loading**: Fetch templates from API
- **Template Selection**: Choose templates for contract creation
- **Template Preview**: Preview templates before selection
- **Template Application**: Apply templates to contract editor
- **Search and Filter**: Search through available templates

## Architecture

### 1. Redux Middleware (`src/services/redux/middleware/contractTemplates.js`)
- API calls for fetching templates
- Template selection and creation
- Error handling and logging

### 2. Redux Reducer (`src/services/redux/reducer/contractTemplates.js`)
- State management for templates
- Loading states and error handling
- Template selection and preview

### 3. Templates Screen (`src/Pages/Templates/Templates.js`)
- Main templates interface
- Search and filtering
- Template selection and preview

### 4. Contract Editor Integration
- Template application to editor
- Template content processing
- Navigation between templates and editor

## Features

### Template Loading
```javascript
import { getContractTemplates } from '../services/redux/middleware/contractTemplates';

// Load templates from API
dispatch(getContractTemplates());
```

### Template Selection
```javascript
const handleAddContract = (template) => {
  console.log('✅ Template Selected:', {
    id: template._id,
    title: template.title,
    category: template.category,
    description: template.description
  });
  
  // Navigate to contract editor with template data
  navigate('/ContractEditor', { state: { template } });
};
```

### Template Preview
```javascript
const handlePreview = (template) => {
  setPreviewModal({ show: true, template });
};
```

### Template Application
```javascript
// In ContractEditor component
if (location.state?.template) {
  const template = location.state.template;
  
  // Create template content for the editor
  const templateContent = `
    <h2>${template.title}</h2>
    <p><strong>Description:</strong> ${template.description}</p>
    <hr>
    <h3>Contract Content:</h3>
    <p>${template.content || 'Template content will be loaded here...'}</p>
    <br>
    <h4>Key Sections:</h4>
    <ul>
      <li>Parties involved</li>
      <li>Terms and conditions</li>
      <li>Responsibilities and obligations</li>
      <li>Payment terms (if applicable)</li>
      <li>Duration and termination</li>
      <li>Governing law</li>
    </ul>
    <br>
    <p><em>Please customize this template according to your specific requirements.</em></p>
  `;
  
  // Set the template content in the editor
  setImageSrc(templateContent);
  dispatch(setContractEditor(templateContent));
}
```

## Configuration

### API Endpoints
```javascript
// In src/config/apiConfig.js
export const API_ENDPOINTS = {
  CONTRACT: {
    GET_TEMPLATES: '/contract/getTemplates',
    GET_CONTRACT_BY_ID: '/contract/getContractById',
    CREATE_CONTRACT_API: '/contract/createContract',
  }
};
```

### Redux Store Integration
```javascript
// In src/services/redux/store.js
import contractTemplates from './reducer/contractTemplates';

const appReducer = combineReducers({
  // ... other reducers
  contractTemplates, // Add the contract templates reducer
});
```

## Usage Examples

### 1. Loading Templates
```javascript
// In a React component
const { templates, loading, error } = useSelector(state => state.contractTemplates);

useEffect(() => {
  dispatch(getContractTemplates());
}, [dispatch]);
```

### 2. Template Selection
```javascript
const handleAddContract = (template) => {
  console.log('✅ Template Selected:', {
    id: template._id,
    title: template.title,
    category: template.category,
    description: template.description
  });
  
  navigate('/ContractEditor', { state: { template } });
};
```

### 3. Template Search
```javascript
const filteredTemplates = templates.filter(template =>
  template.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  template.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  template.category?.toLowerCase().includes(searchTerm.toLowerCase())
);
```

### 4. Template Preview
```javascript
const handlePreview = (template) => {
  setPreviewModal({ show: true, template });
};

const handleClosePreview = () => {
  setPreviewModal({ show: false, template: null });
};
```

## Error Handling

The template integration includes comprehensive error handling:

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
  case 404:
    errorMessage = 'Templates not found.';
    break;
  case 500:
    errorMessage = 'Server error. Please try again later.';
    break;
}
```

### User Feedback
```javascript
// Toast notifications for user feedback
if (result.success) {
  SuccessToast('Template loaded successfully');
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
The template service provides detailed console logging:
- 📋 Template loading operations
- ✅ Template selection
- 👁️ Template preview
- ❌ Error details

### Service Status
```javascript
// Check template loading status
const { templates, loading, error } = useSelector(state => state.contractTemplates);
console.log('Template Status:', { templates: templates.length, loading, error });
```

## Migration from Old Implementation

### Before (Old Implementation)
```javascript
// Static templates array
const templates = [
  {
    id: 1,
    title: "Non-Disclosure Agreement (NDA)",
    description: "Protect confidential information...",
    type: "NON-DISCLOSURE AGREEMENT",
    content: "This NDA is entered into..."
  }
];
```

### After (Enhanced Implementation)
```javascript
// Dynamic templates from API
const { templates, loading, error } = useSelector(state => state.contractTemplates);

useEffect(() => {
  dispatch(getContractTemplates());
}, [dispatch]);
```

## Testing

### 1. Test Template Loading
```javascript
const testTemplateLoading = async () => {
  const result = await dispatch(getContractTemplates());
  console.log('Template Loading Result:', result);
};
```

### 2. Test Template Selection
```javascript
const testTemplateSelection = (template) => {
  console.log('Selected Template:', template);
  navigate('/ContractEditor', { state: { template } });
};
```

### 3. Test Template Search
```javascript
const testTemplateSearch = (searchTerm) => {
  const filtered = templates.filter(template =>
    template.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log('Search Results:', filtered);
};
```

## Troubleshooting

### Common Issues

1. **Templates Not Loading**
   - Check API endpoint configuration
   - Verify network connectivity
   - Check Redux store integration

2. **Template Selection Not Working**
   - Verify navigation state passing
   - Check template data structure
   - Ensure ContractEditor handles template data

3. **Search Not Working**
   - Check search term filtering logic
   - Verify template data structure
   - Test search functionality

4. **Preview Not Showing**
   - Check modal component integration
   - Verify template data passing
   - Test preview functionality

### Debug Steps

1. **Enable Debug Mode**
   ```javascript
   DEBUG_MODE: true,
   ENABLE_LOGGING: true,
   ```

2. **Check Console Logs**
   - Look for 📋, ✅, 👁️, ❌ emoji indicators
   - Review error messages and stack traces

3. **Test API Connectivity**
   ```javascript
   const result = await dispatch(getContractTemplates());
   console.log('API Result:', result);
   ```

4. **Verify Redux State**
   ```javascript
   const state = useSelector(state => state.contractTemplates);
   console.log('Redux State:', state);
   ```

## Security Considerations

1. **API Key Management**
   - Store API keys in environment variables
   - Never commit keys to version control
   - Use different keys for development and production

2. **Request Validation**
   - Validate template data before displaying
   - Sanitize template content
   - Implement content filtering

3. **Response Validation**
   - Validate API responses before using
   - Sanitize template content from API
   - Implement error handling

## Performance Optimization

1. **Caching**
   - Cache templates locally
   - Implement request deduplication
   - Store template metadata

2. **Loading States**
   - Show loading indicators during API calls
   - Implement progressive loading for large template lists
   - Provide user feedback for long operations

3. **Error Recovery**
   - Implement retry logic for failed requests
   - Provide fallback options when templates unavailable
   - Graceful degradation for partial failures

## Future Enhancements

1. **Advanced Template Features**
   - Template categories and filtering
   - Template ratings and reviews
   - Template versioning

2. **Integration Improvements**
   - Template favorites
   - Template sharing
   - Template customization

3. **User Experience**
   - Template recommendations
   - Smart template matching
   - Template usage analytics

## Support

For issues with template integration:
1. Check the console logs for detailed error information
2. Verify API configuration and endpoints
3. Test template loading functionality
4. Review network connectivity
5. Check Redux store integration 