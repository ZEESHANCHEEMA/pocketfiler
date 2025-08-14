import Button from "@mui/material/Button";
import Modal from "react-bootstrap/Modal";
import "./Contract.css";
import * as React from "react";
import { useState, useEffect } from "react";
import UploadSign from "../UploadSign/UploadSign";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";

import { savecontract } from "../../../services/redux/middleware/contract";
import ScreenLoader from "../../../Components/loader/ScreenLoader";
import { useNavigate } from "react-router-dom";
import { SuccessToast, ErrorToast } from "../../toast/Toast";
import Parser from "html-react-parser";
import AddContract from "../AddContract/AddContract";
import AIService from "../../../services/aiService";
import { getAllContract } from "../../../services/redux/middleware/getAllContract";
import { setContract } from "../../../services/redux/reducer/addcontract";
import { setContractSign } from "../../../services/redux/reducer/addsign";
import { getContract } from "../../../services/redux/middleware/getContract";
import { getTotalCount } from "../../../services/redux/middleware/Project/project";

export default function Contract(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [UserID, setUserID] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [uploadsign, setUploadSign] = useState(false);
  const [formattedContent, setFormattedContent] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [showAIChecker, setShowAIChecker] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiReviewResult, setAiReviewResult] = useState(null);

  const ContractName = useSelector(
    (state) => state?.addcontract?.contract.name
  );

  const ContractType = useSelector(
    (state) => state?.addcontract?.contract.type
  );

  const ContractContent = useSelector(
    (state) => state?.addcontracteditor?.contracteditorcontent
  );
  console.log("this is content on contract", ContractContent);

  const ContractSign = useSelector((state) => state?.addsign.contractsign);
  console.log("Contract Sign is", ContractSign);



  useEffect(() => {
    const userid = localStorage.getItem("_id");

    setUserID(userid);
  }, [UserID]);

  useEffect(() => {
    if (ContractContent && ContractContent !== "undefined") {
      const parser = new DOMParser();
      const doc = parser.parseFromString(ContractContent, "text/html");
      const images = doc.querySelectorAll("img");
      images.forEach((image) => {
        image.style.width = "100%";
      });
      setFormattedContent(doc.body.innerHTML);
    } else {
      setFormattedContent("");
    }
  }, [ContractContent]);

  async function SaveContract() {
    if (!ContractType) {
      ErrorToast("Contract Type is required.");
      return;
    }
    if (!ContractName) {
      ErrorToast("Contract Name is required.");
      return;
    }
    if (!startDate) {
      ErrorToast("Contract date is required.");
      return;
    }
    if (!UserID) {
      ErrorToast("User ID is required.");
      return;
    }
    if (!ContractSign) {
      ErrorToast("Signature is required.");
      return;
    }
    if (!ContractContent) {
      ErrorToast("Contract Content is required.");
      return;
    }
    setLoader(true);
    try {
      const data = {
        category: ContractType,
        contractName: ContractName,
        Date: startDate,
        userId: UserID,
        signatureImage: ContractSign,
        contractText: ContractContent,
      };
      const dataall = {
        id: UserID,
        page: 1,
      };
      dispatch(savecontract(data)).then((res) => {
        if (res?.payload?.status === 200) {
          setLoader(false);
          console.log("Contract Added res", res?.payload?.data);
          dispatch(setContract({ name: "", type: "" }));
          dispatch(setContractSign(""));
          SuccessToast("Contract Added Successfully");
          dispatch(getAllContract(dataall));
          dispatch(getContract(UserID));
          dispatch(getTotalCount(UserID));
          navigate("/Dashboard");
          setFormattedContent("");
          props.onHide();
        } else {
          setLoader(false);
          ErrorToast(res?.payload?.message);
        }
      });
    } catch (error) {
      console.error("Error:", error);
    }
  }

  console.log("format", formattedContent);

  const handleEditName = () => {
    setModalShow(true);
    // props.onHide();
  };
  console.log(ContractSign, "ContractSignContractSignContractSign");

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

  const handleCheckClauseWithAI = async () => {
    console.log('🔍 Button clicked! Checking content...');
    console.log('📝 formattedContent:', formattedContent);
    console.log('📝 ContractContent:', ContractContent);
    
    if (!formattedContent && !ContractContent) {
      ErrorToast("Please add some contract content before checking with AI");
      return;
    }
    
    setAiLoading(true);
    setShowSuggestions(true);
    
    try {
      console.log('🤖 Contract: Starting AI clause check...');
      console.log('📤 Sending content to AI service...');
      
      const result = await AIService.checkClausesWithAI(formattedContent || ContractContent);
      
      if (result.success) {
        setAiReviewResult(result.analysis);
        
        // Parse AI suggestions into structured format
        const parsedSuggestions = parseAISuggestions(result.analysis, result.highlightedSections);
        setSuggestions(parsedSuggestions);
        
        console.log('✅ AI contract clause check completed');
        SuccessToast('AI analysis completed successfully');
      } else {
        ErrorToast(result.error || 'Failed to analyze contract');
        console.error('❌ AI contract clause check failed:', result.error);
      }
    } catch (error) {
      console.error('❌ AI clause check error:', error);
      ErrorToast('Failed to check contract clauses with AI. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const parseAISuggestions = (aiResponse, highlightedSections = []) => {
    const suggestions = [];
    
    try {
      // Check if aiResponse is a JSON string containing suggestions
      if (typeof aiResponse === 'string' && aiResponse.includes('"suggestions"')) {
        try {
          const parsedData = JSON.parse(aiResponse);
          if (parsedData.suggestions && Array.isArray(parsedData.suggestions)) {
            parsedData.suggestions.forEach((suggestion, index) => {
              suggestions.push({
                id: index + 1,
                type: 'spelling',
                title: `Grammar Error ${index + 1}`,
                content: suggestion.description || suggestion.explanation || 'Grammar correction needed',
                originalText: suggestion.original || suggestion.incorrect || '',
                correctedText: suggestion.corrected || suggestion.suggestion || '',
                category: 'grammar',
                highlighted: true
              });
            });
            return suggestions;
          }
        } catch (parseError) {
          console.log('Not a JSON response, continuing with text parsing...');
        }
      }
      
      if (highlightedSections && highlightedSections.length > 0) {
        highlightedSections.forEach((section, index) => {
          suggestions.push({
            id: index + 1,
            type: section.type || 'risk',
            title: section.title || `Risk Area ${index + 1}`,
            content: section.text || section.content || section,
            category: section.category || 'legal',
            originalText: section.originalText || section.text || section.content || section,
            correctedText: section.correctedText || section.suggestion || '',
            highlighted: true
          });
        });
      } else {
        const cleanResponse = aiResponse.replace(/<[^>]*>/g, '');
        const sections = cleanResponse.split(/(?=##|\*\*|Risk|Issue|Problem|Warning|Suggestion|Recommendation|Consider|Note)/);
        
        sections.forEach((section, index) => {
          const trimmedSection = section.trim();
          if (trimmedSection && trimmedSection.length > 10) {
            const isRisk = /risk|problem|warning|issue|concern|danger/i.test(trimmedSection);
            const isSuggestion = /suggestion|recommendation|improve|enhance|consider/i.test(trimmedSection);
            
            const lines = trimmedSection.split('\n');
            const title = lines[0].replace(/[#*]/g, '').trim().substring(0, 50);
            
            suggestions.push({
              id: index + 1,
              type: isRisk ? 'risk' : (isSuggestion ? 'suggestion' : 'review'),
              title: title || `Analysis Point ${index + 1}`,
              content: trimmedSection,
              category: isRisk ? 'legal' : 'general',
              originalText: '',
              correctedText: '',
              highlighted: false
            });
          }
        });
        
        if (suggestions.length === 0 && cleanResponse.length > 0) {
          suggestions.push({
            id: 1,
            type: 'review',
            title: 'AI Analysis',
            content: cleanResponse,
            category: 'general',
            originalText: '',
            correctedText: '',
            highlighted: false
          });
        }
      }
    } catch (error) {
      console.error('Error parsing AI suggestions:', error);
      const cleanResponse = aiResponse.replace(/<[^>]*>/g, '');
      suggestions.push({
        id: 1,
        type: 'review',
        title: 'AI Review',
        content: cleanResponse || 'AI analysis completed successfully.',
        category: 'general',
        originalText: '',
        correctedText: '',
        highlighted: false
      });
    }
    
    return suggestions;
  };

  const applySuggestion = async (suggestion) => {
    console.log('Applying suggestion:', suggestion);
    
    try {
      // Apply the correction to the contract content
      let updatedContent = formattedContent || ContractContent;
      
      if (suggestion.originalText && suggestion.correctedText) {
        console.log('🔄 Applying correction:', suggestion.originalText, '→', suggestion.correctedText);
        
        // Replace the original text with corrected text
        updatedContent = updatedContent.replace(
          new RegExp(suggestion.originalText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'),
          suggestion.correctedText
        );
        
        // Update the formatted content
        setFormattedContent(updatedContent);
        console.log('✅ Content updated with correction');
      }
      
      // Remove the applied suggestion from the list
      const updatedSuggestions = suggestions.filter(s => s.id !== suggestion.id);
      setSuggestions(updatedSuggestions);
      
      // Show success message
      SuccessToast('Suggestion applied successfully');
      
      // If no more suggestions, re-check the contract
      if (updatedSuggestions.length === 0) {
        console.log('🔄 No more suggestions, re-checking contract...');
        
        // Re-run AI check with updated content
        setAiLoading(true);
        
        const result = await AIService.checkClausesWithAI(updatedContent);
        
        if (result.success) {
          const parsedSuggestions = parseAISuggestions(result.analysis, result.highlightedSections);
          
          if (parsedSuggestions.length === 0) {
            // No issues found - show popup and hide suggestions
            console.log('✅ No issues found after applying suggestion');
            SuccessToast('All issues have been resolved! Contract is now error-free.');
            
            // Hide suggestions component after a short delay
            setTimeout(() => {
              setShowSuggestions(false);
            }, 2000);
          } else {
            // Still have issues - update suggestions
            setSuggestions(parsedSuggestions);
            console.log('⚠️ Still have issues after applying suggestion:', parsedSuggestions.length);
          }
        } else {
          ErrorToast('Failed to re-check contract after applying suggestion');
        }
        
        setAiLoading(false);
      }
      
    } catch (error) {
      console.error('❌ Error applying suggestion:', error);
      ErrorToast('Failed to apply suggestion. Please try again.');
    }
  };
  return (
    <>
      {loader && <ScreenLoader />}
      <Modal
        {...props}
        // size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop={true}
        className="contract-modal"
      >
        <Modal.Header
          style={{ padding: "70px", paddingBottom: "0px", paddingTop: "60px", position: "relative" }}
        >
          <Modal.Title
            id="contained-modal-title-vcenter"
            className="contract-title-top"
          >
            <p className="contract-title">{ContractName}</p>
            <img
              src="/Images/Contract/edit-icon.svg"
              alt="edit-icon"
              className="edit-icon-name"
              onClick={handleEditName}
              // onClick={() => setModalShow(true)}
            />
            <AddContract
              show={modalShow}
              onHide={() => setModalShow(false)}
              showpreview={false}
            />
          </Modal.Title>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={props.onHide}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: "#666",
              width: "30px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              transition: "background-color 0.2s"
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "#f0f0f0"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
          >
            ×
          </button>
        </Modal.Header>
        <Modal.Body
          style={{ padding: "0px", paddingTop: "50px", paddingBottom: "30px" }}
        >
          <div
            style={{
              paddingLeft: "36px",
              paddingRight: "36px",
            }}
          >
            <div
              style={{ width: "100%", overflowY: "auto", maxHeight: "500px" }}
            >
              <div
                style={{
                  width: "100%",
                }}
              >
                {formattedContent && formattedContent !== "undefined" &&
                /\.(pdf|doc|docx|png|jpe?g)$/i.test(formattedContent)
                  ? getFileContent(formattedContent)
                  : formattedContent && formattedContent !== "undefined" 
                    ? Parser(formattedContent)
                    : <p>No contract content available</p>}
              </div>
            </div>

            {/* AI Suggestions Section */}
            {showSuggestions && (
              <div className="ai-suggestions-section">
                <div className="suggestions-header">
                  <h5>Suggestions ({suggestions.length})</h5>
                  {aiLoading && (
                    <div className="ai-loading-indicator">
                      <div className="loading-spinner"></div>
                      <span>AI is analyzing...</span>
                    </div>
                  )}
                </div>
                
                {!aiLoading && suggestions.length > 0 && (
                  <div className="suggestions-list">
                    {suggestions.map((suggestion) => (
                      <div key={suggestion.id} className={`suggestion-item ${suggestion.type}`}>
                        <div className="suggestion-label">
                          {suggestion.type === 'risk' ? 'INCOMPLETE' : 'IMPROVEMENT'}
                        </div>
                        <div className="suggestion-content">
                          <div className="original-text">
                            {suggestion.original || suggestion.content.substring(0, 100)}...
                          </div>
                          <div className="suggestion-arrow">→</div>
                          <div className="suggested-text">
                            {suggestion.content.substring(0, 150)}...
                          </div>
                        </div>
                        <div className="suggestion-action">
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => applySuggestion(suggestion)}
                            className="apply-btn"
                          >
                            APPLY
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {!aiLoading && suggestions.length === 0 && (
                  <div className="success-message">
                    <div className="success-icon">✅</div>
                    <div>
                      <h6>No Issues Found!</h6>
                      <p>Your contract appears to be well-structured with no significant spelling or grammar errors.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="contract-btm">
              <div
                className={
                  ContractSign
                    ? "d-flex justify-content-between align-items-center "
                    : "sign-date-contain"
                }
              >
                <div className={"sign-inner-contain"}>
                  <div className="sign-edit">
                    {ContractSign ? (
                      <>
                        <img
                          src={ContractSign}
                          alt="Signature"
                          width={"94px"}
                          height={"63px"}
                          style={{
                            objectFit: "contain",
                          }}
                          onError={() => console.log("Error loading image")}
                        />
                        <UploadSign
                          show={uploadsign}
                          onHide={() => setUploadSign(false)}
                        />
                        <img
                          onClick={() => setUploadSign(true)}
                          src="/Images/Contract/edit-icon.svg"
                          alt="edit"
                          className="edit-icon-name"
                        />
                        {/* <img src="https://drive.google.com/uc?export=view&id=1vNV9Pn3H_3pzwjJyfE7zB_Sf0Wd20ybk" alt="Uploaded Image" /> */}
                      </>
                    ) : (
                      <>
                        <p
                          className="Upload-sign-txt"
                          onClick={() => setUploadSign(true)}
                        >
                          Upload Signature
                        </p>
                        <UploadSign
                          show={uploadsign}
                          onHide={() => setUploadSign(false)}
                        />

                        <img
                          onClick={() => setUploadSign(true)}
                          src="/Images/Contract/edit-icon.svg"
                          alt="edit"
                          className="edit-icon-name"
                        />
                      </>
                    )}
                  </div>

                  <p className="sign-txt">Signature</p>
                </div>

                <div className="sign-inner-contain">
                  <div className="pb-date" style={{ position: "relative" }}>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      autoFocus={false}
                      className="custom-datepicker ytdhfg"
                      placeholderText="Select Date"
                    />
                    <img
                      src="/Images/Contract/edit-icon.svg"
                      alt="edit"
                      className="edit-icon-name sfsvfe"
                    />
                  </div>

                  <p className="sign-txt">Date</p>
                </div>
              </div>

              <div className="contract-actions">
                <Button className="save-contract-btn" onClick={SaveContract}>
                  Save contract
                </Button>
                <Button className="check-clause-ai-btn" onClick={handleCheckClauseWithAI}>
                  Check Clause with AI
                </Button>
              </div>
            </div>
            <div className="contract-footer">
              <img
                src="/Images/Contract/pocketfiler - logo.svg"
                alt="logo"
                className="contract-logo"
              />
              <p className="www-txt">www.pocketfiler.com</p>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
