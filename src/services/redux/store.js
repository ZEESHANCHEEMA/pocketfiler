import { configureStore, combineReducers } from "@reduxjs/toolkit";
import profile from "./reducer/profile";
import nftData from "./reducer/getNft";
import nftTable from "./reducer/getNftTable";
import getUserInfo from "./reducer/getUserInfo";
import referal from "./reducer/getReferal";
import history from "./reducer/getUserHistory";
import getProfileImage from "./reducer/getProfileImage";
import graph from "./reducer/getBarChart";
import getListNft from "./reducer/getListNft";
import addcontract from "./reducer/addcontract";
import addcontracteditor from "./reducer/addcontracteditor";
import addsign from "./reducer/addsign";
import getContract from "./reducer/getContract";
import getAllContract from "./reducer/getAllContract";
import getUserAssociates from "./reducer/getUserAssociates";
import getAllClient from "./reducer/getAllClient";
import getAcceptClient from "./reducer/getAcceptClient";
import getviewcontract from "./reducer/getviewcontract";
import getAllProjects from "./reducer/getAllProjects";
import getviewproject from "./reducer/getviewproject";
import addprojectdocument from "./reducer/addprojectdocument";
import getAllProjectActivity from "./reducer/getAllProjectActivity";
import getfourProject from "./reducer/getfourProject";
import getChathistory from "./reducer/getChathistory";
import getcontributors from "./reducer/getcontributors";
import getAllProjectdispute from "./reducer/getAllProjectdispute";
import getChatHistoryDispute from "./reducer/getChatHistoryDispute";
import getwithdrawdispute from "./reducer/getwithdrawdispute";
import getDisputeData from "./reducer/getDisputeData";
import getTotalcount from "./reducer/getTotalcount";
import getSubscription from "./reducer/getSubscription";
import getNotification from "./reducer/getNotification";
import getLatestProjCon from "./reducer/getLatestProjCon";
import authReducer from "./reducer/authSlice";
import contractTemplates from "./reducer/contractTemplates";
import aiChat from "./reducer/aiChat";
import lockers from "./reducer/lockers";
import lockerPeople from "./reducer/lockerPeople";

// Combine all reducers
const appReducer = combineReducers({
  profile,
  nftData,
  nftTable,
  profileInfo: getUserInfo,
  referal,
  history,
  profileImage: getProfileImage,
  graph,
  listNft: getListNft,
  addcontract,
  addcontracteditor,
  addsign,
  getContract,
  getAllContract,
  getUserAssociates,
  getAllClient,
  getAcceptClient,
  getviewcontract,
  getAllProjects,
  getviewproject,
  addprojectdocument,
  getAllProjectActivity,
  getfourProject,
  getChathistory,
  getcontributors,
  getAllProjectdispute,
  getChatHistoryDispute,
  getwithdrawdispute,
  getDisputeData,
  getTotalcount,
  getSubscription,
  getNotification,
  getLatestProjCon,
  auth: authReducer, // Add the new auth reducer
  contractTemplates, // Add the contract templates reducer
  aiChat, // Add the AI chat reducer
  lockers,
  lockerPeople,
});

// Reset state when RESET_STORE is dispatched
const rootReducer = (state, action) => {
  if (action.type === "RESET_STORE") {
    // Reset the entire Redux state by re-initializing reducers
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

// Configure store with rootReducer
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});
