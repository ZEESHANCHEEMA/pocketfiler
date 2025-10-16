import React from "react";
import "./chatbox.css";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import UploadDocument from "../Modals/UploadDocuments/UploadDocument";
import {
  Call,
  ChatCall,
  chatSendMsg,
  getChatHistory,
  getContributors,
} from "../../services/redux/middleware/Project/project";
import { ErrorToast } from "../toast/Toast";
import { socket } from "../../services/socket";
import MsgNotifySound from "../../assets/audio/message-notification-190034.mp3";
import {
  formatMessageDate,
  formatMessageTime,
} from "../../utils/helperFunction";

const Chatbox = ({ disputing }) => {
  const dispatch = useDispatch();
  const [userId, setUserId] = useState();
  const [msgs, setmsg] = useState("");
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const { projectid } = useParams();
  const [chatHistory, setChatHistory] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [groupedMessages, setGroupedMessages] = useState([]);

  const MyContributors = useSelector(
    (state) => state?.getcontributors?.myContributors?.data
  );

  let audio = new Audio(MsgNotifySound);
  const messagesEndRef = useRef(null);

  const generateRandomNumber = (length) => {
    const digits = "0123456789";
    let randomNumber = "";
    for (let i = 0; i < length; i++) {
      randomNumber += digits[Math.floor(Math.random() * digits.length)];
    }
    return randomNumber;
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13 && msgs.trim()) {
      e.preventDefault(); // Prevent default form submission behavior
      if (!loader) {
        SendMsg();
      }
    }
  };

  useEffect(() => {
    const userid = localStorage.getItem("_id");
    console.log("user id ", userid);
    setUserId(userid);
  }, [userId]);

  const getMessagesArray = async () => {
    try {
      const res = await dispatch(getChatHistory(projectid));
      if (res?.payload?.data) {
        setChatHistory(res?.payload?.data);
        groupMessagesByDate(res?.payload?.data);
        setLoader(false);
      }
    } catch (error) {
      console.log(error, "error getting from chat");
    }
  };

  useEffect(() => {
    getMessagesArray();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const GetMessengerHistory = async () => {
    audio.play();
    try {
      const res = await dispatch(getChatHistory(projectid));
      if (res?.payload?.data) {
        setChatHistory(res?.payload?.data);
        groupMessagesByDate(res?.payload?.data);

        setLoader(false);
      }
    } catch (error) {
      console.log(error, "error getting from chat");
    }
  };

  useEffect(() => {
    const userid = localStorage.getItem("_id");
    socket.on("connect", () => {
      // audio.play();
      console.log("socket is connecting");
      socket.emit("join", userid);
    });
    if (userid && projectid) {
      socket.on("newMessengerHistory", GetMessengerHistory);

      socket.on("disconnect", (reason) => {});
      return () => {
        if (userid && projectid) {
          socket.off("newMessengerHistory", GetMessengerHistory);
        }
        socket.off("connect", (reason) => {});
        socket.off("disconnect", (reason) => {});
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectid]);

  async function handleJoinAudioRoom() {
    setLoader(true);
    const currentUserId = localStorage.getItem("_id");
    if (!currentUserId) {
      ErrorToast("Missing user id. Please re-login and try again.");
      setLoader(false);
      return;
    }
    if (MyContributors?.contributors?.length > 1) {
      try {
        const Contributors = MyContributors?.contributors;

        const userIds = Array.from(
          new Set(
            (Contributors || [])
              .map((item) => item?.user?._id)
              .filter((id) => id && String(id) !== String(currentUserId))
              .map((id) => String(id))
          )
        );

        if (!userIds || userIds.length === 0) {
          ErrorToast("Please select at least one participant to start a call");
          setLoader(false);
          return;
        }

        const callUrl = JSON.stringify({
          uniqueVideoRoomID: generateRandomNumber(7),
          projectId: String(projectid),
          username: String(currentUserId),
        });
        const data = {
          projectId: String(projectid),
          userId: String(currentUserId),
          status: "started",
          activity: "Audio-Call",
          callUrl,
        };

        dispatch(ChatCall(data)).then((res) => {
          if (res?.payload?.status === 200) {
            // Navigate immediately using the generated unique room id
            const roomId = JSON.parse(callUrl)?.uniqueVideoRoomID;
            const msgdta = callUrl; // pass the same callUrl to call screen
            const dataaudio = {
              projectId: projectid,
              userId: String(currentUserId),
              activityMsg: "Audio-Call",
              msgUrl: msgdta,
            };
            dispatch(chatSendMsg(dataaudio));
            navigate(`/ProjectActivities/AudioCall/${roomId}`, {
              state: {
                callData: dataaudio,
                projectId: projectid,
              },
            });
            setLoader(false);
          } else {
            ErrorToast(res?.payload?.message || "Failed to start audio call");
            setLoader(false);
          }
          setLoader(false);
        });
      } catch (error) {
        console.error("Error:", error);
        ErrorToast(error?.response?.data?.message || error?.message);
        setLoader(false);
      }
    } else {
      ErrorToast("Please add contributors before starting a audio/video call");
      setLoader(false);
    }
  }

  async function handleJoinVideoRoom() {
    setLoader(true);
    const currentUserId = localStorage.getItem("_id");
    if (!currentUserId) {
      ErrorToast("Missing user id. Please re-login and try again.");
      setLoader(false);
      return;
    }
    if (MyContributors?.contributors?.length > 1) {
      try {
        const Contributors = MyContributors?.contributors;

        const userIds = Array.from(
          new Set(
            (Contributors || [])
              .map((item) => item?.user?._id)
              .filter((id) => id && String(id) !== String(currentUserId))
              .map((id) => String(id))
          )
        );

        if (!userIds || userIds.length === 0) {
          ErrorToast("Please select at least one participant to start a call");
          setLoader(false);
          return;
        }

        const callUrl = JSON.stringify({
          uniqueVideoRoomID: generateRandomNumber(7),
          projectId: String(projectid),
          username: String(currentUserId),
        });
        const data = {
          projectId: String(projectid),
          userId: String(currentUserId),
          status: "started",
          activity: "Video-Call",
          callUrl,
        };
        dispatch(ChatCall(data)).then((res) => {
          if (res?.payload?.status === 200) {
            // Navigate immediately using the generated unique room id
            const roomId = JSON.parse(callUrl)?.uniqueVideoRoomID;
            const msgdta = callUrl; // pass the same callUrl to call screen
            const datavideo = {
              projectId: projectid,
              userId: String(currentUserId),
              activityMsg: "Video-Call",
              msgUrl: msgdta,
            };
            dispatch(chatSendMsg(datavideo));
            navigate(`/ProjectActivities/VideoCall/${roomId}`, {
              state: {
                callData: datavideo,
                projectId: projectid,
              },
            });
            setLoader(false);
          } else {
            ErrorToast(res?.payload?.message || "Failed to start video call");
            setLoader(false);
          }
        });
      } catch (error) {
        console.error("Error:", error);
        ErrorToast(error?.response?.data?.message || error?.message);
        setLoader(false);
      }
    } else {
      ErrorToast("Please add contributors before starting a audio/video call");
      setLoader(false);
    }
  }

  async function SendMsg() {
    setLoader(true);
    try {
      const tempData = {
        userId: userId,
        msg: msgs,
        projectId: projectid,
      };
      const tempArr = [...chatHistory];
      tempArr.push(tempData);
      setChatHistory(tempArr);
      setmsg("");
      const data = {
        projectId: projectid,
        userId: userId,
        msg: msgs,
      };
      dispatch(chatSendMsg(data)).then((res) => {
        if (res?.payload?.status === 200) {
          setLoader(false);
          setmsg("");
          getMessagesArray();
          dispatch(getChatHistory(projectid));
        } else {
          setLoader(false);
          ErrorToast(res?.payload?.message);
        }
      });
    } catch (error) {
      console.error("Error:", error);
      setLoader(false);
    }
  }

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom("auto");
  }, [chatHistory]);

  const ProjectData = useSelector(
    (state) => state?.getviewproject?.viewProject?.data
  );

  const handleClickCall = (item) => {
    const url = item?.msgUrl;
    const channel_name = JSON.parse(url)?.channel_name;
    const timeDiff =
      (new Date().getTime() - new Date(item?.createdAt).getTime()) / 1000;
    const diffHours = Math.floor(timeDiff / 3600);
    if (diffHours > 1) {
      ErrorToast(
        "This call link has expired. You can start a new call instead."
      );
      return;
    }
    const datavideo = {
      projectId: projectid,
      userId: userId,
      msgUrl: url,
    };
    if (item?.activityMsg === "Audio-Call") {
      navigate(`/ProjectActivities/AudioCall/${channel_name}`, {
        state: {
          callData: datavideo,
          projectId: projectid,
        },
      });
    } else {
      navigate(`/ProjectActivities/VideoCall/${channel_name}`, {
        state: {
          callData: datavideo,
          projectId: projectid,
        },
      });
    }
    return;
  };

  useEffect(() => {
    fetchData();
  }, [projectid]);
  const fetchData = async () => {
    try {
      const data = {
        projectId: projectid,
        page: 1,
      };
      console.log(data, "iiiii");
      dispatch(getContributors(data));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const groupMessagesByDate = (messages) => {
    const grouped = [];
    let lastDate = null;

    messages.forEach((message) => {
      const messageDate = formatMessageDate(message?.createdAt);
      console.log(messageDate, "messageDatemessageDatemessageDate");
      if (messageDate !== lastDate) {
        lastDate = messageDate;
        grouped.push({ date: messageDate, messages: [message] });
      } else {
        grouped[grouped.length - 1].messages.push(message);
      }
    });
    console.log(grouped, "groupedgroupedgrouped");

    setGroupedMessages(grouped);
  };

  return (
    <div className="chatBox__main ">
      <div className="chatBox__main-header">
        <div className="chatBox__main-header_left">
          <div className="chatBox__main-header_left-txt">
            <h2>{ProjectData?.title}</h2>
            <img
              src="/Images/Projects/recording-01.svg"
              alt="recording"
              className="record-img"
            />
          </div>
        </div>
        <div className="chatBox__main-header_right">
          {disputing ? (
            <button
              className="ProjectActivities__top-box_header-btn2"
              onClick={() => setModalShow(true)}
            >
              Upload documents
            </button>
          ) : (
            <div className="chatBox__main-header_right">
              <img
                onClick={() => (loader ? () => {} : handleJoinAudioRoom())}
                src="/Images/Projects/call.svg"
                alt="/"
                className="call-img"
              />
              <img
                src="/Images/Projects/vediocall.svg"
                alt="/"
                className="call-img"
                onClick={() => (loader ? () => {} : handleJoinVideoRoom())}
              />
            </div>
          )}
        </div>
      </div>
      <div className="chatBox__border"></div>

      <div className="msgs-container">
        {groupedMessages &&
          groupedMessages.map((group, index) => (
            <div key={index}>
              <div className="date-heading">{group.date}</div>
              {group.messages &&
                group.messages.map((item, index) => (
                  <>
                    {item?.msg !== null && (
                      <div
                        className={
                          item?.userId === userId
                            ? "chatBox__main-sms1"
                            : "chatBox__main-sms"
                        }
                      >
                        <div
                          className={
                            item?.userId === userId
                              ? "chatBox__main-sms__box1"
                              : "chatBox__main-sms__box"
                          }
                        >
                          <div className="chatBox__main-sms__box-img">
                            {item?.userId !== userId && (
                              <img
                                src={
                                  item?.user?.profilePicture
                                    ? item?.user?.profilePicture
                                    : "/Images/default-profile.png"
                                }
                                alt="profile"
                                width={"28px"}
                                height={"28px"}
                                style={{
                                  borderRadius: "50%",
                                }}
                              />
                            )}
                            <div
                              className={
                                item?.userId === userId
                                  ? "chatBox__main-sms__box-text1"
                                  : "chatBox__main-sms__box-text"
                              }
                            >
                              <div className="userbox">
                                {item?.userId !== userId && (
                                  <p
                                    className={
                                      item?.userId === userId
                                        ? "chatBodate"
                                        : "chatBodate1"
                                    }
                                  >
                                    {item?.user?.fullname}
                                  </p>
                                )}
                                <p
                                  className={
                                    item?.userId === userId
                                      ? "chatBodauser"
                                      : "chatBodauser1"
                                  }
                                >
                                  {item?.msg}
                                </p>
                                <p
                                  className={
                                    item?.userId === userId
                                      ? "chate1"
                                      : "chate2"
                                  }
                                >
                                  {formatMessageTime(item?.createdAt)}
                                </p>
                              </div>
                            </div>
                            {item?.userId === userId && (
                              <img
                                src={item?.user?.profilePicture}
                                alt="profile"
                                width={"28px"}
                                height={"28px"}
                                style={{
                                  borderRadius: "50%",
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    {item?.activityMsg !== null && (
                      <div>
                        <p
                          className="text-call"
                          onClick={() => handleClickCall(item)}
                        >
                          <span className="text-call-name">
                            {" "}
                            {item?.user?.fullname}{" "}
                          </span>{" "}
                          <span className="text-call-name">
                            {" "}
                            {item?.activityMsg}{" "}
                          </span>{" "}
                          {/* at {formatTime(item?.createdAt)} */}
                        </p>
                      </div>
                    )}
                  </>
                ))}
            </div>
          ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chatBox__main-send">
        <textarea
          className="form-control"
          placeholder="Type here..."
          onChange={(e) => setmsg(e.target.value)}
          value={msgs}
          onKeyDown={handleKeyDown}
          style={{ paddingRight: 66, display: "block" }}
          name=""
          id=""
          rows="2"
        ></textarea>
        <button
          onClick={loader ? () => {} : () => SendMsg()}
          disabled={!msgs?.trim()}
        >
          {" "}
          <img src="/Images/Projects/send.svg" alt="/" />{" "}
        </button>
      </div>
      <UploadDocument show={modalShow} onHide={() => setModalShow(false)} />
    </div>
  );
};

export default Chatbox;
