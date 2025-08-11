import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import "./TemplatePreview.css";

export default function TemplatePreview({ show, onHide, template }) {
  const navigate = useNavigate();
  
  console.log('🔍 TemplatePreview Component - Props:', {
    show,
    hasTemplate: !!template,
    templateId: template?._id,
    templateTitle: template?.title
  });
  
  if (!template) {
    console.log('⚠️ TemplatePreview: No template provided');
    return null;
  }

  console.log('📋 TemplatePreview: Template data:', {
    id: template._id,
    title: template.title,
    category: template.category,
    description: template.description,
    hasContent: !!template.content,
    contentLength: template.content?.length || 0,
    type: template.type,
    fullTemplate: template
  });

  const formatTemplateContent = (content) => {
    console.log('🔧 TemplatePreview: Formatting content:', {
      hasContent: !!content,
      contentLength: content?.length || 0,
      contentType: typeof content
    });
    
    // Safely handle undefined or null content
    if (!content) {
      console.log('⚠️ TemplatePreview: No content available for template');
      return '<p>No content available for this template.</p>';
    }
    
    // Convert the template content to a more readable format
    const formattedContent = content.replace(/\n/g, '<br>');
    console.log('✅ TemplatePreview: Content formatted successfully, length:', formattedContent.length);
    return formattedContent;
  };

  const handleAddContract = () => {
    console.log('✅ TemplatePreview: Add Contract clicked from modal');
    onHide();
    navigate('/ContractEditor', { state: { template } });
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="template-preview-modal"
      centered
      backdrop={true}
      className="template-preview-modal"
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title id="template-preview-modal">
          <h2 className="template-preview-title">{template.type || template.category || 'Contract Template'}</h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="template-preview-content">
          <div className="template-description">
            <h3>{template.title || 'Untitled Template'}</h3>
            <p>{template.description || 'No description available.'}</p>
          </div>
          
          <div className="template-body">
            <div 
              className="template-content"
              dangerouslySetInnerHTML={{ __html: formatTemplateContent(template.content) }}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="template-preview-actions">
          <Button 
            className="btn-add-contract"
            onClick={handleAddContract}
          >
            Add Contract
          </Button>
          <Button 
            className="btn-cancel"
            onClick={onHide}
          >
            Cancel
          </Button>
        </div>
        <div className="template-preview-footer">
          <img
            src="/Images/Contract/pocketfiler - logo.svg"
            alt="PocketFiler"
            className="template-preview-logo"
          />
          <p className="template-preview-website">www.pocketfiler.com</p>
        </div>
      </Modal.Footer>
    </Modal>
  );
} 