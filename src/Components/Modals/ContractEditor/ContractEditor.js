import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Modal from "react-bootstrap/Modal";
import { SuccessToast, ErrorToast } from "../../toast/Toast";
import { API_URL } from "../../../services/client";
import api from "../../../services/apiInterceptor";
import ScreenLoader from "../../loader/ScreenLoader";
import { setContractEditor } from "../../../services/redux/reducer/addcontracteditor";
import AIService from "../../../services/aiService";
import "./ContractEditor.css";

export default function ContractEditor(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loader, setLoader] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [inputEditor, setInputEditor] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [userId, setUserId] = useState();
  const [promptText, setPromptText] = useState("");
  const [aiStatus, setAiStatus] = useState(null);

  useEffect(() => {
    const userid = localStorage.getItem("_id");
    setUserId(userid);
    
    // Check AI service status on component mount
    checkAIServiceStatus();
  }, []);

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
    if (!imageSrc) {
      ErrorToast("Please upload a contract or generate content using AI");
      return;
    } else {
      SuccessToast("Contract Details Added Successfully");
      props.onHide();
      navigate("/ContractEditor");
    }
  };

  const handleEditName = () => {
    setModalShow(true);
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
      
      const result = await AIService.generateContractContent(promptText);
      
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

  console.log("hello img", imageSrc);

  return (
    <>
      {loader && <ScreenLoader />}
      <Modal
        show={props.show}
        onHide={props.onHide}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="contract-editor-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Contract Editor
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="contract-editor-container">
            <div className="contract-editor-header">
              <div className="contract-title-section">
                <h3>Contract Name: {props.contractName || "Untitled Contract"}</h3>
                <img
                  src="/Images/Contract/edit-icon.svg"
                  alt="edit-icon"
                  onClick={handleEditName}
                  className="edit-icon"
                />
              </div>
            </div>

            <div className="contract-editor-content">
              <div className="upload-section">
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
              </div>

              <div className="contract-content-display">
                {imageSrc ? (
                  <div className="contract-content">
                    {imageSrc.endsWith('.pdf') ? (
                      <iframe src={imageSrc} width="100%" height="500px" title="PDF Document Viewer" />
                    ) : imageSrc.endsWith('.doc') || imageSrc.endsWith('.docx') ? (
                      <iframe
                        src={imageSrc}
                        width="100%"
                        height="500px"
                        frameBorder="0"
                        scrolling="auto"
                        title="Word Document Viewer"
                      />
                    ) : imageSrc.match(/\.(png|jpg|jpeg)$/i) ? (
                      <img
                        src={imageSrc}
                        alt="Uploaded content"
                        style={{ maxWidth: "100%", height: "auto" }}
                      />
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: imageSrc }} />
                    )}
                  </div>
                ) : (
                  <div className="no-content-placeholder">
                    <p>Upload a contract or use AI to generate content</p>
                  </div>
                )}
              </div>

              <div
                onClick={() => {
                  setInputEditor(!inputEditor);
                }}
                className="chatgpt-div"
              >
                <div className="chatglt-chld">
                  <img
                    alt=""
                    style={{ paddingRight: "8px" }}
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
                      style={{ paddingLeft: "8px" }}
                      src="/Images/Subscription/uparrow.svg"
                    />
                  ) : (
                    <img
                      alt=""
                      style={{ paddingLeft: "8px" }}
                      src="/Images/Subscription/arrowDown.svg"
                    />
                  )}
                </div>
              </div>
              {inputEditor && (
                <div className="chat-input-box-area">
                  <textarea
                    type="text"
                    placeholder="Enter prompt for contract generation..."
                    className="prompt-textarea"
                    value={promptText}
                    onChange={(e) => {
                      setPromptText(e.target.value);
                    }}
                    disabled={aiStatus && !aiStatus.available}
                  />

                  <Button
                    className="btn-submit-txt"
                    onClick={ChatAi}
                    disabled={loader || (aiStatus && !aiStatus.available)}
                  >
                    {loader ? 'Generating...' : 'Generate Contract'}
                  </Button>
                </div>
              )}

              {aiStatus && !aiStatus.available && inputEditor && (
                <div className="ai-error-message" style={{ color: '#ff6b6b', fontSize: '12px', marginTop: '8px' }}>
                  AI service is currently unavailable. Please try again later.
                </div>
              )}

              <div className="btn-preview-div">
                <Button className="btn-preview" onClick={handlePreviewContract}>
                  Preview Contract
                </Button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
