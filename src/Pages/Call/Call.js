import {
  LocalUser,
  RemoteUser,
  useIsConnected,
  useJoin,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteUsers,
} from "agora-rtc-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaPhoneSlash,
  FaMicrophone,
  FaMicrophoneSlash,
  FaUsers,
} from "react-icons/fa";
import "./calls.css"; // Import styles
import { useDispatch, useSelector } from "react-redux";
import {
  getProfile,
  getProfileTemp,
} from "../../services/redux/middleware/signin";

const Call = () => {
  const location = useLocation();

  const { callData, projectId } = location.state || {}; // Get data safely
  const userData = useSelector((state) => state?.profile?.profile?.data);

  const agoraData =
    typeof callData?.msgUrl === "string"
      ? JSON.parse(callData?.msgUrl)
      : callData?.msgUrl;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isConnected = useIsConnected();

  const appId = "a12a56624a2e4b0b8d522e6da5a4b5a3";
  const channel =
    agoraData?.channel_name || agoraData?.uniqueVideoRoomID || undefined;
  const token = agoraData?.channel_token || undefined;
  const [userNames, setUserNames] = useState({});
  const [state, setState] = useState({
    micOn: true,
    showParticipants: false,
  });

  useJoin({ appid: appId, channel, token, uid: Number(callData?.userId) });
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(state.micOn);
  usePublish(localMicrophoneTrack ? [localMicrophoneTrack] : []);
  const remoteUsers = useRemoteUsers();

  useEffect(() => {
    if (localMicrophoneTrack) {
      localMicrophoneTrack.setEnabled(state.micOn);
    }
  }, [state.micOn]);

  const endCall = () => {
    if (localMicrophoneTrack) {
      localMicrophoneTrack.stop();
      localMicrophoneTrack.close();
    }
    navigate(-1);
  };
  useEffect(() => {
    remoteUsers.forEach(async (user) => {
      if (!userNames[user.uid]) {
        const name = await dispatch(getProfileTemp(user?.uid)); // Fetch user name
        setUserNames((prev) => ({
          ...prev,
          [user.uid]: name?.payload?.data || `User ${user?.uid}`,
        }));
      }
    });
  }, [remoteUsers]);
  useEffect(() => {
    const id = localStorage.getItem("_id");

    dispatch(getProfile(id));
  }, []);
  return (
    <div className="meet-container">
      <div className="meeting-header">
        <h3>Audio Meeting</h3>
        <div className="meeting-info">
          <span>Meeting ID: {channel}</span>
          <span>Participants: {remoteUsers.length + 1}</span>
        </div>
      </div>

      {isConnected ? (
        <div className="audio-container">
          <div
            className={
              remoteUsers.length == 0 ? "user-info user-info1" : "user-info"
            }
          >
            <img
              src={userData?.profilePicture ?? "/Images/default-profile.png"}
              className="profile-photo"
            />

            <LocalUser micOn={state.micOn} />
            <span className="user-name">You</span>
          </div>

          {remoteUsers.map((user) => (
            <div className="user-info" key={user.uid}>
              <img
                src={
                  userNames[user.uid]?.profilePicture ||
                  "/Images/default-profile.png"
                }
                alt={userNames[user.uid]?.fullname}
                className="profile-photo"
              />
              <RemoteUser user={user} />
              <span className="user-name">
                {userNames[user.uid]?.fullname || `User ${user.uid}`}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="connecting-container">
          <p className="connecting-text">Connecting to the channel...</p>
          <div className="loader"></div>
        </div>
      )}

      {isConnected && (
        <div className="controls">
          <button
            className={`control-btn ${state.micOn ? "on" : "off"}`}
            onClick={() =>
              setState((prev) => ({ ...prev, micOn: !prev.micOn }))
            }
          >
            {state.micOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
            {state.micOn ? "Mute" : "Unmute"}
          </button>

          <button
            className="control-btn"
            onClick={() =>
              setState((prev) => ({
                ...prev,
                showParticipants: !prev.showParticipants,
              }))
            }
          >
            <FaUsers />
            Participants
          </button>

          <button className="control-btn end" onClick={endCall}>
            <FaPhoneSlash />
            Leave
          </button>
        </div>
      )}
      {state.showParticipants && (
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

export default Call;
