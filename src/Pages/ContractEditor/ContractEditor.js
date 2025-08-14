import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import { SuccessToast, ErrorToast } from "../../Components/toast/Toast";
import { API_URL } from "../../services/client";
import api from "../../services/apiInterceptor";
import ScreenLoader from "../../Components/loader/ScreenLoader";
import AddContract from "../../Components/Modals/AddContract/AddContract";
import Contract from "../../Components/Modals/Contract/Contract";
import AIClauseChecker from "../../Components/Modals/AIClauseChecker/AIClauseChecker";
import TestingEditior from "../TestingEditior";
import axios from "axios";
import { setContractEditor } from "../../services/redux/reducer/addcontracteditor";
import AIService from "../../services/aiService";
import "./ContractEditor.css";

export default function ContractEditorPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const ContractName = useSelector(
    (state) => state?.addcontract?.contract.name
  );

  const ContractContent = useSelector(
    (state) => state?.addcontracteditor?.contracteditorcontent
  );

  const fileInputRef = useRef(null);
  const [loader, setLoader] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [inputEditor, setInputEditor] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [userId, setUserId] = useState();
  const [promptText, setPromptText] = useState("");
  const [templateData, setTemplateData] = useState(null);
  const [showContractModal, setShowContractModal] = useState(false);
  const [showAIChecker, setShowAIChecker] = useState(false);
  const [aiStatus, setAiStatus] = useState(null);

  useEffect(() => {
    const userid = localStorage.getItem("_id");
    setUserId(userid);
    
    // Check AI service status on component mount
    checkAIServiceStatus();
    
    // Handle template data if coming from Templates page
    if (location.state?.template) {
      const template = location.state.template;
      setTemplateData(template);
      
      // Use the template content directly if it exists
      if (template.content) {
        console.log("Template content received:", template.content);
        setImageSrc(template.content);
        dispatch(setContractEditor(template.content));
      } else {
        // Fallback to creating template content if not provided
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
      
      console.log("Template data received:", template);
      console.log("Template data stored:", templateData);
    }
  }, [location.state, dispatch, templateData]);

  const checkAIServiceStatus = async () => {
    try {
      const status = await AIService.checkAIService();
      setAiStatus(status);
      console.log('🤖 AI Service Status:', status);
    } catch (error) {
      console.error('❌ Failed to check AI service status:', error);
      setAiStatus({ available: false, error: 'AI service unavailable' });
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handlePreviewContract = () => {
    if (!imageSrc && !ContractContent) {
      ErrorToast("Please upload a contract or generate content using AI");
      return;
    } else {
      SuccessToast("Contract Details Added Successfully");
      setShowContractModal(true);
    }
  };

  const handleViewTemplates = () => {
    navigate("/Templates");
  };

  const handleCheckClauseWithAI = () => {
    if (!ContractContent && !imageSrc) {
      ErrorToast("Please add some contract content before checking with AI");
      return;
    }
    
    console.log('🤖 ContractEditor: Opening AI Clause Checker with data:', {
      ContractName: ContractName || templateData?.title || "Contract from Template",
      ContractType: templateData?.category || "General Contract",
      ContractContent: ContractContent || imageSrc || "",
      templateData: templateData
    });
    
    setShowAIChecker(true);
  };

  const handleEditName = () => {
    setModalShow(true);
  };

  const handleClose = () => {
    navigate("/Dashboard");
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      const allowedTypes = [
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
        "application/pdf",
        "image/png",
        "image/jpeg",
        "application/msword",
      ];
      console.log("Detected File Type:", file.type);
      if (!allowedTypes.includes(file.type)) {
        console.error(
          "File type not supported. Please upload a Word document, PNG, JPEG, or PDF."
        );
        ErrorToast(
          "File type not supported. Please upload a Word document, PNG, JPEG, or PDF."
        );
        return;
      }
      setLoader(true);

      try {
        const formData = new FormData();
        formData.append("file", file);
        console.log("FILE Name:", file.name);
        const res = await api.post(
          `${API_URL}/contract/uploadContractFile/${userId}`,
          formData
        );
        if (res.status === 200) {
          setLoader(false);
          setImageSrc(res?.data?.uploadingTheFile?.original);
          dispatch(setContractEditor(res?.data?.uploadingTheFile?.original));
          SuccessToast("Contract Uploaded Successfully");
        }
      } catch (error) {
        setLoader(false);
        console.error("Error:", error);
        ErrorToast("Failed to upload contract file");
      }
    }
  };

  // Enhanced AI function using the new AIService
  async function ChatAi() {
    if (!promptText.trim()) {
      ErrorToast("Please enter a prompt for contract generation");
      return;
    }

    setLoader(true);
    
    try {
      console.log('🤖 Starting AI contract generation...');
      console.log('📝 Prompt:', promptText);
      
      // Get existing content if any
      const existingContent = ContractContent || '';
      
      const result = await AIService.generateContractContent(promptText, existingContent);
      
      if (result.success) {
        setImageSrc(result.content);
        dispatch(setContractEditor(result.content));
        SuccessToast(result.message);
        console.log('✅ AI contract generation successful');
      } else {
        ErrorToast(result.error);
        console.error('❌ AI contract generation failed:', result.error);
      }
    } catch (error) {
      console.error("❌ AI generation error:", error);
      ErrorToast("Failed to generate contract content. Please try again.");
    } finally {
      setLoader(false);
    }
  }

  const getFileContent = (file) => {
    if (!file) return <p>No file available</p>;

    if (file.endsWith(".pdf")) {
      return <iframe src={file} width="100%" height="500px" title="PDF Document Viewer" />;
    }

    if (file.endsWith(".doc") || file.endsWith(".docx")) {
      return (
        <iframe
          src={file}
          width="100%"
          height="100vh"
          frameBorder="0"
          scrolling="auto"
          title="Word Document Viewer"
        />
      );
    }

    if (
      file.endsWith(".png") ||
      file.endsWith(".jpg") ||
      file.endsWith(".jpeg")
    ) {
      return (
        <img
          src={file}
          alt="Uploaded content"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      );
    }

    return <p>{file}</p>; // Default case
  };

  // Check if content is a file path or HTML content
  const isFileContent = (content) => {
    if (!content) return false;
    return content.match(/\.(pdf|doc|docx|png|jpg|jpeg)$/i);
  };

  return (
    <>
      {loader && <ScreenLoader />}
      
      <div className="contract-editor-page">
        <div className="page-header">
          <h1 className="page-title">Add Contract</h1>
          <div className="header-actions">
            <div className="contract-title-section">
              <span className="contract-title">{ContractName || "Untitled Contract"}</span>
              <img
                src="/Images/Contract/edit-icon.svg"
                alt="edit-icon"
                onClick={handleEditName}
                className="edit-icon"
              />
            </div>
            <AddContract
              show={modalShow}
              onHide={() => setModalShow(false)}
              showpreview={true}
            />
            <div className="close-button" onClick={handleClose}>
              <img
                src="/Images/Projects/close.svg"
                alt="close-icon"
              />
            </div>
          </div>
        </div>
        
        <div className="page-content">
          <div className="contract-editor-panel">
            {/* Upload Contract Button */}
            <div className="btn-upload-contract" onClick={handleUploadClick}>
              Upload contract
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept=".doc,.docx,.pdf,.png,.jpg,.jpeg"
              />
            </div>

            {/* Text Editor Section - Always Visible */}
            <div className="text-editor-container">
              <TestingEditior imgcontent={imageSrc || ContractContent || ""} />
            </div>

            {/* AI Generation Section */}
            <div
              onClick={() => {
                setInputEditor(!inputEditor);
              }}
              className="chatgpt-div"
            >
              <div className="chatglt-chld">
                <img
                  alt=""
                  className="sparkle-icon"
                  src="/Images/Subscription/chatgpt.svg"
                />
                <p>Write contract with AI</p>
                {aiStatus && !aiStatus.available && (
                  <span className="ai-status-indicator" style={{ color: '#ff6b6b', fontSize: '12px' }}>
                    (Service Unavailable)
                  </span>
                )}
                {inputEditor ? (
                  <img
                    alt=""
                    className="caret-icon"
                    src="/Images/Subscription/uparrow.svg"
                  />
                ) : (
                  <img
                    alt=""
                    className="caret-icon"
                    src="/Images/Subscription/arrowDown.svg"
                  />
                )}
              </div>
            </div>
            
            {inputEditor && (
              <div className="ai-input-container">
                <div className="ai-input-box">
                  <textarea
                    type="text"
                    placeholder="Enter prompt for contract generation..."
                    className="ai-prompt-textarea"
                    value={promptText}
                    onChange={(e) => {
                      setPromptText(e.target.value);
                    }}
                    disabled={aiStatus && !aiStatus.available}
                  />
                  <div className="ai-submit-section">
                    <Button
                      className="ai-submit-btn"
                      onClick={ChatAi}
                      disabled={loader || (aiStatus && !aiStatus.available)}
                    >
                      {loader ? 'Generating...' : 'Generate Contract'}
                    </Button>
                  </div>
                </div>
                {aiStatus && !aiStatus.available && (
                  <div className="ai-error-message" style={{ color: '#ff6b6b', fontSize: '12px', marginTop: '8px' }}>
                    AI service is currently unavailable. Please try again later.
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="btn-preview-div">
              <div className="action-buttons-row">
                <Button className="btn-preview" onClick={handlePreviewContract}>
                  Preview contract
                </Button>
                <Button 
                  className="btn-view-templates" 
                  onClick={handleViewTemplates}
                  variant="outlined"
                >
                  Explore Templates
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Contract
        show={showContractModal}
        setModalShow={setShowContractModal}
        onHide={() => setShowContractModal(false)}
      />

      {/* AI Clause Checker Modal */}
      <AIClauseChecker
        show={showAIChecker}
        onHide={() => setShowAIChecker(false)}
        contractContent={ContractContent || imageSrc || ""}
        onSaveContract={() => {
          // Handle save contract if needed
          console.log("Save contract from AI checker");
        }}
        contractData={{
          ContractName: ContractName || templateData?.title || "Contract from Template",
          ContractType: templateData?.category || "General Contract",
          ContractContent: ContractContent || imageSrc || "",
          ContractSign: "", // Add signature handling if needed
          startDate: new Date(),
          UserID: userId || ""
        }}
      />
    </>
  );
} 