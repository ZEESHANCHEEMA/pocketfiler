import { createSlice } from "@reduxjs/toolkit";
import {
  newChat,
  aiMessage,
  getChatHistory,
  getSingleChatHistory,
  deleteChat,
  updateChatTitle,
} from "../middleware/Project/aiChat";

const initialState = {
  loading: false,
  error: null,
  chatHistory: [],
  currentChat: null,
  messages: [],
  isTyping: false,
};

const aiChatSlice = createSlice({
  name: "aiChat",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setTyping: (state, action) => {
      state.isTyping = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    // New Chat
    builder.addCase(newChat.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(newChat.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.status === 200) {
        state.currentChat = action.payload.data;
      } else {
        state.error = action.payload.message;
      }
    });
    builder.addCase(newChat.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // AI Message
    builder.addCase(aiMessage.pending, (state) => {
      state.isTyping = true;
      state.error = null;
    });
    builder.addCase(aiMessage.fulfilled, (state, action) => {
      state.isTyping = false;
      if (action.payload.status === 200) {
        // Handle AI response
        console.log('AI response payload:', action.payload);
        if (action.payload.data?.assistantMessage?.content) {
          const aiMessage = {
            _id: Math.round(Math.random() * 1000000),
            text: action.payload.data.assistantMessage.content,
            createdAt: new Date().toISOString(),
            user: {
              _id: 2,
              name: "AI Assistant",
              avatar: null,
            },
          };
          console.log('Adding AI message to state:', aiMessage);
          state.messages.push(aiMessage);
        } else {
          console.log('No AI response content found in payload');
        }
      } else {
        // Handle error cases
        state.error = action.payload.message;
        
        // For timeout errors, show a more user-friendly message
        if (action.payload.status === 'TIMEOUT') {
          state.error = 'The AI is taking longer than expected to respond. Please try again in a moment.';
        } else if (action.payload.status === 'NETWORK_ERROR') {
          state.error = 'Network connection issue. Please check your internet connection and try again.';
        }
      }
    });
    builder.addCase(aiMessage.rejected, (state, action) => {
      state.isTyping = false;
      state.error = action.error.message;
    });

    // Get Chat History
    builder.addCase(getChatHistory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getChatHistory.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.status === 200) {
        state.chatHistory = action.payload.data || [];
      } else {
        state.error = action.payload.message;
      }
    });
    builder.addCase(getChatHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Get Single Chat History
    builder.addCase(getSingleChatHistory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getSingleChatHistory.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.status === 200) {
        const responseData = action.payload.data;
        if (responseData && responseData.messages) {
          // Format messages to match expected structure
          console.log('Raw messages from API:', responseData.messages);
          state.messages = responseData.messages.map((msg) => {
            const formattedMsg = {
              _id: msg._id || Math.round(Math.random() * 1000000),
              text: msg.content || msg.text || '',
              createdAt: msg.createdAt || new Date().toISOString(),
              user: {
                _id: msg.role === 'assistant' ? 2 : 1,
                name: msg.role === 'assistant' ? 'AI Assistant' : 'You',
                avatar: null,
              },
            };
            console.log('Formatted message:', formattedMsg);
            return formattedMsg;
          }) || [];
          console.log('Final formatted messages:', state.messages);
          // Also store the chat info if needed
          if (responseData.chat) {
            state.currentChat = responseData.chat;
          }
        } else {
          state.messages = [];
        }
      } else {
        state.error = action.payload.message;
        state.messages = [];
      }
    });
    builder.addCase(getSingleChatHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Delete Chat
    builder.addCase(deleteChat.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteChat.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.status === 200) {
        // Remove the deleted chat from history
        state.chatHistory = state.chatHistory.filter(
          (chat) => chat._id !== action.meta.arg
        );
      } else {
        state.error = action.payload.message;
      }
    });
    builder.addCase(deleteChat.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Update Chat Title
    builder.addCase(updateChatTitle.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateChatTitle.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.status === 200) {
        // Update the chat title in history
        const chatId = action.meta.arg.chatId;
        const newTitle = action.meta.arg.title;
        state.chatHistory = state.chatHistory.map((chat) =>
          chat._id === chatId ? { ...chat, title: newTitle } : chat
        );
      } else {
        state.error = action.payload.message;
      }
    });
    builder.addCase(updateChatTitle.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const { clearError, setTyping, clearMessages, addMessage } = aiChatSlice.actions;
export default aiChatSlice.reducer;
