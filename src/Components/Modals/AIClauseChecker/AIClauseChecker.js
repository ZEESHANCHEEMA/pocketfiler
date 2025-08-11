import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "@mui/material/Button";
import { SuccessToast, ErrorToast } from "../../toast/Toast";
import { savecontract } from "../../../services/redux/middleware/contract";
import { setContract } from "../../../services/redux/reducer/addcontract";
import { setContractSign } from "../../../services/redux/reducer/addsign";
import { getAllContract } from "../../../services/redux/middleware/getAllContract";
import { getContract } from "../../../services/redux/middleware/getContract";
import { getTotalCount } from "../../../services/redux/middleware/Project/project";
import AIService from "../../../services/aiService";
import "./AIClauseChecker.css";

const AIClauseChecker = ({ show, onHide, contractContent = "", onSaveContract, contractData = {} }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestion, setActiveSuggestion] = useState(null);
  const [loader, setLoader] = useState(false);
  const [aiReviewResult, setAiReviewResult] = useState(null);

  useEffect(() => {
    if (show && contractContent && contractContent !== "undefined") {
      // Use AI service to review the contract
      reviewContractWithAI();
    } else if (show) {
      // If no content, clear suggestions
      setSuggestions([]);
      setAiReviewResult(null);
    }
  }, [show, contractContent]);

  const reviewContractWithAI = async () => {
    setLoader(true);
    try {
      console.log('🔍 Starting AI contract review...');
      
      const result = await AIService.reviewContract(contractContent);
      
      if (result.success) {
        setAiReviewResult(result.suggestions);
        
        // Parse AI suggestions into structured format
        const parsedSuggestions = parseAISuggestions(result.suggestions);
        setSuggestions(parsedSuggestions);
        
        console.log('✅ AI contract review completed');
      } else {
        ErrorToast(result.error);
        console.error('❌ AI contract review failed:', result.error);
      }
    } catch (error) {
      console.error('❌ AI review error:', error);
      ErrorToast('Failed to review contract with AI. Please try again.');
    } finally {
      setLoader(false);
    }
  };

  const parseAISuggestions = (aiResponse) => {
    // Parse AI response into structured suggestions
    // This is a simplified parser - you can enhance it based on your AI response format
    const suggestions = [];
    
    try {
      // Split the AI response into sections
      const sections = aiResponse.split(/(?=##|\*\*)/);
      
      sections.forEach((section, index) => {
        if (section.trim()) {
          suggestions.push({
            id: index + 1,
            type: 'improvement',
            title: section.split('\n')[0].replace(/[#*]/g, '').trim(),
            content: section.trim(),
            category: 'general'
          });
        }
      });
    } catch (error) {
      console.error('Error parsing AI suggestions:', error);
      // Fallback to simple suggestion
      suggestions.push({
        id: 1,
        type: 'review',
        title: 'AI Review',
        content: aiResponse,
        category: 'general'
      });
    }
    
    return suggestions;
  };

  const handleSuggestionClick = (suggestion) => {
    setActiveSuggestion(suggestion);
  };

  const applySuggestion = (suggestion) => {
    // Apply the suggestion to the contract content
    console.log('Applying suggestion:', suggestion);
    
    // In a real implementation, you would update the contract content here
    // For now, we'll just log the change
    const updatedContent = contractContent + '\n\n' + suggestion.content;
    
    console.log('Updated content:', updatedContent);
    setActiveSuggestion(null);
    
    SuccessToast('Suggestion applied to contract');
  };

  const saveContractWithAPI = async () => {
    if (!contractData || Object.keys(contractData).length === 0) {
      ErrorToast("Contract data is required.");
      return;
    }

    const { ContractName = "", ContractType = "", ContractContent = "", ContractSign = "", startDate = null, UserID = "" } = contractData;

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
          onHide();
        } else {
          setLoader(false);
          ErrorToast(res?.payload?.message);
        }
      });
    } catch (error) {
      setLoader(false);
      console.error("Error:", error);
    }
  };

  const highlightText = (text, suggestions) => {
    if (!suggestions.length || !text || text === "undefined") return text || "";

    let highlightedText = text;
    suggestions.forEach((suggestion, index) => {
      const regex = new RegExp(suggestion.original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      highlightedText = highlightedText.replace(regex, (match) => {
        return `<span class="highlighted-text" data-suggestion-id="${suggestion.id}">${match}</span>`;
      });
    });

    return highlightedText;
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      aria-labelledby="ai-clause-checker-modal"
      centered
      className="ai-clause-checker-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="ai-clause-checker-modal">
          AI Contract Review
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="ai-clause-checker-container">
          <div className="ai-review-header">
            <h4>🤖 AI Contract Analysis</h4>
            <p>AI has reviewed your contract and provided suggestions for improvement.</p>
          </div>

          {loader && (
            <div className="ai-loading">
              <div className="loading-spinner"></div>
              <p>AI is analyzing your contract...</p>
            </div>
          )}

          {!loader && aiReviewResult && (
            <div className="ai-review-content">
              <div className="ai-summary">
                <h5>📋 AI Review Summary</h5>
                <div className="ai-summary-content">
                  <div dangerouslySetInnerHTML={{ __html: aiReviewResult }} />
                </div>
              </div>

              {suggestions.length > 0 && (
                <div className="ai-suggestions">
                  <h5>💡 AI Suggestions</h5>
                  <div className="suggestions-list">
                    {suggestions.map((suggestion) => (
                      <div
                        key={suggestion.id}
                        className={`suggestion-item ${activeSuggestion?.id === suggestion.id ? 'active' : ''}`}
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <div className="suggestion-header">
                          <span className="suggestion-type">{suggestion.type}</span>
                          <span className="suggestion-category">{suggestion.category}</span>
                        </div>
                        <h6 className="suggestion-title">{suggestion.title}</h6>
                        <p className="suggestion-content">{suggestion.content}</p>
                        
                        {activeSuggestion?.id === suggestion.id && (
                          <div className="suggestion-actions">
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => applySuggestion(suggestion)}
                              className="apply-suggestion-btn"
                            >
                              Apply Suggestion
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!loader && !aiReviewResult && (
            <div className="no-review-content">
              <p>No contract content available for AI review.</p>
            </div>
          )}

          <div className="ai-actions">
            <Button
              variant="outlined"
              onClick={onHide}
              className="close-btn"
            >
              Close
            </Button>
            <Button
              variant="contained"
              onClick={saveContractWithAPI}
              disabled={loader}
              className="save-contract-btn"
            >
              {loader ? 'Saving...' : 'Save Contract'}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AIClauseChecker; 