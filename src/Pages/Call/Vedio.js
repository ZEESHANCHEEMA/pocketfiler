// import {
//   LocalUser,
//   RemoteUser,
//   useIsConnected,
//   useJoin,
//   useLocalMicrophoneTrack,
//   useLocalCameraTrack,
//   usePublish,
//   useRemoteUsers,
// } from "agora-rtc-react";
// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   FaPhoneSlash,
//   FaMicrophone,
//   FaMicrophoneSlash,
//   FaVideoSlash,
//   FaVideo,
//   FaUsers,
// } from "react-icons/fa";
// import "./video.css"; // Import the stylesheet
// import { getProfileTemp } from "../../services/redux/middleware/signin";
// import { useDispatch } from "react-redux";

// const Vedio = () => {
//   const location = useLocation();
//   const { callData } = location.state || {}; // Get data safely
//   const agoraData =
//     typeof callData?.msgUrl === "string"
//       ? JSON.parse(callData?.msgUrl)
//       : callData?.msgUrl;
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const isConnected = useIsConnected();
//   const appId = "a12a56624a2e4b0b8d522e6da5a4b5a3";
//   const channel = agoraData?.channel_name;
//   const token = agoraData?.channel_token;
//   const [userNames, setUserNames] = useState({});

//   const [calling, setCalling] = useState(true);
//   const [micOn, setMic] = useState(true);
//   const [cameraOn, setCamera] = useState(true);
//   const [showParticipants, setShowParticipants] = useState(false);

//   useJoin(
//     {
//       appid: appId,
//       channel: channel,
//       token: token,
//       uid: Number(callData?.userId),
//     },
//     calling
//   );
//   const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
//   const { localCameraTrack } = useLocalCameraTrack(cameraOn);
//   usePublish([localMicrophoneTrack, localCameraTrack]);
//   const remoteUsers = useRemoteUsers();

//   const endCall = () => {
//     if (localMicrophoneTrack) {
//       localMicrophoneTrack.stop();
//       localMicrophoneTrack.close();
//     }
//     if (localCameraTrack) {
//       localCameraTrack.stop();
//       localCameraTrack.close();
//     }

//     setCalling(false);
//     navigate(-1);
//   };

//   useEffect(() => {
//     remoteUsers.forEach(async (user) => {
//       if (!userNames[user.uid]) {
//         const name = await dispatch(getProfileTemp(user.uid)); // Fetch user name
//         setUserNames((prev) => ({
//           ...prev,
//           [user.uid]: name?.payload?.data || `User ${user.uid}`,
//         }));
//       }
//     });
//   }, [remoteUsers]);

//   return (
//     <div className="meet-container">
//       {/* Meeting Header */}
//       <div className="meeting-header">
//         <h3>Video Call</h3>
//         <div className="meeting-info">
//           <span>Meeting ID: {channel}</span>
//           <span>Participants: {remoteUsers.length + 1}</span>
//         </div>
//       </div>

//       {/* Video Call Interface */}
//       {isConnected ? (
//         <div className="video-container">
//           {remoteUsers.length == 0 ? (
//             <div className="video-grid ferfer">
//               <div className="video-box">
//                 <LocalUser
//                   audioTrack={localMicrophoneTrack}
//                   cameraOn={cameraOn}
//                   micOn={micOn}
//                   videoTrack={localCameraTrack}
//                 />
//               </div>
//               {remoteUsers.map((user) => (
//                 <div className="video-box" key={user.uid}>
//                   <RemoteUser user={user} />
//                   <span className="user-id-overlay">User {user.uid}</span>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="video-grid ">
//               <div className="video-box">
//                 <LocalUser
//                   audioTrack={localMicrophoneTrack}
//                   cameraOn={cameraOn}
//                   micOn={micOn}
//                   videoTrack={localCameraTrack}
//                 />
//               </div>
//               {remoteUsers.map((user) => (
//                 <div className="video-box" key={user.uid}>
//                   <RemoteUser user={user} />
//                   <span className="user-id-overlay">
//                     {userNames[user.uid]?.fullname || `User ${user.uid}`}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       ) : (
//         <p className="connecting-text">Connecting to the call...</p>
//       )}

//       {/* Call Controls */}
//       {isConnected && (
//         <div className="controls">
//           <button
//             className={`control-btn ${micOn ? "on" : "off"}`}
//             onClick={() => setMic(!micOn)}
//           >
//             {micOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
//             <span>{micOn ? "Mute" : "Unmute"}</span>
//           </button>
//           <button
//             className={`control-btn ${cameraOn ? "on" : "off"}`}
//             onClick={() => setCamera(!cameraOn)}
//           >
//             {cameraOn ? <FaVideo /> : <FaVideoSlash />}
//             <span>{cameraOn ? "Stop Video" : "Start Video"}</span>
//           </button>
//           <button
//             className="control-btn"
//             onClick={() => setShowParticipants(!showParticipants)}
//           >
//             <FaUsers />
//             <span>Participants</span>
//           </button>
//           <button className="control-btn end" onClick={endCall}>
//             <FaPhoneSlash />
//             <span>Leave</span>
//           </button>
//         </div>
//       )}

//       {/* Participants Sidebar */}
//       {showParticipants && (
//         <div className="sidebar">
//           <h4>Participants ({remoteUsers.length + 1})</h4>
//           <div className="participant-list">
//             <div className="participant">You</div>
//             {remoteUsers.map((user) => (
//               <div className="participant" key={user.uid}>
//                 User {user.uid}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Vedio;

import React, { useEffect, useState } from "react";
import {
  LocalUser,
  RemoteUser,
  useIsConnected,
  useJoin,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  usePublish,
  useRemoteUsers,
} from "agora-rtc-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaPhoneSlash,
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideoSlash,
  FaVideo,
  FaUsers,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap styles
import "./video.css"; // Custom styles
import { getProfileTemp } from "../../services/redux/middleware/signin";

const Vedio = () => {
  const location = useLocation();
  const { callData } = location.state || {};
  const agoraData =
    typeof callData?.msgUrl === "string"
      ? JSON.parse(callData?.msgUrl)
      : callData?.msgUrl;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isConnected = useIsConnected();
  const appId = "a12a56624a2e4b0b8d522e6da5a4b5a3";
  const channel = agoraData?.channel_name;
  const token = agoraData?.channel_token;
  const [userNames, setUserNames] = useState({});
  const [calling, setCalling] = useState(true);
  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const userData = useSelector((state) => state?.profile?.profile?.data);

  useJoin(
    {
      appid: appId,
      channel: channel,
      token: token,
      uid: Number(callData?.userId),
    },
    calling
  );

  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);
  usePublish([localMicrophoneTrack, localCameraTrack]);
  const remoteUsers = useRemoteUsers();

  useEffect(() => {
    remoteUsers.forEach(async (user) => {
      if (!userNames[user.uid]) {
        const name = await dispatch(getProfileTemp(user.uid));
        setUserNames((prev) => ({
          ...prev,
          [user.uid]: name?.payload?.data || `User ${user.uid}`,
        }));
      }
    });
  }, [remoteUsers]);

  const endCall = () => {
    if (localMicrophoneTrack) {
      localMicrophoneTrack.stop();
      localMicrophoneTrack.close();
    }
    if (localCameraTrack) {
      localCameraTrack.stop();
      localCameraTrack.close();
    }
    setCalling(false);
    navigate(-1);
  };

  return (
    <div className="container-fluid meet-container">
      {isConnected ? (
        <div className="row video-container">
          {/* Local User */}
          <div className={`col-${remoteUsers?.length > 4 ? "4" : "6"} p-2`}>
            <div className="video-box">
              {cameraOn ? (
                <LocalUser
                  audioTrack={localMicrophoneTrack}
                  cameraOn={cameraOn}
                  micOn={micOn}
                  videoTrack={localCameraTrack}
                />
              ) : (
                <img
                  src={
                    userData?.profilePicture ?? "/Images/default-profile.png"
                  }
                  className="profile-photo-video"
                />
              )}
              <span className="user-id-overlay">You</span>
            </div>
          </div>

          {/* Remote Users */}
          {remoteUsers.map((user) => (
            <div
              key={user.uid}
              className={`col-${remoteUsers?.length > 4 ? "4" : "6"} p-2`}
            >
              <div className="video-box">
                {!user?._video_muted_ ? (
                  <RemoteUser
                    placeholder="/Images/default-profile.png"
                    user={user}
                  />
                ) : (
                  <img
                    src={
                      userNames[user.uid]?.profilePicture ??
                      "/Images/default-profile.png"
                    }
                    className="profile-photo-video"
                  />
                )}
                <span className="user-id-overlay">
                  {userNames[user.uid]?.fullname || `User ${user.uid}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p
          className="connecting-text"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          Connecting to the call...
        </p>
      )}

      {/* Call Controls */}
      {isConnected && (
        <div className="controls">
          <button
            className={`control-btn ${micOn ? "on" : "off"}`}
            onClick={() => setMic(!micOn)}
          >
            {micOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
            <span>{micOn ? "Mute" : "Unmute"}</span>
          </button>
          <button
            className={`control-btn ${cameraOn ? "on" : "off"}`}
            onClick={() => setCamera(!cameraOn)}
          >
            {cameraOn ? <FaVideo /> : <FaVideoSlash />}
            <span>{cameraOn ? "Stop Video" : "Start Video"}</span>
          </button>
          <button
            className="control-btn"
            onClick={() => setShowParticipants(!showParticipants)}
          >
            <FaUsers />
            <span>Participants</span>
          </button>
          <button className="control-btn end" onClick={endCall}>
            <FaPhoneSlash />
            <span>Leave</span>
          </button>
        </div>
      )}
      {/* Participants Sidebar */}
      {showParticipants && (
        <div className="sidebar">
          <h4>Participants ({remoteUsers.length + 1})</h4>
          <div className="participant-list">
            <div className="participant">You</div>
            {remoteUsers.map((user) => (
              <div className="participant" key={user.uid}>
                {userNames[user.uid]?.fullname || `User ${user.uid}`}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Vedio;
