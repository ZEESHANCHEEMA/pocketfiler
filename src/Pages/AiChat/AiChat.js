import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useRoutes } from 'react-router-dom';
import {
  AiBackgroundSVG,
  CopyIcon,
  GrayChat,
  SendComposer,
  ThumbsDown,
  ThumbsUp
} from '../../assets/svgs';
import { aiMessage } from '../../services/redux/middleware/Project/aiChat';
import { useDispatch } from 'react-redux';

const AiChat = () => {
  const location = useLocation();
  const chatData = location.state;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messageReactions, setMessageReactions] = useState({});
  const [isComposerFocused, setIsComposerFocused] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedPrompts = [
    'Write a professional NDA contract from scratch.',
    'Summarize lengthy legal documents in seconds.',
    'Compare versions of documents to highlight changes.',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const handleSuggestionClick = (prompt) => {
    setInputValue('');                 // clear input
    handleSendMessage(prompt);         // send directly
  };
  
  const handleCopyMessage = (text) => {
    navigator.clipboard.writeText(text);
    // You can add a toast notification here
    alert('Message copied to clipboard');
  };

  const handleReaction = (messageId, reaction) => {
    setMessageReactions(prev => ({
      ...prev,
      [messageId]: reaction,
    }));
  };

  const onSend = useCallback((text) => {
    if (!text.trim()) return;

    const newMessage = {
      _id: Math.round(Math.random() * 1000000),
      text: text,
      createdAt: new Date(),
      user: {
        _id: 1,
        name: 'User',
      },
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let aiResponse;

      if (text.toLowerCase().includes('what you can do')) {
        aiResponse = {
          _id: Math.round(Math.random() * 1000000),
          text: `Of course! As an AI language model, I am designed to assist with a variety of tasks. Here are some examples of what I can do:

• Answer questions: Just ask me anything you like!
• Generate text: I can write essays, articles, reports, stories, poems, and more.
• Conversational AI: I can engage in conversations with you in a natural and human-like way.

These are just a few examples of what I can do. Feel free to ask, and I'll do my best to assist you.`,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'AI Assistant',
            avatar: null,
          },
        };
      } else {
        aiResponse = {
          _id: Math.round(Math.random() * 1000000),
          text: 'I understand your request. How can I help you with that?',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'AI Assistant',
            avatar: null,
          },
        };
      }

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  }, []);
   {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(prompt)}
                    className="w-full bg-white rounded-xl p-4 text-left hover:bg-gray-50 transition-colors border border-gray-200"
                  >
                    <p className="text-sm text-gray-600 leading-relaxed">{prompt}</p>
                  </button>
                ))}
  // const handleSendMessage = () => {
  //   onSend(inputValue);
  // };
  const handleSendMessage = async (text) => {
    try {
      if (!text?.trim()) return;
  
      const userMessageObj = {
        _id: Math.round(Math.random() * 1000000),
        text: text, // use text directly
        createdAt: new Date(),
        user: {
          _id: 1,
          name: 'You',
        },
      };
      setMessages(prev => [...prev, userMessageObj]);
  
      setIsTyping(true);
  
      const result = await dispatch(
        aiMessage({ data:{message: text}, chatId: chatData?._id }),
      );
  
      setIsTyping(false);
  
      if (result?.payload?.status === 200) {
        const assistantText = result?.payload?.data?.assistantMessage?.content;
  
        if (assistantText) {
          const aiResponse = {
            _id: Math.round(Math.random() * 1000000),
            text: assistantText,
            createdAt: new Date(),
            user: {
              _id: 2,
              name: 'AI Assistant',
              avatar: null,
            },
          };
          setMessages(prev => [...prev, aiResponse]);
        }
      } else {
        console.log('AI response error', result?.payload?.message);
      }
    } catch (error) {
      console.log('error', error);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const renderMessage = (message) => {
    const isAI = message.user._id === 2;
    const reaction = messageReactions[message._id];

    return (
      <div key={message._id} className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-4`}>
        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${isAI
          ? 'bg-gray-100 text-gray-900'
          : 'bg-blue-600 text-white'
          }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>

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
                onClick={() => handleReaction(message._id, 'like')}
                className={`p-1 rounded transition-colors ${reaction === 'like' ? 'bg-blue-100' : 'hover:bg-gray-200'
                  }`}
                title="Like"
              >
                <ThumbsUp />
              </button>

              <button
                onClick={() => handleReaction(message._id, 'dislike')}
                className={`p-1 rounded transition-colors ${reaction === 'dislike' ? 'bg-red-100' : 'hover:bg-gray-200'
                  }`}
                title="Dislike"
              >
                <ThumbsDown />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const [showHistoryModal, setShowHistoryModal] = useState(false);

  return (
    <div className="flex-1 flex bg-gray-50 min-h-screen">
      {/* Central Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">PocketFiler AI Assistance</h1>
            <div className="flex items-center space-x-3">
              {/* Mobile History Button */}
              <button
                className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setShowHistoryModal(true)}
              >
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="mb-10">
                <GrayChat />
              </div>

              <div className="space-y-3 w-full max-w-md">
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(prompt)}
                    className="w-full bg-white rounded-xl p-4 text-left hover:bg-gray-50 transition-colors border border-gray-200"
                  >
                    <p className="text-sm text-gray-600 leading-relaxed">{prompt}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map(renderMessage)}
              {isTyping && (
                <div className="flex justify-start mb-4">
                  <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <div className={`relative rounded-2xl border transition-colors ${isComposerFocused
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-200 bg-gray-100'
                }`}>
            <textarea
  value={inputValue}
  onChange={(e) => setInputValue(e.target.value)}
  onKeyDown={handleKeyPress}   // ✅ works for Enter
  onFocus={() => setIsComposerFocused(true)}
  onBlur={() => setIsComposerFocused(false)}
  placeholder="Ask me anything..."
  className="w-full bg-transparent border-none outline-none resize-none px-4 py-3 text-sm text-gray-900 placeholder-gray-500 min-h-[40px] max-h-32"
  rows="1"
/>


              </div>
            </div>

            <button
             onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim()}
              className={`p-3 rounded-full transition-colors ${inputValue.trim()
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-300 cursor-not-allowed'
                }`}
            >
              <SendComposer />
            </button>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Chat History (Desktop) */}
      <div className="hidden lg:flex w-80 bg-white border-l border-gray-200 flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Chat History</h2>
            <button className="p-1 hover:bg-gray-100 rounded transition-colors">
              <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
              </svg>
            </button>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-4 border-b border-gray-200">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>New Chat</span>
          </button>
        </div>

        {/* Project Selection */}
        <div className="p-4 border-b border-gray-200">
          <div className="bg-gray-100 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Project |</span>
              <span className="text-sm font-medium text-gray-900">Current Project</span>
            </div>
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
              <button className="p-1 hover:bg-gray-200 rounded">
                <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Previous Chats */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
              <h3 className="text-sm font-medium text-gray-900">Project Kickoff: UX/UI Design In...</h3>
            </div>
            <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
              <h3 className="text-sm font-medium text-gray-900">Project Brainstorming</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg">
            {/* Header */}
            <div className="border-b border-gray-200 px-4 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Chat History</h2>
                <button
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  onClick={() => setShowHistoryModal(false)}
                >
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* New Chat Button */}
            <div className="p-4 border-b border-gray-200">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>New Chat</span>
              </button>
            </div>

            {/* Project Selection */}
            <div className="p-4 border-b border-gray-200">
              <div className="bg-gray-100 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Project |</span>
                  <span className="text-sm font-medium text-gray-900">Current Project</span>
                </div>
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Previous Chats */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                  <h3 className="text-sm font-medium text-gray-900">Project Kickoff: UX/UI Design In...</h3>
                </div>
                <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                  <h3 className="text-sm font-medium text-gray-900">Project Brainstorming</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiChat;
