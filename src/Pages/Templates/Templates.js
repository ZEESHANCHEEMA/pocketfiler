import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getContractTemplates } from '../../services/redux/middleware/contractTemplates';
import { clearError } from '../../services/redux/reducer/contractTemplates';
import { SuccessToast, ErrorToast } from '../../Components/toast/Toast';
import TemplatePreview from '../../Components/Modals/TemplatePreview/TemplatePreview';
import ScreenLoader from '../../Components/loader/ScreenLoader';
import './Templates.css';

const Templates = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { templates, loading, error } = useSelector((state) => state.contractTemplates);
  const [searchTerm, setSearchTerm] = useState("");
  const [previewModal, setPreviewModal] = useState({ show: false, template: null });

  console.log('📋 Templates Component - Current State:', {
    templatesCount: templates?.length || 0,
    loading,
    error,
    searchTerm,
    previewModal: previewModal.show
  });

  useEffect(() => {
    console.log('🚀 Templates Component - Fetching templates...');
    dispatch(getContractTemplates());
  }, [dispatch]);

  useEffect(() => {
    if (templates && templates.length > 0) {
      console.log('📋 Templates Component - Templates loaded:', templates);
      console.log('📋 Templates Component - Template details:', templates.map(t => ({
        id: t._id,
        title: t.title,
        category: t.category,
        hasContent: !!t.content,
        contentLength: t.content?.length || 0
      })));
    }
  }, [templates]);

  useEffect(() => {
    if (error) {
      console.error('❌ Templates Component - Error:', error);
    }
  }, [error]);

  const handleAddContract = (template) => {
    console.log('✅ Templates Component - Add Contract clicked:', {
      templateId: template._id,
      title: template.title,
      category: template.category,
      description: template.description,
      hasContent: !!template.content,
      contentLength: template.content?.length || 0
    });
    
    // Create a comprehensive contract content structure based on template info
    const contractContent = `
      <h1>${template.title}</h1>
      <p><strong>Category:</strong> ${template.category || 'General'}</p>
      <p><strong>Description:</strong> ${template.description || 'No description available'}</p>
      <hr>
      <h2>Contract Terms</h2>
      <p>This contract template has been selected for your use. Please customize the content below according to your specific requirements.</p>
      
      <h3>Parties</h3>
      <p>[Insert party names and details here]</p>
      
      <h3>Terms and Conditions</h3>
      <p>[Insert specific terms and conditions here]</p>
      
      <h3>Payment Terms</h3>
      <p>[Insert payment details here]</p>
      
      <h3>Termination</h3>
      <p>[Insert termination conditions here]</p>
      
      <h3>Governing Law</h3>
      <p>[Insert governing law here]</p>
      
      <h3>Signatures</h3>
      <p>This contract shall be signed by all parties involved.</p>
      
      <hr>
      <p><em>Template: ${template.title}</em></p>
      <p><em>Please customize this template according to your specific requirements.</em></p>
    `;
    
    console.log('📝 Templates Component - Generated contract content length:', contractContent.length);
    
    // Navigate to contract editor with template data and content
    navigate('/ContractEditor', { 
      state: { 
        template: {
          ...template,
          content: contractContent
        } 
      } 
    });
    
    SuccessToast(`Template "${template.title}" selected and loaded into editor`);
  };

  const handlePreview = (template) => {
    console.log('🔍 Templates Component - Preview clicked:', {
      templateId: template._id,
      title: template.title,
      category: template.category,
      description: template.description,
      hasContent: !!template.content,
      contentLength: template.content?.length || 0,
      fullTemplate: template
    });
    
    // Create the same content that's generated when adding a contract
    const previewContent = `
      <h1>${template.title}</h1>
      <p><strong>Category:</strong> ${template.category || 'General'}</p>
      <p><strong>Description:</strong> ${template.description || 'No description available'}</p>
      <hr>
      <h2>Contract Terms</h2>
      <p>This contract template has been selected for your use. Please customize the content below according to your specific requirements.</p>
      
      <h3>Parties</h3>
      <p>[Insert party names and details here]</p>
      
      <h3>Terms and Conditions</h3>
      <p>[Insert specific terms and conditions here]</p>
      
      <h3>Payment Terms</h3>
      <p>[Insert payment details here]</p>
      
      <h3>Termination</h3>
      <p>[Insert termination conditions here]</p>
      
      <h3>Governing Law</h3>
      <p>[Insert governing law here]</p>
      
      <h3>Signatures</h3>
      <p>This contract shall be signed by all parties involved.</p>
      
      <hr>
      <p><em>Template: ${template.title}</em></p>
      <p><em>Please customize this template according to your specific requirements.</em></p>
    `;
    
    // Pass the template with the generated content
    const templateWithContent = {
      ...template,
      content: previewContent
    };
    
    setPreviewModal({ show: true, template: templateWithContent });
  };

  const handleClosePreview = () => {
    setPreviewModal({ show: false, template: null });
  };

  const handleGoBack = () => {
    // Check if there's previous history, if not go to Dashboard
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/Dashboard');
    }
  };

  // Filter templates based on search term
  const filteredTemplates = templates.filter(template =>
    template.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTemplateTypeColor = (category) => {
    const colors = {
      'nda': '#dc3545',
      'employment': '#fd7e14',
      'service': '#28a745',
      'software': '#6f42c1',
      'rental': '#20c997',
      'partnership': '#17a2b8',
      'consulting': '#6c757d',
      'freelance': '#e83e8c',
      'equipment': '#ffc107',
      'website': '#6610f2',
      'marketing': '#fd7e14'
    };
    return colors[category?.toLowerCase()] || '#007bff';
  };

  const getSummaryIntro = (category) => {
    switch (category?.toLowerCase()) {
      case 'nda':
        return 'This is a Non-Disclosure Agreement (NDA) template designed to protect confidential information.';
      case 'employment':
        return 'This is an Employment Agreement template for defining the terms of employment between an employer and employee.';
      case 'service':
        return 'This is a Service Agreement template for outlining the terms of a service provider and client relationship.';
      case 'software':
        return 'This is a Software License Agreement template for granting rights to use software.';
      case 'rental':
        return 'This is a Rental Agreement template for defining the terms of renting property or equipment.';
      case 'partnership':
        return 'This is a Partnership Agreement template for establishing a business partnership.';
      case 'consulting':
        return 'This is a Consulting Agreement template for defining the scope and terms of professional consulting services.';
      case 'freelance':
        return 'This is a Freelance Agreement template for defining the terms of working as a freelance professional.';
      case 'equipment':
        return 'This is an Equipment Rental Agreement template for defining the terms of renting out equipment.';
      case 'website':
        return 'This is a Website Development Agreement template for defining the terms of website development and maintenance.';
      case 'marketing':
        return 'This is a Marketing Services Agreement template for defining the terms of marketing and advertising services.';
      default:
        return 'This is a standard contract template for business agreements.';
    }
  };

  const getSummaryPoints = (category) => {
    switch (category?.toLowerCase()) {
      case 'nda':
        return [
          'Confidentiality obligations',
          'Non-solicitation of employees',
          'Termination provisions',
          'Breach of agreement'
        ];
      case 'employment':
        return [
          'Job title and responsibilities',
          'Compensation and benefits',
          'Termination conditions',
          'Confidentiality'
        ];
      case 'service':
        return [
          'Description of services',
          'Payment terms',
          'Warranty and liability',
          'Termination'
        ];
      case 'software':
        return [
          'License granted',
          'Restrictions on use',
          'Maintenance and support',
          'Termination'
        ];
      case 'rental':
        return [
          'Property or equipment description',
          'Rental period',
          'Payment terms',
          'Maintenance responsibilities'
        ];
      case 'partnership':
        return [
          'Partnership details',
          'Profit sharing',
          'Management responsibilities',
          'Termination'
        ];
      case 'consulting':
        return [
          'Scope of services',
          'Compensation',
          'Confidentiality',
          'Termination'
        ];
      case 'freelance':
        return [
          'Work description',
          'Compensation',
          'Warranty and liability',
          'Termination'
        ];
      case 'equipment':
        return [
          'Equipment description',
          'Rental period',
          'Payment terms',
          'Maintenance'
        ];
      case 'website':
        return [
          'Website description',
          'Development timeline',
          'Maintenance responsibilities',
          'Termination'
        ];
      case 'marketing':
        return [
          'Services provided',
          'Compensation',
          'Confidentiality',
          'Termination'
        ];
      default:
        return [
          'General agreement terms',
          'Payment details',
          'Termination conditions',
          'Governing law'
        ];
    }
  };

  return (
    <div className="templates-container">
      {/* Header */}
      <div className="templates-header">
        <div className="header-left">
          <button className="back-button" onClick={handleGoBack}>
            ←
          </button>
          <h1>Contract Templates</h1>
        </div>
        <div className="header-right">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search template..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <ScreenLoader />
          <p>Loading templates...</p>
        </div>
      )}

      {/* Templates Grid */}
      {!loading && (
        <div className="templates-grid">
          {filteredTemplates.length > 0 ? (
            filteredTemplates.map((template) => (
              <div key={template._id || Math.random()} className="template-card">
                {/* Colored Header */}
                <div 
                  className="template-header"
                  style={{ backgroundColor: getTemplateTypeColor(template.category) }}
                >
                  <h3>{template.category || 'CONTRACT AGREEMENT'}</h3>
                </div>
                
                {/* Summary Box */}
                <div className="summary-box">
                  <p className="summary-intro">
                    {getSummaryIntro(template.category)}
                  </p>
                  <div className="summary-points">
                    {getSummaryPoints(template.category).map((point, index) => (
                      <p key={index}>• {point}</p>
                    ))}
                  </div>
                </div>
                
                {/* Template Info */}
                <div className="template-info">
                  <h3 className="template-title">{template.title || 'Contract Agreement'}</h3>
                  <p className="template-description">{template.description || 'Standard agreement template for business contracts.'}</p>
                </div>
                
                {/* Action Buttons */}
                <div className="template-actions">
                  <button 
                    className="btn-add-contract"
                    onClick={() => handleAddContract(template)}
                  >
                    Add Contract
                  </button>
                  <button 
                    className="btn-preview"
                    onClick={() => handlePreview(template)}
                  >
                    Preview
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-container">
              <div className="empty-icon">📄</div>
              <h4>No templates found</h4>
              <p>
                {searchTerm 
                  ? `No templates match "${searchTerm}"`
                  : 'No contract templates available at the moment.'
                }
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Template Preview Modal */}
      <TemplatePreview
        show={previewModal.show}
        onHide={handleClosePreview}
        template={previewModal.template}
      />
    </div>
  );
};

export default Templates; 