import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CopyIcon,
  GrayChat,
  SendComposer,
  ThumbsDown,
  ThumbsUp,
} from "../../assets/svgs";
import {
  newChat,
  aiMessage,
  getChatHistory,
  getSingleChatHistory,
  deleteChat,
  updateChatTitle,
} from "../../services/redux/middleware/Project/aiChat";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Header from "../../Components/Header/Header";

const AiChat = () => {
  const location = useLocation();
  const chatData = location.state;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [isComposerFocused, setIsComposerFocused] = useState(false);
  const [editingChatId, setEditingChatId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [messageReactions, setMessageReactions] = useState({});
  const [failedMessages, setFailedMessages] = useState({}); // Track failed messages
  const [isSending, setIsSending] = useState(false); // Track if message is being sent
  const messagesEndRef = useRef(null);

  // Get Redux state with fallbacks
  const aiChatState = useSelector((state) => state.aiChat);
  const {
    loading = false,
    chatHistory = [],
    messages = [],
    isTyping = false,
  } = aiChatState || {};

  // Debug logging
  console.log("Current aiChat state:", aiChatState);
  console.log("Current messages state:", messages);

  // Debug individual messages
  if (messages && messages.length > 0) {
    messages.forEach((msg, index) => {
      console.log(`Message ${index}:`, {
        id: msg._id,
        text: msg.text,
        user: msg.user,
        createdAt: msg.createdAt,
        hasUser: !!msg.user,
        hasText: !!msg.text,
      });
    });
  }

  const suggestedPrompts = [
    "Write a professional NDA contract from scratch.",
    "Summarize lengthy legal documents in seconds.",
    "Compare versions of documents to highlight changes.",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadChatHistory = useCallback(async () => {
    try {
      console.log("Loading chat history...");
      const result = await dispatch(getChatHistory());
      console.log("Chat history result:", result);
    } catch (error) {
      console.log("Error loading chat history:", error);
      toast.error("Failed to load chat history");
    }
  }, [dispatch]);

  const loadSingleChatHistory = useCallback(async () => {
    try {
      console.log("Loading single chat history for:", chatData._id);
      const result = await dispatch(getSingleChatHistory(chatData._id));
      console.log("Single chat history result:", result);

      if (result?.payload?.status === 404) {
        console.log(
          "⚠️ Chat history not found (404) - this might be a new chat"
        );
      }
    } catch (error) {
      console.log("Error loading single chat history:", error);
      toast.error("Failed to load chat history");
    }
  }, [dispatch, chatData._id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history on component mount
  useEffect(() => {
    loadChatHistory();
  }, [loadChatHistory]);

  // Load single chat history if chatData exists
  useEffect(() => {
    if (chatData?._id) {
      console.log("Chat data received:", chatData);
      loadSingleChatHistory();
    } else {
      console.log("No chat data, starting fresh chat");
    }
  }, [chatData, loadSingleChatHistory]);

  const handleSuggestionClick = (prompt) => {
    setInputValue("");
    handleSendMessage(prompt);
  };

  const handleCopyMessage = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Message copied to clipboard");
  };

  const handleReaction = (messageId, reaction) => {
    setMessageReactions((prev) => ({
      ...prev,
      [messageId]: reaction,
    }));
  };

  const handleSendMessage = async (text) => {
    try {
      if (!text?.trim() || isSending) return;

      setIsSending(true);

      let currentChatId = chatData?._id;

      // If no current chat, create a new one
      if (!currentChatId) {
        console.log("Creating new chat...");
        const newChatResult = await dispatch(
          newChat({
            title: "New Chat",
            model: "gpt-4o-mini",
          })
        );

        if (newChatResult?.payload?.status === 200) {
          currentChatId = newChatResult.payload.data._id;
          // Navigate to the new chat
          navigate("/AiChat", {
            state: newChatResult.payload.data,
            replace: true,
          });
        } else {
          console.log(
            "Failed to create new chat:",
            newChatResult?.payload?.message
          );
          toast.error("Failed to create new chat");
          return;
        }
      }

      const userMessageObj = {
        _id: Math.round(Math.random() * 1000000),
        text: text,
        createdAt: new Date().toISOString(),
        user: {
          _id: 1,
          name: "You",
        },
      };

      // Add user message to local state immediately (optimistic update)
      dispatch({ type: "aiChat/addMessage", payload: userMessageObj });

      // Clear the input field
      setInputValue("");

      console.log("Sending message:", text, "to chat:", currentChatId);

      const result = await dispatch(
        aiMessage({ data: { message: text }, chatId: currentChatId })
      );

      if (result?.payload?.status === 200) {
        // AI response is already handled in the reducer
        console.log("AI message sent successfully");
        // Remove from failed messages if it was there
        setFailedMessages((prev) => {
          const newState = { ...prev };
          delete newState[userMessageObj._id];
          return newState;
        });
      } else {
        console.log("AI response error", result?.payload?.message);

        // Mark message as failed
        setFailedMessages((prev) => ({
          ...prev,
          [userMessageObj._id]: {
            error: result?.payload?.message,
            status: result?.payload?.status,
          },
        }));

        // Show specific error messages based on error type
        if (result?.payload?.status === "TIMEOUT") {
          toast.error("AI response timeout. Please try again.");
        } else if (result?.payload?.status === "NETWORK_ERROR") {
          toast.error("Network error. Please check your connection.");
        } else {
          toast.error(result?.payload?.message || "Failed to get AI response");
        }
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const handleNewChat = async () => {
    try {
      console.log("Creating new chat...");
      const result = await dispatch(
        newChat({
          title: "New Chat",
          model: "gpt-4o-mini",
        })
      );

      if (result?.payload?.status === 200) {
        // Navigate to the new chat
        navigate("/AiChat", {
          state: result.payload.data,
          replace: true,
        });
        // Clear messages for new chat
        dispatch({ type: "aiChat/clearMessages" });
      } else {
        console.log("Failed to create new chat:", result?.payload?.message);
        toast.error("Failed to create new chat");
      }
    } catch (error) {
      console.log("Error creating new chat:", error);
      toast.error("Failed to create new chat");
    }
  };

  const handleChatSelect = (chat) => {
    navigate("/AiChat", {
      state: chat,
      replace: true,
    });
  };

  // Delete confirm modal state
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteChat = (chatId, e) => {
    e.stopPropagation();
    setPendingDeleteId(chatId);
    setShowDeleteModal(true);
  };

  const confirmDeleteChat = async () => {
    const chatId = pendingDeleteId;
    setShowDeleteModal(false);
    if (!chatId) return;
    try {
      console.log("Deleting chat:", chatId);
      const result = await dispatch(deleteChat(chatId));

      if (result?.payload?.status === 200) {
        toast.success("Chat deleted successfully");
        // If we're currently viewing the deleted chat, navigate to new chat
        if (chatData?._id === chatId) {
          handleNewChat();
        }
      } else {
        console.log("Failed to delete chat:", result?.payload?.message);
        toast.error("Failed to delete chat");
      }
    } catch (error) {
      console.log("Error deleting chat:", error);
      toast.error("Failed to delete chat");
    } finally {
      setPendingDeleteId(null);
    }
  };

  const cancelDeleteChat = () => {
    setShowDeleteModal(false);
    setPendingDeleteId(null);
  };

  const handleEditTitle = (chat, e) => {
    e.stopPropagation();
    setEditingChatId(chat._id);
    setEditingTitle(chat.title);
  };

  const handleSaveTitle = async (chatId) => {
    try {
      console.log("Updating chat title:", chatId, editingTitle);
      const result = await dispatch(
        updateChatTitle({
          chatId,
          title: editingTitle,
        })
      );

      if (result?.payload?.status === 200) {
        toast.success("Chat title updated");
        setEditingChatId(null);
        setEditingTitle("");
      } else {
        console.log("Failed to update title:", result?.payload?.message);
        toast.error("Failed to update title");
      }
    } catch (error) {
      console.log("Error updating title:", error);
      toast.error("Failed to update title");
    }
  };

  const handleCancelEdit = () => {
    setEditingChatId(null);
    setEditingTitle("");
  };

  const handleRetryMessage = async (messageId, messageText) => {
    try {
      console.log("Retrying message:", messageId, messageText);

      // Remove from failed messages
      setFailedMessages((prev) => {
        const newState = { ...prev };
        delete newState[messageId];
        return newState;
      });

      // Retry sending the message
      await handleSendMessage(messageText);
    } catch (error) {
      console.error("Error retrying message:", error);
      toast.error("Failed to retry message");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !isSending) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const renderMessage = (message) => {
    // Add null checks to prevent errors
    if (!message || !message.user || !message.text) {
      console.warn("Invalid message object:", message);
      return null;
    }

    try {
      const isAI = message.user._id === 2;
      const reaction = messageReactions[message._id];
      const isFailed = failedMessages[message._id];

      return (
        <div
          key={message._id || Math.random()}
          className={`flex ${isAI ? "justify-start" : "justify-end"} mb-4`}
        >
          <div
            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
              isAI ? "bg-[#EDEDED] text-gray-900" : "bg-[#0A1126] text-white"
            }`}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.text || "No message content"}
            </p>
            {/* Show retry button for failed user messages */}
            {!isAI && isFailed && (
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => handleRetryMessage(message._id, message.text)}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs hover:bg-red-200 transition-colors"
                >
                  Retry
                </button>
                <span className="text-xs text-red-600">
                  {isFailed.status === "TIMEOUT" ? "Timeout" : "Failed"}
                </span>
              </div>
            )}

            {isAI && (
              <div className="flex items-center gap-3 mt-2 ml-0">
                <button
                  onClick={() => handleCopyMessage(message.text)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                  title="Copy message"
                >
                  <CopyIcon />
                </button>

                <button
                  onClick={() => handleReaction(message._id, "like")}
                  className={`p-1 rounded transition-colors hover:bg-gray-200`}
                  title="Like"
                >
                  <ThumbsUp
                    color={reaction === "like" ? "#16a34a" : "#0A1126"}
                  />
                </button>

                <button
                  onClick={() => handleReaction(message._id, "dislike")}
                  className={`p-1 rounded transition-colors hover:bg-gray-200`}
                  title="Dislike"
                >
                  <ThumbsDown
                    color={reaction === "dislike" ? "#dc2626" : "#0A1126"}
                  />
                </button>
              </div>
            )}
          </div>
        </div>
      );
    } catch (error) {
      console.error("Error rendering message:", error, "Message:", message);
      return (
        <div
          key={message._id || Math.random()}
          className="flex justify-start mb-4"
        >
          <div className="bg-red-100 text-red-900 px-4 py-2 rounded-2xl">
            <p className="text-sm">Error rendering message</p>
          </div>
        </div>
      );
    }
  };

  const renderChatHistoryItem = (chat) => {
    const isEditing = editingChatId === chat._id;
    const isActive = chatData?._id === chat._id;

    return (
      <div
        key={chat._id}
        className={`p-3 rounded-lg cursor-pointer transition-colors ${
          isActive ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"
        }`}
        onClick={() => handleChatSelect(chat)}
      >
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              className="flex-1 text-sm border border-gray-300 rounded px-2 py-1"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSaveTitle(chat._id);
                } else if (e.key === "Escape") {
                  handleCancelEdit();
                }
              }}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSaveTitle(chat._id);
              }}
              className="text-green-600 hover:text-green-700"
            >
              ✓
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCancelEdit();
              }}
              className="text-red-600 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 truncate flex-1">
              {chat.title}
            </h3>
            <div className="flex items-center gap-1 opacity-100 transition-opacity">
              <button
                onClick={(e) => handleEditTitle(chat, e)}
                className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-gray-700"
                title="Edit title"
              >
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button
                onClick={(e) => handleDeleteChat(chat._id, e)}
                className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-red-600"
                title="Delete chat"
              >
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showHistorySidebar, setShowHistorySidebar] = useState(true); // Desktop sidebar visibility

  // Safety check for Redux state
  if (!aiChatState) {
    console.error("AI Chat Redux state is not available");
    return (
      <div className="flex-1 flex bg-gray-50 h-screen justify-center items-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">⚠️</div>
          <p className="text-gray-600">
            Unable to load chat state. Please refresh the page.
          </p>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading && !chatData?._id) {
    return (
      <div className="flex-1 flex bg-gray-50 h-screen justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <Header headername={"PocketFiler AI Chat"} />
      <div className="flex-1 flex mt-4 bg-gray-50 h-[calc(100vh-120px)]">
        {/* Central Chat Area */}
        <div className="flex-1 flex flex-col bg-white h-full">
          {/* Chat History Toggle Button */}
          {!showHistorySidebar && (
            <div className="flex justify-end p-4 border-b border-gray-200">
              <button
                onClick={() => {
                  // Show sidebar on desktop, modal on mobile
                  if (window.innerWidth >= 1024) {
                    setShowHistorySidebar(true);
                  } else {
                    setShowHistoryModal(true);
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                Chat History
              </button>
            </div>
          )}

          {/* Mobile Chat History Button (always visible on mobile) */}
          <div className="lg:hidden flex justify-end p-4 border-b border-gray-200 bg-white">
            <button
              onClick={() => setShowHistoryModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              Chat History
            </button>
          </div>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6">
            {!messages || messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="mb-10">
                  <GrayChat />
                </div>

                <div className="space-y-3 w-full max-w-md">
                  {suggestedPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(prompt)}
                      className="w-full bg-white rounded-xl p-2 md:p-3 text-left hover:bg-gray-50 transition-colors border border-gray-200"
                    >
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {prompt}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages &&
                  messages.length > 0 &&
                  (() => {
                    try {
                      return messages
                        .filter(
                          (message) => message && message.user && message.text
                        )
                        .map(renderMessage)
                        .filter(Boolean);
                    } catch (error) {
                      console.error("Error rendering messages:", error);
                      return null;
                    }
                  })()}
                {isTyping && (
                  <div className="flex justify-start mb-4">
                    <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-3 lg:p-5">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <div
                  className={`relative rounded-2xl border transition-colors ${
                    isComposerFocused
                      ? "border-blue-400 bg-blue-50"
                      : "border-gray-200 bg-gray-100"
                  }`}
                >
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    onFocus={() => setIsComposerFocused(true)}
                    onBlur={() => setIsComposerFocused(false)}
                    placeholder="Ask me anything..."
                    className="w-full bg-transparent border-none outline-none resize-none px-4 py-3 justify-center items-center text-sm md:text-md text-gray-900 placeholder-gray-500 min-h-[35px] max-h-22"
                    rows="1"
                  />
                </div>
              </div>

              <button
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim() || isTyping || isSending}
                className={`p-3 rounded-full transition-colors ${
                  inputValue.trim() && !isTyping && !isSending
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                <SendComposer />
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Chat History (Desktop) */}
        {showHistorySidebar && (
          <div className="hidden lg:flex w-80 bg-white flex-col h-full border-l-4 border-gray-400 shadow-[-1px_0_4px_rgba(0,0,0,0.1)]">
            {/* Header history*/}
            <div className="border-b border-gray-200 px-4 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Chat History
                </h2>
                <button
                  onClick={() => setShowHistorySidebar(false)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* New Chat Button */}
            <div className="p-4 border-b border-gray-200">
              <button
                onClick={handleNewChat}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                )}
                <span>{loading ? "Creating..." : "New Chat"}</span>
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4  min-h-0  ">
              {loading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : chatHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No chat history yet</p>
                  <p className="text-xs mt-1">
                    Start a new conversation to see it here
                  </p>
                </div>
              ) : (
                <div className="space-y-2 group">
                  {chatHistory.map(renderChatHistoryItem)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile History Modal */}
        {showHistoryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
            <div className="fixed right-0 top-0 h-screen w-80 bg-white flex flex-col">
              {/* Header */}
              <div className="border-b border-gray-200 px-4 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Chat History
                  </h2>
                  <button
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    onClick={() => setShowHistoryModal(false)}
                  >
                    <svg
                      className="w-4 h-4 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* New Chat Button */}
              <div className="p-4 border-b border-gray-200">
                <button
                  onClick={handleNewChat}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  <span>{loading ? "Creating..." : "New Chat"}</span>
                </button>
              </div>

              {/* Chat History */}
              <div className="flex-1 overflow-y-auto p-4 min-h-0">
                {loading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                ) : chatHistory.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No chat history yet</p>
                    <p className="text-xs mt-1">
                      Start a new conversation to see it here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 group">
                    {chatHistory.map(renderChatHistoryItem)}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Confirm Delete Modal */}
        {showDeleteModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            role="dialog"
            aria-modal
            aria-labelledby="confirm-delete-title"
          >
            <div className="w-full max-w-sm rounded-xl bg-white p-4 shadow-lg">
              <h3
                id="confirm-delete-title"
                className="text-base font-semibold text-gray-900"
              >
                Delete chat?
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                This action cannot be undone.
              </p>
              <div className="mt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={cancelDeleteChat}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  aria-label="Cancel delete"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteChat}
                  className="rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                  aria-label="Confirm delete"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AiChat;
