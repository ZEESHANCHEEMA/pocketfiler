import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AiBackgroundSVG } from '../../assets/svgs';
import { useDispatch } from 'react-redux';
import { newChat } from '../../services/redux/middleware/Project/aiChat';

const AiAssistance = () => {
  const navigation = useNavigate();
  const dispatch = useDispatch();
 const handleStartChat = async () => {
    console.log("handleStartChat");
    try {
      const data = {
        title: "New Chat",
        model: "gpt-4o-mini",
      };
      const result = await dispatch(newChat(data));
      console.log("result", result);

      // ✅ FIX: use result.payload.status instead of result.status
      if (result?.payload?.status === 200) {
        navigation("/AiChat", { state: result?.payload?.data });
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50 min-h-screen p-4">
      <div className="bg-white w-full max-w-lg mx-auto p-8 rounded-xl shadow-lg text-center">
        <div className="flex justify-center mb-6">
          <AiBackgroundSVG />
        </div>
        
        <h1 className="text-3xl font-medium text-gray-900 mb-6 leading-tight">
          Welcome to PocketFiler AI 👋
        </h1>
        
        <p className="text-sm font-medium text-gray-500 mb-8 leading-relaxed max-w-md mx-auto">
          PocketFiler AI Assistance can help you work on a project, write contracts, and more.
        </p>
        
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
          onClick={handleStartChat}
        >
          Start Chat
        </button>
      </div>
    </div>
  );
};

export default AiAssistance;
