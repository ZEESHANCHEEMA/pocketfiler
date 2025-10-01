import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { newChat } from "../../services/redux/middleware/Project/aiChat";
import Header from "../../Components/Header/Header";
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
    <>
      <Header headername={"PocketFiler AI Assistance"} />
      <div className="flex-1 flex items-center justify-center bg-gray-50 max-h-min p-4">
        <div className="bg-white w-full max-w-4xl mx-auto p-4 sm:p-6 md:p-8 py-8 sm:py-10 md:py-12 rounded-xl">
          <div className="flex flex-col items-center gap-6">
            <img
              src="/Images/ai/ai-pf-icon.svg"
              alt="PocketFiler AI Logo"
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24"
            />
          </div>
          <div className="flex flex-col items-center gap-3 sm:gap-4 py-6 sm:py-8 md:py-10">
            <h1
              className="font-medium text-center text-[#0A1126] leading-tight tracking-normal"
              style={{
                fontFamily: "Clash Grotesk",
                fontSize: "clamp(24px, 5vw, 40px)",
                maxWidth: "100%",
                width: "min(512px, 90vw)",
              }}
            >
              Welcome to PocketFiler AI 👋
            </h1>

            <p
              className="font-normal text-center text-[#858585] leading-relaxed tracking-normal"
              style={{
                fontFamily: "Poppins",
                fontSize: "clamp(16px, 4vw, 20px)",
                maxWidth: "100%",
                width: "min(452px, 85vw)",
              }}
            >
              PocketFiler AI Assistance can help you work on a project, write
              contracts, and more.
            </p>

            <button
              className="text-white font-semibold transition-colors duration-200 text-lg rounded-2xl"
              style={{
                width: "min(512px, 80vw)",
                height: "clamp(48px, 8vw, 68px)",
                borderRadius: "14.63px",
                padding: "clamp(12px, 3vw, 21px) clamp(16px, 4vw, 24px)",
                backgroundColor: "#166FBF",
                fontSize: "clamp(16px, 3vw, 18px)",
              }}
              onClick={handleStartChat}
            >
              Start Chat
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AiAssistance;
