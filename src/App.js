import "./App.css";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Test from "./Pages/Test";
import Login from "./Pages/Auth/Login/Login";
import ForgotPassword from "./Pages/Auth/ForgotPassword/ForgotPassword";
import NewPassword from "./Pages/Auth/NewPassword/NewPassword";
import SignUpVerification from "./Pages/Auth/SignupVerification/SignUpVerification";
import SignUp from "./Pages/Auth/SignUp/SignUp";
import Profile from "./Pages/Profile/Profile";
import ProjectsTable from "./Pages/Projects/ProjectsTable";
import ProjectActivities from "./Pages/Projects/ProjectActivities/ProjectActivities";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Subscription from "./Pages/Subscription/Subscription";
import HelpCenter from "./Pages/HelpCenter/HelpCenter";
import AllContract from "./Pages/AllContract/AllContract";
import Clients from "./Pages/Clients/Clients";
// import Disputing from "./Components/Disputing/Disputing";
import { ToastContainer } from "react-toastify";
import { LinkedInCallback } from "react-linkedin-login-oauth2";
import TestGoogledrive from "./Pages/TestGoogledrive";

import OrgnizationDetails from "./Pages/Auth/OrgnizationDetails/OrgnizationDetails";
import ClientReq from "./Pages/Clients/ClientReq/ClientReq";
import Call from "./Pages/Call/Call";
import Vedio from "./Pages/Call/Vedio";
import ProjectActivitiesChat from "./Pages/Projects/ProjectActivitieschat/ProjectActivitieschat";
import ProtectedRoute from "./utils/protectedRoute/ProtectedRoute";
import Sidebar from "./Components/Sidebar/Sidebar";
import ClientRequest from "./Pages/ClientRequest/ClientRequest";
import Disputing from "./Pages/HelpCenter/Disputing/Disputing";
import AllDisputes from "./Pages/Disputes/AllDisputes";
import Subscriptionsuccess from "./Pages/Subscription/Subscriptionsuccess/Subscriptionsuccess";
import DelProfile from "./Pages/Profile/DelProfile/DelProfile";
import TestingEditor from "./Pages/TestingEditior";
import ContractEditorPage from "./Pages/ContractEditor/ContractEditor";
import Templates from "./Pages/Templates/Templates";
import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";
import { useEffect } from "react";
import {
  listenForMessages,
  requestPermission,
} from "./utils/Firebase/firebase";
import Layout from "./Components/Layout/Layout";
import PrivacyPolicy from "./Pages/PrivacyPolicy/PrivacyPolicy";
import AiAssistance from "./Pages/AiAssistance/AiAssistance";
import AiChat from "./Pages/AiChat/AiChat";
import EncryptedLocker from "./Pages/EncryptedLocker/EncryptedLocker";
import LockerScreen from "./Pages/Locker/LockerScreen";

const client = AgoraRTC.createClient({ codec: "vp8", mode: "rtc" });
const DashboardLayout = () => (
  <>
    <Sidebar showSidebar={true} style={{ overflowX: "hidden" }}>
      <Outlet /> {/* Nested routes will render here */}
    </Sidebar>
  </>
);

function App() {
  useEffect(() => {
    requestPermission();
  }, []);

  return (
    <>
      <AgoraRTCProvider client={client}>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover

          // theme="light"
        />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Login />} />
              <Route exact path="/linkedin" element={<LinkedInCallback />} />

              <Route path="/Editor" element={<TestingEditor />} />

              <Route path="/test2" element={<TestGoogledrive />} />
              <Route path="/Test" element={<Test />} />
              <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
              <Route path="/Forgot-Password" element={<ForgotPassword />} />
              <Route path="/New-Password/:passcode" element={<NewPassword />} />
              <Route path="/DeleteAccount/:userid" element={<DelProfile />} />

              <Route
                path="/SignUp-Verify/:email"
                element={<SignUpVerification />}
              />
              <Route
                path="/OrgnizationDetails/:Orgemail"
                element={<OrgnizationDetails />}
              />
              <Route path="/SignUp" element={<SignUp />} />
              {/* <Route path="/HelpCenter/Disputing" element={<Disputing />} /> */}

              <Route path="/" element={<DashboardLayout />}>
                <Route
                  path="/Dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ProjectsTable"
                  element={
                    <ProtectedRoute>
                      <ProjectsTable />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ProjectActivities/:projectid"
                  element={
                    <ProtectedRoute>
                      <ProjectActivities />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ProjectActivities/chatBox/:projectid"
                  element={
                    <ProtectedRoute>
                      <ProjectActivitiesChat />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/Clients"
                  element={
                    <ProtectedRoute>
                      <Clients />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ClientReq"
                  element={
                    <ProtectedRoute>
                      <ClientReq />
                    </ProtectedRoute>
                  }
                />
                <Route path="/Disputes" element={<AllDisputes />} />
                <Route
                  path="/HelpCenter/Dispute/:projectid"
                  element={<Disputing />}
                />
                <Route
                  path="/Profile"
                  element={
                    <ProtectedRoute>
                      <Profile />{" "}
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ProjectContributor/:projectid"
                  element={<ClientRequest />}
                />
                <Route
                  path="/AllContract"
                  element={
                    <ProtectedRoute>
                      <AllContract />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/Subscription-Subscribed"
                  element={<Subscriptionsuccess />}
                />
                <Route path="/Subscription" element={<Subscription />} />
                <Route path="/HelpCenter" element={<HelpCenter />} />
                <Route
                  path="/ContractEditor"
                  element={
                    <ProtectedRoute>
                      <ContractEditorPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/Templates"
                  element={
                    <ProtectedRoute>
                      <Templates />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/EncryptedLocker"
                  element={
                    <ProtectedRoute>
                      <EncryptedLocker />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/Locker/:lockerName"
                  element={
                    <ProtectedRoute>
                      <LockerScreen />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/AiAssistance"
                  element={
                    <ProtectedRoute>
                      <AiAssistance />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/AiChat"
                  element={
                    <ProtectedRoute>
                      <AiChat />
                    </ProtectedRoute>
                  }
                />
              </Route>

              <Route
                path="/ProjectActivities/AudioCall/:roomID"
                element={
                  <ProtectedRoute>
                    <Call />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/ProjectActivities/VideoCall/:roomId"
                element={
                  <ProtectedRoute>
                    <Vedio />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </AgoraRTCProvider>
    </>
  );
}

export default App;
