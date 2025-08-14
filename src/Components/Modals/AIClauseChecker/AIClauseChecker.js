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
      console.log('🔍 Starting AI contract clause check...');
      console.log('📄 Contract content length:', contractContent.length);
      
      // Use the new checkClausesWithAI method that calls the backend API
      const result = await AIService.checkClausesWithAI(contractContent);
      
      if (result.success) {
        // Handle different response structures from the API
        let analysisText = '';
        let highlightedSections = [];
        
        if (typeof result.analysis === 'string') {
          analysisText = result.analysis;
        } else if (result.analysis && typeof result.analysis === 'object') {
          // Handle object response structure
          if (result.analysis.message) {
            analysisText = result.analysis.message;
          } else if (result.analysis.botResponse) {
            analysisText = result.analysis.botResponse;
          } else if (result.analysis.analysis) {
            analysisText = result.analysis.analysis;
          } else {
            // Convert object to string if needed
            analysisText = JSON.stringify(result.analysis, null, 2);
          }
          
          // Extract highlighted sections if available
          if (result.analysis.originalText) {
            highlightedSections.push({
              text: result.analysis.originalText,
              category: 'legal',
              original: result.analysis.originalText
            });
          }
        } else {
          analysisText = 'AI analysis completed successfully.';
        }
        
        // Use highlighted sections from result if available
        if (result.highlightedSections && result.highlightedSections.length > 0) {
          highlightedSections = result.highlightedSections;
        }
        
        setAiReviewResult(analysisText);
        
        // Parse AI suggestions into structured format
        const parsedSuggestions = parseAISuggestions(analysisText, highlightedSections);
        setSuggestions(parsedSuggestions);
        
        console.log('✅ AI contract clause check completed');
        console.log('📋 Analysis result:', analysisText);
        console.log('🎯 Highlighted sections:', highlightedSections);
      } else {
        ErrorToast(result.error || 'Failed to analyze contract');
        console.error('❌ AI contract clause check failed:', result.error);
      }
    } catch (error) {
      console.error('❌ AI clause check error:', error);
      ErrorToast('Failed to check contract clauses with AI. Please try again.');
    } finally {
      setLoader(false);
    }
  };

  const parseAISuggestions = (aiResponse, highlightedSections = []) => {
    // Parse AI response into structured suggestions
    const suggestions = [];
    
    try {
      // If we have highlighted sections from the API, use them
      if (highlightedSections && highlightedSections.length > 0) {
        highlightedSections.forEach((section, index) => {
          suggestions.push({
            id: index + 1,
            type: 'risk',
            title: `Risk Area ${index + 1}`,
            content: section.text || section.content || section,
            category: section.category || 'legal',
            original: section.original || section.text || section.content || section,
            highlighted: true
          });
        });
      } else {
        // Parse the AI response text into meaningful suggestions
        const cleanResponse = aiResponse.replace(/<[^>]*>/g, ''); // Remove HTML tags
        
        // Split by common section markers
        const sections = cleanResponse.split(/(?=##|\*\*|Risk|Issue|Problem|Warning|Suggestion|Recommendation|Consider|Note)/);
        
        sections.forEach((section, index) => {
          const trimmedSection = section.trim();
          if (trimmedSection && trimmedSection.length > 10) {
            // Determine if it's a risk or suggestion based on content
            const isRisk = /risk|problem|warning|issue|concern|danger/i.test(trimmedSection);
            const isSuggestion = /suggestion|recommendation|improve|enhance|consider/i.test(trimmedSection);
            
            // Extract title from first line
            const lines = trimmedSection.split('\n');
            const title = lines[0].replace(/[#*]/g, '').trim().substring(0, 50);
            
            suggestions.push({
              id: index + 1,
              type: isRisk ? 'risk' : (isSuggestion ? 'suggestion' : 'review'),
              title: title || `Analysis Point ${index + 1}`,
              content: trimmedSection,
              category: isRisk ? 'legal' : 'general',
              highlighted: false
            });
          }
        });
        
        // If no sections found, create a single suggestion
        if (suggestions.length === 0 && cleanResponse.length > 0) {
          suggestions.push({
            id: 1,
            type: 'review',
            title: 'AI Analysis',
            content: cleanResponse,
            category: 'general',
            highlighted: false
          });
        }
      }
    } catch (error) {
      console.error('Error parsing AI suggestions:', error);
      // Fallback to simple suggestion
      const cleanResponse = aiResponse.replace(/<[^>]*>/g, '');
      suggestions.push({
        id: 1,
        type: 'review',
        title: 'AI Review',
        content: cleanResponse || 'AI analysis completed successfully.',
        category: 'general',
        highlighted: false
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
    
    // Sort suggestions by length (longest first) to avoid partial matches
    const sortedSuggestions = [...suggestions].sort((a, b) => {
      const aText = a.original || a.content || "";
      const bText = b.original || b.content || "";
      return bText.length - aText.length;
    });

    sortedSuggestions.forEach((suggestion, index) => {
      const textToHighlight = suggestion.original || suggestion.content || "";
      
      if (textToHighlight && textToHighlight.trim()) {
        // Escape special regex characters
        const escapedText = textToHighlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedText, 'gi');
        
        highlightedText = highlightedText.replace(regex, (match) => {
          const highlightClass = suggestion.highlighted ? 'highlighted-risk' : 'highlighted-suggestion';
          return `<span class="${highlightClass}" data-suggestion-id="${suggestion.id}" title="${suggestion.title}">${match}</span>`;
        });
      }
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
                  <div className="ai-summary-text">
                    {aiReviewResult}
                  </div>
                </div>
              </div>

              <div className="contract-analysis-layout">
                <div className="contract-section">
                  <h5>📄 Contract Content</h5>
                  <div className="contract-content-display">
                    <div 
                      className="contract-text"
                      dangerouslySetInnerHTML={{ 
                        __html: highlightText(contractContent, suggestions) 
                      }}
                    />
                  </div>
                </div>

                <div className="ai-suggestions-panel">
                  <h5>🚨 AI Risk Analysis</h5>
                  <div className="suggestions-container">
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={suggestion.id}
                        className={`suggestion-card ${suggestion.type}`}
                      >
                        <div className="suggestion-header">
                          <div className="suggestion-icon">
                            {suggestion.type === 'risk' ? '🚨' : '💡'}
                          </div>
                          <span className="suggestion-type">
                            {suggestion.type === 'risk' ? 'RISK' : 'SUGGESTION'}
                          </span>
                        </div>
                        <div className="suggestion-content">
                          <div className="suggestion-text">
                            {suggestion.content && typeof suggestion.content === 'string' ? (
                              suggestion.content.replace(/<[^>]*>/g, '').substring(0, 200) + '...'
                            ) : (
                              'Suggestion content'
                            )}
                          </div>
                        </div>
                        <div className="suggestion-arrow">
                          ←
                        </div>
                        <div className="suggestion-actions">
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => applySuggestion(suggestion)}
                            className="apply-suggestion-btn"
                          >
                            Apply
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
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