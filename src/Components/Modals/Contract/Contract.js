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
import { setContractEditor } from "../../../services/redux/reducer/addcontracteditor";

export default function Contract(props) {
  const { show, onHide, onHideAdd, ...modalProps } = props;
  
  // Debug modal state changes
  useEffect(() => {
    console.log("🔍 Contract: show prop changed to:", show);
    if (show) {
      console.log("🔍 Contract: Modal is being opened!");
    }
  }, [show]);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [UserID, setUserID] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [uploadsign, setUploadSign] = useState(false);
  const [formattedContent, setFormattedContent] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [highlightedContent, setHighlightedContent] = useState('');
  const [suggestionModalVisible, setSuggestionModalVisible] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState(null);
  const [appliedSuggestions, setAppliedSuggestions] = useState(new Set());
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipData, setTooltipData] = useState({
    original: '',
    corrected: '',
    position: { x: 150, y: 300 }
  });
  const [contentUpdated, setContentUpdated] = useState(false);
  const [editedSuggestion, setEditedSuggestion] = useState('');
  const [initialAISuggestion, setInitialAISuggestion] = useState('');

  // Safely encode text for usage inside inline onclick JS strings
  const encodeForOnclick = (text) => {
    try {
      const str = String(text ?? '')
        .replace(/\n|\r/g, ' ') // remove newlines which break JS string literal
        .replace(/\u2028|\u2029/g, ' ') // remove unicode line separators
        .replace(/</g, '&lt;') // basic HTML safety
        .replace(/>/g, '&gt;');
      return encodeURIComponent(str);
    } catch (e) {
      return '';
    }
  };

  // Normalize AI suggested text to remove markdown labels and artifacts
  const normalizeSuggestionText = (text) => {
    if (!text) return '';
    let cleaned = String(text);
    cleaned = cleaned.replace(/\*\*\*\*:\s*/gi, '');
    cleaned = cleaned.replace(/^\s*-\s*/gm, '');
    return cleaned;
  };

  // Replace first occurrence of plain text in an HTML string using a DOM-safe approach
  const replaceFirstTextInHtml = (htmlString, searchText, replacementText) => {
    try {
      if (!htmlString || !searchText) return htmlString;
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, 'text/html');

      const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, null);
      const lowerSearch = searchText.toLowerCase();
      let found = false;

      while (walker.nextNode()) {
        const node = walker.currentNode;
        const textLower = node.nodeValue.toLowerCase();
        const idx = textLower.indexOf(lowerSearch);
        if (idx !== -1) {
          // Split the text node around the match
          const before = node.nodeValue.slice(0, idx);
          const match = node.nodeValue.slice(idx, idx + searchText.length);
          const after = node.nodeValue.slice(idx + searchText.length);

          const spanBefore = doc.createTextNode(before);
          const replacement = doc.createTextNode(replacementText);
          const spanAfter = doc.createTextNode(after);

          const parent = node.parentNode;
          parent.replaceChild(spanAfter, node);
          parent.insertBefore(replacement, spanAfter);
          parent.insertBefore(spanBefore, replacement);

          found = true;
          break;
        }
      }

      return found ? doc.body.innerHTML : htmlString;
    } catch (e) {
      console.error('❌ DOM replace failed, falling back to regex:', e);
      try {
        const regex = new RegExp(searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        return htmlString.replace(regex, replacementText);
      } catch {
        return htmlString;
      }
    }
  };

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

  // Function to check if text has already been updated (Mobile-compatible)
  const isTextAlreadyUpdated = (text, originalText, suggestedText) => {
    const textLower = text.toLowerCase();
    const originalLower = originalText.toLowerCase();
    const suggestedLower = suggestedText.toLowerCase();
    
    // If the text contains the suggested text, it's already updated
    if (textLower.includes(suggestedLower)) {
      return true;
    }
    
    // If the text doesn't contain the original text, it's not applicable
    if (!textLower.includes(originalLower)) {
      return true;
    }
    
    return false;
  };

  // Function to show suggestion modal (Mobile-compatible)
  const showSuggestionModal = (suggestionData) => {
    console.log('🎯 showSuggestionModal called with:', suggestionData);
    console.log('🎯 Setting modal visible to true');
    setCurrentSuggestion({
      original: suggestionData.original || suggestionData.text,
      suggested: suggestionData.suggested || suggestionData.suggestion,
      instanceId: suggestionData.instanceId
    });
    const normalized = normalizeSuggestionText(
      suggestionData.suggested || suggestionData.suggestion
    );
    setEditedSuggestion(normalized || '');
    setInitialAISuggestion(normalized || '');
    setSuggestionModalVisible(true);
    console.log('🎯 Modal state should now be visible');
  };

  // Function to apply suggestion (Mobile-compatible) - EXACTLY like mobile
  const applyClauseSuggestion = (originalText, suggestedText, instanceId = null) => {
    try {
      console.log('🔧 Applying suggestion:', { originalText, suggestedText, instanceId });
      console.log('📝 Current ContractContent:', ContractContent);
      
      if (ContractContent) {
        console.log('✅ Using Redux state for update');
        
        let updatedContent = ContractContent;
        
        // For now, let's use a simpler approach - replace the first occurrence of the original text
        // This is more reliable than trying to match complex HTML spans
        const regex = new RegExp(originalText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        console.log(`🔍 Looking for: "${originalText}"`);
        console.log(`🔍 In content: "${ContractContent.substring(0, 200)}..."`);
        console.log(`🔍 Regex: ${regex}`);
        
        const beforeReplacement = updatedContent;
        const sanitizedSuggestion = normalizeSuggestionText(suggestedText);
        // DOM-safe replacement to handle nested tags/spacing variations
        updatedContent = replaceFirstTextInHtml(ContractContent, originalText, sanitizedSuggestion);
        console.log(`🎯 Replaced "${originalText}" with "${suggestedText}"`);
        console.log(`🔍 Content changed: ${beforeReplacement !== updatedContent}`);
        console.log(`🔍 Updated content preview: "${updatedContent.substring(0, 200)}..."`);

        console.log('📝 Updated content length:', updatedContent.length);
        console.log('🔄 Dispatching to Redux...');

        // Update Redux state
        dispatch(setContractEditor(updatedContent));
        
        // Mark this specific suggestion as applied
        setAppliedSuggestions(prev => new Set([...prev, originalText]));
        
        // Set content updated flag
        setContentUpdated(true);
        
        // Close modal
        setSuggestionModalVisible(false);
        setCurrentSuggestion(null);
        
        // Update highlighted content to reflect the applied change while keeping other highlights
        if (highlightedContent) {
          console.log('🔄 Updating highlighted content to reflect applied change');
          
          // Remove the specific highlighted span for this suggestion
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = highlightedContent;
          
          // Find and remove the specific highlighted span for this instance
          const highlightedSpans = tempDiv.querySelectorAll('.highlighted-clause');
          highlightedSpans.forEach(span => {
            const spanInstanceId = span.getAttribute('data-instance-id');
            if (spanInstanceId === instanceId) {
              // Replace this span with the corrected text
              const correctedTextNode = document.createTextNode(sanitizedSuggestion);
              span.parentNode.replaceChild(correctedTextNode, span);
            }
          });
          
          // Update the highlighted content with the corrected version
          const updatedHighlightedContent = tempDiv.innerHTML;
          setHighlightedContent(updatedHighlightedContent);
          
          console.log('✅ Highlighted content updated, keeping other highlights');
        } else {
          // If no highlighted content, just clear it to show the updated content
          setHighlightedContent(null);
        }
        
        // Show success message
        SuccessToast('Suggestion applied successfully');
        
        console.log('✅ Suggestion applied successfully');
        
      } else {
        console.log('❌ No ContractContent available');
        ErrorToast('No contract content available to update');
      }
    } catch (error) {
      console.error('❌ Error applying suggestion:', error);
      ErrorToast('Failed to apply suggestion');
    }
  };

  // Function to regenerate highlighting after applying suggestions
  const regenerateHighlighting = (content) => {
    console.log('🔄 Regenerating highlighting for content:', content ? 'Available' : 'Not available');
    console.log('📋 Applied suggestions:', Array.from(appliedSuggestions));
    console.log('📋 Current AI suggestions:', window.currentAISuggestions);
    
    if (!content) {
      console.log('❌ No content provided for highlighting');
      return;
    }

    // Get the current AI suggestions (we need to store them globally)
    if (window.currentAISuggestions && window.currentAISuggestions.length > 0) {
      console.log('📋 Regenerating highlighting with', window.currentAISuggestions.length, 'suggestions');
      
      let highlightedText = content;
      let hasChanges = false;
      
      window.currentAISuggestions.forEach(suggestion => {
        console.log('🎯 Processing suggestion for regeneration:', suggestion);
        if (suggestion.originalText && suggestion.correctedText) {
          // Check if this suggestion has been applied
          const originalText = suggestion.originalText;
          const isApplied = appliedSuggestions.has(originalText);
          
          console.log(`🔍 Suggestion "${originalText}" applied: ${isApplied}`);
          
          if (!isApplied) {
            console.log(`✅ Highlighting suggestion: ${suggestion.originalText}`);
            
            // Check if the original text still exists in the updated content
            if (content.toLowerCase().includes(suggestion.originalText.toLowerCase())) {
              const regex = new RegExp(`(${suggestion.originalText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
              let matchCount = 0;
              const beforeHighlight = highlightedText;
              highlightedText = highlightedText.replace(regex, (match, p1) => {
                matchCount++;
                const instanceId = `${suggestion.id}_${matchCount}`;
                const encodedOriginal = encodeForOnclick(suggestion.originalText);
                const encodedCorrected = encodeForOnclick(suggestion.correctedText);
                return `<span class="highlighted-clause" data-instance-id="${instanceId}" onclick="window.showSuggestion(decodeURIComponent('${encodedOriginal}'), decodeURIComponent('${encodedCorrected}'), '${instanceId}')" style="background-color: #ffeb3b; cursor: pointer; padding: 2px 4px; border-radius: 3px; text-decoration: underline; font-weight: bold;">${p1}<span style=\"font-size: 10px; color: #666;\"> (tap to apply suggestion)</span></span>`;
              });
              
              if (beforeHighlight !== highlightedText) {
                hasChanges = true;
                console.log(`✅ Added highlighting for: ${suggestion.originalText}`);
              }
            } else {
              console.log(`❌ Suggestion text not found in updated content: ${suggestion.originalText}`);
            }
          } else {
            console.log(`⏭️ Skipping applied suggestion: ${suggestion.originalText}`);
          }
        }
      });
      
      if (hasChanges) {
        setHighlightedContent(highlightedText);
        console.log('✅ Highlighting regenerated successfully');
      } else {
        console.log('ℹ️ No highlighting changes needed');
      }
    } else {
      console.log('❌ No AI suggestions available for regeneration');
    }
  };

  useEffect(() => {
    const userid = localStorage.getItem("_id");
    console.log('🔍 Retrieved userid from localStorage:', userid);

    if (userid && userid !== "undefined" && userid !== "null") {
      setUserID(userid);
      console.log('✅ UserID set successfully:', userid);
    } else {
      console.error('❌ Invalid userid from localStorage:', userid);
      ErrorToast('User authentication error. Please login again.');
      return;
    }
    
    // Add global function for handling suggestion clicks
    window.showSuggestion = (originalText, suggestedText, instanceId) => {
      console.log('🎯 Global showSuggestion called with:', { originalText, suggestedText, instanceId });
      showSuggestionModal({
        original: originalText,
        suggested: suggestedText,
        instanceId: instanceId
      });
    };
    
    // Reset content updated flag when component mounts
    setContentUpdated(false);
  }, []); // Remove UserID from dependency array to prevent infinite loop

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
    
    // Reset content updated flag when contract content changes (but not when it's updated by suggestions)
    // Only reset if we're not in the middle of applying a suggestion
    if (!contentUpdated) {
      setContentUpdated(false);
    }
  }, [ContractContent]);

  // Force re-render when ContractContent changes to show updated content
  useEffect(() => {
    console.log('🔄 ContractContent changed:', ContractContent ? 'Available' : 'Not available');
    if (ContractContent && highlightedContent === null) {
      console.log('✅ Showing updated content');
    }
    
    // If content was updated and highlighted content is cleared, ensure we show the updated content
    if (contentUpdated && !highlightedContent && ContractContent) {
      console.log('✅ Content updated, showing new content');
      // Force a re-render by updating the formatted content
      if (ContractContent && ContractContent !== "undefined") {
        const parser = new DOMParser();
        const doc = parser.parseFromString(ContractContent, "text/html");
        const images = doc.querySelectorAll("img");
        images.forEach((image) => {
          image.style.width = "100%";
        });
        setFormattedContent(doc.body.innerHTML);
      }
    }
  }, [ContractContent, highlightedContent, contentUpdated]);

  // Monitor ContractContent changes and force re-render
  useEffect(() => {
    console.log('📝 ContractContent updated in Redux:', ContractContent ? 'Available' : 'Not available');
    console.log('📝 ContractContent length:', ContractContent ? ContractContent.length : 0);
    
    // Force component to re-render when ContractContent changes
    if (ContractContent) {
      console.log('🔄 Forcing component re-render due to ContractContent change');
    }
  }, [ContractContent]);

  async function SaveContract() {
    // Check authentication first
    const token = localStorage.getItem('token');
    const userid = localStorage.getItem('_id');
    
    if (!token) {
      ErrorToast("Authentication required. Please login again.");
      return;
    }
    
    if (!userid || userid === "undefined" || userid === "null") {
      ErrorToast("User authentication error. Please login again.");
      return;
    }
    
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
    if (!UserID || UserID === "undefined" || UserID === "null") {
      console.error('❌ Invalid UserID:', UserID);
      ErrorToast("User authentication error. Please login again.");
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
      console.log('🔍 SaveContract - UserID:', UserID);
      console.log('🔍 SaveContract - ContractType:', ContractType);
      console.log('🔍 SaveContract - ContractName:', ContractName);
      console.log('🔍 SaveContract - startDate:', startDate);
      console.log('🔍 SaveContract - ContractSign:', ContractSign);
      console.log('🔍 SaveContract - ContractContent length:', ContractContent ? ContractContent.length : 0);
      
      const data = {
        category: ContractType,
        contractName: ContractName,
        Date: startDate,
        userId: userid, // Use fresh userid from localStorage
        signatureImage: ContractSign,
        contractText: ContractContent,
      };
      
      console.log('📤 Sending contract data:', data);
      const dataall = {
        id: userid, // Use fresh userid from localStorage
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
          dispatch(getContract(userid));
          dispatch(getTotalCount(userid));
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
    if (!ContractContent) {
      ErrorToast("Please add some contract content before checking with AI");
      return;
    }
    
    console.log('🔍 Starting AI clause check...');
    console.log('📝 Contract content:', ContractContent);
    
    setLoader(true); // Add loader back
    setContentUpdated(false); // Clear content updated indicator
    
    // Clear previous AI suggestions
    window.currentAISuggestions = [];
    window.lastUpdatedContent = null; // Clear locally stored content
    setAppliedSuggestions(new Set());
    
    try {
      const result = await AIService.checkWithAi(ContractContent, 'Analyze this contract and identify specific text that needs improvement. Look for placeholder text like [Insert...], grammatical issues, missing details, or unclear clauses. Provide specific suggestions for text that actually exists in the contract.');
      
      console.log('🤖 AI Response:', result);
      
      if (result && (result.analysis || result.data || result)) {
        const aiSuggestions = parseAISuggestions(result.analysis || result.data || result);
        
        console.log('📋 Parsed AI suggestions:', aiSuggestions);
        
        if (aiSuggestions.length > 0) {
          // Store AI suggestions globally for regeneration
          window.currentAISuggestions = aiSuggestions;
          
          // Create highlighted content with AI suggestions
          let highlightedText = ContractContent;
          
          aiSuggestions.forEach(suggestion => {
            console.log('🎯 Processing suggestion:', suggestion);
            if (suggestion.originalText && suggestion.correctedText) {
              // Check if the original text actually exists in the contract content
              if (ContractContent.toLowerCase().includes(suggestion.originalText.toLowerCase())) {
                console.log(`✅ Found "${suggestion.originalText}" in content`);
                const regex = new RegExp(`(${suggestion.originalText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
                let matchCount = 0;
                highlightedText = highlightedText.replace(regex, (match, p1) => {
                  matchCount++;
                  const instanceId = `${suggestion.id}_${matchCount}`;
                  const encodedOriginal = encodeForOnclick(suggestion.originalText);
                  const encodedCorrected = encodeForOnclick(suggestion.correctedText);
                  return `<span class=\"highlighted-clause\" data-instance-id=\"${instanceId}\" onclick=\"window.showSuggestion(decodeURIComponent('${encodedOriginal}'), decodeURIComponent('${encodedCorrected}'), '${instanceId}')\" style=\"background-color: #ffeb3b; cursor: pointer; padding: 2px 4px; border-radius: 3px; text-decoration: underline; font-weight: bold;\">${p1}<span style=\"font-size: 10px; color: #666;\"> (tap to apply suggestion)</span></span>`;
                });
              } else {
                console.log(`❌ Could not find "${suggestion.originalText}" in content`);
              }
            }
          });
          
          setHighlightedContent(highlightedText);
          SuccessToast(`${aiSuggestions.length} issues found. Click highlighted text for suggestions.`);
        } else {
          window.currentAISuggestions = [];
          setHighlightedContent(null);
          SuccessToast('Contract analysis complete. No major issues found.');
        }
      } else {
        console.error('❌ AI analysis failed:', result.error);
        ErrorToast(result.error || 'Failed to analyze contract with AI');
      }
    } catch (error) {
      console.error('❌ Error during AI clause check:', error);
      ErrorToast('Failed to check contract clauses with AI. Please try again.');
    } finally {
      setLoader(false); // Remove loader
    }
  };

  // Function to parse AI suggestions from the API response
  const parseAISuggestions = (aiResponse) => {
    const suggestions = [];
    
    try {
      console.log('🔍 Parsing AI response:', aiResponse);
      
      // Handle different response formats
      let responseData = aiResponse;
      
      // If it's a string, try to parse as JSON
      if (typeof aiResponse === 'string') {
        try {
          responseData = JSON.parse(aiResponse);
        } catch (e) {
          // If not JSON, treat as plain text
          responseData = { text: aiResponse };
        }
      }
      
      // Extract suggestions from the response
      if (responseData.suggestions && Array.isArray(responseData.suggestions)) {
        responseData.suggestions.forEach((suggestion, index) => {
          suggestions.push({
            id: index + 1,
            originalText: suggestion.original || suggestion.incorrect || suggestion.text || '',
            correctedText: suggestion.corrected || suggestion.suggestion || suggestion.improved || '',
            type: suggestion.type || 'improvement',
            description: suggestion.description || suggestion.explanation || ''
          });
        });
      } else if (responseData.issues && Array.isArray(responseData.issues)) {
        responseData.issues.forEach((issue, index) => {
          suggestions.push({
            id: index + 1,
            originalText: issue.original || issue.text || '',
            correctedText: issue.suggestion || issue.corrected || '',
            type: issue.type || 'improvement',
            description: issue.description || issue.explanation || ''
          });
        });
      } else if (responseData.text || typeof responseData === 'string') {
        // Parse plain text response for suggestions
        const text = responseData.text || responseData;
        console.log('📝 Parsing text response:', text.substring(0, 200) + '...');
        
        // Look for specific patterns in the text
        const lines = text.split('\n');
        
        lines.forEach((line, index) => {
          const trimmedLine = line.trim();
          
          // Look for numbered items with specific issues
          if (trimmedLine.match(/^\d+\.\s*\*\*.*\*\*:/)) {
            // Extract the issue title
            const titleMatch = trimmedLine.match(/^\d+\.\s*\*\*(.*?)\*\*:/);
            if (titleMatch) {
              const title = titleMatch[1].trim();
              
              // Look for specific suggestions in the following lines
              let suggestionText = '';
              for (let i = index + 1; i < lines.length; i++) {
                const nextLine = lines[i].trim();
                if (nextLine.match(/^\d+\.\s*\*\*/) || nextLine === '') {
                  break; // Stop at next numbered item or empty line
                }
                suggestionText += nextLine + ' ';
              }
              
              if (suggestionText.trim()) {
                suggestions.push({
                  id: suggestions.length + 1,
                  originalText: title,
                  correctedText: suggestionText.trim(),
                  type: 'improvement',
                  description: `${title}: ${suggestionText.trim()}`
                });
              }
            }
          }
          
          // Look for placeholder text that needs to be replaced
          if (trimmedLine.includes('[Insert') || trimmedLine.includes('[Add') || trimmedLine.includes('placeholder')) {
            suggestions.push({
              id: suggestions.length + 1,
              originalText: trimmedLine,
              correctedText: 'Specific content should be added here',
              type: 'placeholder',
              description: `Placeholder text found: ${trimmedLine}`
            });
          }
          
          // Look for specific placeholder patterns in the contract
          if (trimmedLine.includes('[Insert party names and details here]')) {
            suggestions.push({
              id: suggestions.length + 1,
              originalText: '[Insert party names and details here]',
              correctedText: 'Landlord: [Name] and Tenant: [Name]',
              type: 'placeholder',
              description: 'Party names need to be specified'
            });
          }
          
          if (trimmedLine.includes('[Insert specific terms and conditions here]')) {
            suggestions.push({
              id: suggestions.length + 1,
              originalText: '[Insert specific terms and conditions here]',
              correctedText: '1. Vehicle must be returned in the same condition. 2. No smoking allowed. 3. Mileage limit: 100 miles per day.',
              type: 'placeholder',
              description: 'Terms and conditions need to be specified'
            });
          }
          
          if (trimmedLine.includes('[Insert payment details here]')) {
            suggestions.push({
              id: suggestions.length + 1,
              originalText: '[Insert payment details here]',
              correctedText: 'Daily rate: $50. Security deposit: $200. Payment due at pickup.',
              type: 'placeholder',
              description: 'Payment details need to be specified'
            });
          }
          
          if (trimmedLine.includes('[Insert termination conditions here]')) {
            suggestions.push({
              id: suggestions.length + 1,
              originalText: '[Insert termination conditions here]',
              correctedText: 'Either party may terminate with 24 hours notice. Early return subject to partial refund.',
              type: 'placeholder',
              description: 'Termination conditions need to be specified'
            });
          }
          
          if (trimmedLine.includes('[Insert governing law here]')) {
            suggestions.push({
              id: suggestions.length + 1,
              originalText: '[Insert governing law here]',
              correctedText: 'This agreement shall be governed by the laws of [State/Country].',
              type: 'placeholder',
              description: 'Governing law needs to be specified'
            });
          }
        });
      }
      
      // If no suggestions found from AI, add common placeholder suggestions based on contract content
      if (suggestions.length === 0 && ContractContent) {
        console.log('🔍 No AI suggestions found, adding common placeholder suggestions');
        
        // Look for common placeholder patterns in the contract
        const placeholderPatterns = [
          {
            original: '[Insert party names and details here]',
            corrected: 'Landlord: [Name] and Tenant: [Name]',
            description: 'Party names need to be specified'
          },
          {
            original: '[Insert specific terms and conditions here]',
            corrected: '1. Vehicle must be returned in the same condition. 2. No smoking allowed. 3. Mileage limit: 100 miles per day.',
            description: 'Terms and conditions need to be specified'
          },
          {
            original: '[Insert payment details here]',
            corrected: 'Daily rate: $50. Security deposit: $200. Payment due at pickup.',
            description: 'Payment details need to be specified'
          },
          {
            original: '[Insert termination conditions here]',
            corrected: 'Either party may terminate with 24 hours notice. Early return subject to partial refund.',
            description: 'Termination conditions need to be specified'
          },
          {
            original: '[Insert governing law here]',
            corrected: 'This agreement shall be governed by the laws of [State/Country].',
            description: 'Governing law needs to be specified'
          }
        ];
        
        placeholderPatterns.forEach((pattern, index) => {
          if (ContractContent.includes(pattern.original)) {
          suggestions.push({
              id: index + 1,
              originalText: pattern.original,
              correctedText: pattern.corrected,
              type: 'placeholder',
              description: pattern.description
            });
          }
        });
      }
      
      console.log('📋 Final parsed suggestions:', suggestions);
      return suggestions;
      
    } catch (error) {
      console.error('❌ Error parsing AI suggestions:', error);
      return [];
    }
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
      // const updatedSuggestions = suggestions.filter(s => s.id !== suggestion.id); // This line was removed as per the edit hint
      // setSuggestions(updatedSuggestions); // This line was removed as per the edit hint
      
      // Show success message
      SuccessToast('Suggestion applied successfully');
      
      // If no more suggestions, re-check the contract
      // if (updatedSuggestions.length === 0) { // This line was removed as per the edit hint
      //   console.log('🔄 No more suggestions, re-checking contract...'); // This line was removed as per the edit hint
        
      //   // Re-run AI check with updated content // This line was removed as per the edit hint
      //   setAiLoading(true); // This line was removed as per the edit hint
        
      //   const result = await AIService.checkWithAi(updatedContent, 'Analyze this contract for legal issues, grammar errors, and improvement suggestions'); // This line was removed as per the edit hint
        
      //   if (result.success) { // This line was removed as per the edit hint
      //     const parsedSuggestions = parseAISuggestions(result.analysis, result.highlightedSections); // This line was removed as per the edit hint
          
      //     if (parsedSuggestions.length === 0) { // This line was removed as per the edit hint
      //       // No issues found - show popup and hide suggestions // This line was removed as per the edit hint
      //       console.log('✅ No issues found after applying suggestion'); // This line was removed as per the edit hint
      //       SuccessToast('All issues have been resolved! Contract is now error-free.'); // This line was removed as per the edit hint
            
      //       // Hide suggestions component after a short delay // This line was removed as per the edit hint
      //       setTimeout(() => { // This line was removed as per the edit hint
      //         setShowSuggestions(false); // This line was removed as per the edit hint
      //       }, 2000); // This line was removed as per the edit hint
      //     } else { // This line was removed as per the edit hint
      //       // Still have issues - update suggestions // This line was removed as per the edit hint
      //       setSuggestions(parsedSuggestions); // This line was removed as per the edit hint
      //       console.log('⚠️ Still have issues after applying suggestion:', parsedSuggestions.length); // This line was removed as per the edit hint
      //     } // This line was removed as per the edit hint
      //   } else { // This line was removed as per the edit hint
      //     ErrorToast('Failed to re-check contract after applying suggestion'); // This line was removed as per the edit hint
      //   } // This line was removed as per the edit hint
        
      //   setAiLoading(false); // This line was removed as per the edit hint
      // } // This line was removed as per the edit hint
      
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
            <div className="contract-content">
              {highlightedContent ? (
                <div>
                  <div className="content-header">
                    <h3>Contract Content with Suggestions</h3>
                    <div className="highlighting-info">
                      <span className="highlighting-badge">💡 Tap highlighted text for suggestions</span>
                    </div>
                  </div>
                  <div 
                    className="highlighted-content"
                    dangerouslySetInnerHTML={{ __html: highlightedContent }}
                  />
                  <div className="highlighting-controls">
                    {/* <button
                      className="btn-clear-highlighting"
                      onClick={() => {
                        setHighlightedContent('');
                        setAppliedSuggestions(new Set());
                      }}
                    >
                      Clear Highlighting
                    </button> */}
                    {/* {window.currentAISuggestions && window.currentAISuggestions.length > 0 && (
                      <button
                        className="btn-regenerate-highlighting"
                        onClick={() => {
                          console.log('🔄 Manual highlighting regeneration requested');
                          regenerateHighlighting(ContractContent);
                        }}
                        style={{ marginLeft: '10px', backgroundColor: '#007bff', color: 'white' }}
                      >
                        Regenerate Highlighting
                      </button>
                    )} */}
                  </div>
            </div>
              ) : (
                <div>
                  {console.log('🎯 Displaying normal content, highlightedContent:', highlightedContent)}
                  {console.log('🎯 ContractContent available:', !!ContractContent)}
                  {console.log('🎯 Last updated content available:', !!window.lastUpdatedContent)}
                  {contentUpdated && (
                    <div style={{ 
                      backgroundColor: '#d4edda', 
                      color: '#155724', 
                      padding: '10px', 
                      marginBottom: '10px', 
                      borderRadius: '5px',
                      border: '1px solid #c3e6cb'
                    }}>
                      ✅ Content has been updated with your suggestions!
                    </div>
                  )}
                  {(window.lastUpdatedContent || ContractContent) && (window.lastUpdatedContent || ContractContent) !== "undefined" &&
                  /\.(pdf|doc|docx|png|jpe?g)$/i.test(window.lastUpdatedContent || ContractContent)
                  ? getFileContent(window.lastUpdatedContent || ContractContent)
                  : (window.lastUpdatedContent || ContractContent) && (window.lastUpdatedContent || ContractContent) !== "undefined"
                  ? Parser(window.lastUpdatedContent || ContractContent)
                  : "No content available"}
                </div>
              )}
              </div>

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
                {/* {highlightedContent && (
                  <Button 
                    className="clear-highlighting-btn" 
                    onClick={() => {
                      setHighlightedContent(null);
                      // Ensure we show the updated content when clearing highlighting
                      if (contentUpdated) {
                        console.log('✅ Clearing highlighting, showing updated content');
                      }
                    }}
                    style={{ marginLeft: '10px', backgroundColor: '#6c757d', color: 'white' }}
                  >
                    Clear Highlighting
                  </Button>
                )} */}
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

      {/* Suggestion Modal (Mobile-compatible) */}
      {suggestionModalVisible && (
        <div className="modal-overlay">
          <div className="suggestion-modal-content">
            <h3 className="suggestion-modal-title">Apply Suggestion?</h3>
            
            <div className="suggestion-content">
              <div className="suggestion-item">
                <label className="suggestion-label">Original:</label>
                <p className="original-text">{currentSuggestion?.original}</p>
              </div>
              
              <div className="suggestion-item">
                <label className="suggestion-label">Suggested:</label>
                <textarea
                  className="suggestion-textarea"
                  value={editedSuggestion}
                  onChange={(e) => setEditedSuggestion(e.target.value)}
                  placeholder="Edit the suggestion before applying..."
                />
                <div className="char-count-row">
                  <span className="char-count">{editedSuggestion.length} chars</span>
                  {initialAISuggestion && editedSuggestion !== initialAISuggestion && (
                    <button
                      className="reset-suggestion-link"
                      onClick={() => setEditedSuggestion(initialAISuggestion)}
                    >
                      Reset to AI suggestion
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="suggestion-modal-buttons">
              <button
                className="cancel-button"
                onClick={() => setSuggestionModalVisible(false)}
              >
                Cancel
              </button>
              
              <button
                className="apply-button"
                onClick={() => {
                  if (currentSuggestion) {
                    applyClauseSuggestion(
                      currentSuggestion.original,
                      editedSuggestion || currentSuggestion.suggested,
                      currentSuggestion.instanceId
                    );
                  }
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Static Tooltip (Mobile-compatible) */}
      {showTooltip && (
        <div className="tooltip-container">
          {/* Header with blue bullet */}
          <div className="tooltip-header">
            <div className="tooltip-bullet"></div>
            <span className="tooltip-label">Clause</span>
          </div>

          {/* Content with comparison */}
          <div className="tooltip-content-row">
            <span className="incorrect-text">{tooltipData.original}</span>
            <span className="tooltip-arrow">→</span>
            <div className="corrected-container">
              <span className="corrected-text">{tooltipData.corrected}</span>
            </div>
          </div>

          {/* Arrow pointer */}
          <div className="tooltip-arrow-pointer"></div>
        </div>
      )}
    </>
  );
}
