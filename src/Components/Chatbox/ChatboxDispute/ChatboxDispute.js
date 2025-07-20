import React, { useRef } from "react";
import "./ChatboxDispute.css";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getDisputeMessages,
  MessageSandDispute,
} from "../../../services/redux/middleware/Dispute/dispute";
import { socket } from "../../../services/socket";
import UploadFileComp from "../../Modals/UploadFileComp/UploadFileComp";
import FilePreview from "./FilePreview";
const ChatboxDispute = ({ ProjectData, disputeData }) => {
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();
  const [userId, setUserId] = useState();
  const [msgs, setmsg] = useState("");
  const [messages, setMessages] = useState([]);
  const { projectid } = useParams();
  const [modalShow, setModalShow] = useState(false);
  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  useEffect(() => {
    const userid = localStorage.getItem("_id");
    setUserId(userid);
  }, [userId]);

  useEffect(() => {
    listMessages();
  }, []);

  useEffect(() => {
    const userid = localStorage.getItem("_id");
    socket.on("connect", () => {
      console.log("socket is connecting");
      socket.emit("join", disputeData?.id);
    });
    socket.on("join", (data) => {
      console.log("joined successfully", data);
    });
    socket.on("joinError", (error) => {
      console.log("join error", error);
    });
    if (disputeData?.id && projectid) {
      socket.on("listUserMessages", listMessages);
      socket.on("disconnect", (reason) => {});
      return () => {
        if (disputeData?.id && projectid) {
          socket.off("newMessengerHistory", listMessages);
        }
        socket.off("connect");
        socket.off("disconnect", (reason) => {});
        socket.off("joined", (data) => {});
        socket.off("joinError", (error) => {});
      };
    }
  }, []);

  const handleSendMessage = async () => {
    if (msgs?.trim()) {
      const apiData = {
        userId: disputeData?.userId,
        disputeId: disputeData?.id,
        msg: msgs,
      };
      const dummyMessage = {
        userId: disputeData?.userId,
        adminId: 1,
        disputeId: disputeData?.id,
        msg: msgs,
        msgby: "user",
        createdAt: new Date(),
      };
      setmsg("");
      if (messages.length > 4) {
        setMessages([dummyMessage, ...messages]);
      } else {
        setMessages([...messages, dummyMessage]);
      }
      await dispatch(MessageSandDispute(apiData));

      listMessages();
    } else {
      alert("Please enter a message");
    }
  };
  const listMessages = async (res) => {
    const apiData = {
      id: disputeData?.id,
    };
    const apiHit = await dispatch(getDisputeMessages(apiData));
    const DataForSet = apiHit?.payload?.data;
    setMessages(DataForSet);
  };

  useEffect(() => {
    listMessages();
  }, []);
  const formatTime = (createdAt) => {
    if (!createdAt) return "";
    const date = new Date(createdAt);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    const timeString = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    if (diffDays === 0 && date.getDate() === now.getDate()) {
      return timeString;
    }
    if (diffDays === 1) {
      return `Yesterday, ${timeString}`;
    }
    if (diffDays < 7) {
      return `${date.toLocaleDateString([], {
        weekday: "long",
      })}, ${timeString}`;
    }
    return `${date.toLocaleDateString([], {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })}, ${timeString}`;
  };

  const uploadImage = async (image) => {
    if (image?.trim()?.length > 0) {
      const apiData = {
        userId: disputeData?.userId,
        disputeId: disputeData?.id,
        msgUrl: image,
        msgtype: "image",
      };
      const res = await dispatch(MessageSandDispute(apiData));
      listMessages();
    } else {
      alert("Please enter a message");
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom("auto");
  }, [messages]);
  return (
    <div className="chatBox__main ">
      <div className="chatBox__main-header">
        <div className="chatBox__main-header_left">
          <div className="chatBox__main-header_left-img">
            <img src="/Images/Profile/profile.png" alt="/" />
          </div>
          <div className="chatBox__main-header_left-txt">
            <h2>PocketFiler Agent</h2>
            <img
              src="/Images/Projects/recording-01.svg"
              alt="recording"
              className="record-img"
            />
            <p className="every-txt">{ProjectData?.title} request of dispute</p>
          </div>
        </div>
        {disputeData?.status !== "closed" && (
          <div className="chatBox__main-header_right">
            <button
              className="ProjectActivities__top-box_header-btn2"
              onClick={() => setModalShow(true)}
            >
              Upload documents
            </button>
          </div>
        )}
      </div>
      <div className="chatBox__border"></div>

      <div className="msgs-container">
        <div className={"chatBox__main-sms1"}>
          <div className={"chatBox__main-sms__box1"}>
            <div className="chatBox__main-sms__box-img">
              <div className={"chatBox__main-sms__box-text1"}>
                {disputeData?.msg && <p>{disputeData?.msg}</p>}
              </div>
            </div>
            <p className={"chatBox__main-sms__box-date1"}>
              {formatTime(disputeData?.createdAt)}
            </p>
          </div>
        </div>
        {messages &&
          messages.map((item, index) => (
            <>
              <div
                className={
                  item?.msgby == "user"
                    ? "chatBox__main-sms1"
                    : "chatBox__main-sms"
                }
              >
                <div
                  className={
                    item?.msgby == "user"
                      ? "chatBox__main-sms__box1"
                      : "chatBox__main-sms__box"
                  }
                >
                  <div className="chatBox__main-sms__box-img">
                    <div
                      className={
                        item?.msgby == "user"
                          ? "chatBox__main-sms__box-text1"
                          : "chatBox__main-sms__box-text"
                      }
                      style={{
                        background: item?.msgUrl && "white",
                        borderColor: item?.msgUrl && "white",
                      }}
                    >
                      {item?.msgUrl && <FilePreview fileUrl={item?.msgUrl} />}

                      {item?.msg && <p>{item?.msg}</p>}
                    </div>
                    {item?.userId == userId && item?.user?.profilePicture && (
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
                  <p
                    className={
                      item?.msgby == "user"
                        ? "chatBox__main-sms__box-date1"
                        : "chatBox__main-sms__box-date"
                    }
                  >
                    {formatTime(item?.createdAt)}
                  </p>
                </div>
              </div>
            </>
          ))}
        <div ref={messagesEndRef} />
      </div>

      {disputeData?.status === "closed" ? (
        <div className="chatBox__main-send" style={{ textAlign: "center" }}>
          <p>Dispute is closed. You cannot send messages.</p>
        </div>
      ) : (
        <div className="chatBox__main-send">
          <textarea
            class="form-control"
            placeholder="Type here..."
            onChange={(e) => setmsg(e.target.value)}
            value={msgs}
            onKeyDown={handleKeyDown}
            style={{ paddingRight: 66 }}
            name=""
            id=""
            rows="2"
          ></textarea>
          <button onClick={handleSendMessage} disabled={!msgs?.trim()}>
            {" "}
            <img src="/Images/Projects/send.svg" alt="/" />{" "}
          </button>
        </div>
      )}
      <UploadFileComp
        onUploadSuccess={(res) => {
          uploadImage(res);
        }}
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </div>
  );
};

export default ChatboxDispute;
