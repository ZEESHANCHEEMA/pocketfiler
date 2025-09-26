import React, { useState, useEffect, useRef, useCallback } from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserNotifications,
  NotificationStatus,
  markAllRead,
} from "../../services/redux/middleware/notification";
import { socket } from "../../services/socket";
import notifysound from "../../assets/audio/notification_sound.mp3";
import { SuccessToast, ErrorToast } from "../toast/Toast";
import { Button, Modal, Spinner } from "react-bootstrap";
import { toSentenceCase } from "../../utils/helperFunction";
import moment from "moment";

export default function Header({ headername, showBack, onBack }) {
  const dispatch = useDispatch();
  const [notification, setNotification] = useState(false);
  const [userId, setUserId] = useState();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const notificationRef = useRef(null);
  const audioRef = useRef(new Audio(notifysound));

  const handleProfile = () => {
    navigate("/Profile");
  };
  useEffect(() => {
    const userid = localStorage.getItem("_id");
    setUserId(userid);
    dispatch(getUserNotifications(userid));
  }, [dispatch, userId]);

  const notificationdata = useSelector(
    (state) => state?.getNotification?.myNotifications?.data
  );

  const Unreadnotification =
    notificationdata &&
    notificationdata?.some((item) => item && item?.NotifyRead === false);

  const getAllNotifications = useCallback(() => {
    audioRef.current.play();
    const userid = localStorage.getItem("_id");
    dispatch(getUserNotifications(userid));
  }, [dispatch]);
  useEffect(() => {
    const userid = localStorage.getItem("_id");
    socket.on("connect", () => {
      socket.emit("join", userid);
    });
    if (userid) {
      socket.on("notification", getAllNotifications); // add client/associate
      socket.on("add by me", getAllNotifications);
      socket.on("Added As Associate", getAllNotifications);
      socket.on("add associate", getAllNotifications);
      socket.on("notificationForAssociate", getAllNotifications); // add client/associate
      socket.on("notification", getAllNotifications); //create contract
      socket.on("notification", getAllNotifications); // update contract
      socket.on("notify", getAllNotifications);
      socket.on("notify_share", getAllNotifications); //share contract
      socket.on("notification_project", getAllNotifications); //create project
      socket.on("notification project", getAllNotifications); //create project
      socket.on("notification_pupdate", getAllNotifications); //update project
      socket.on("notification pupdate", getAllNotifications); //update project
      socket.on("login_notify", getAllNotifications); //LOGIN
      socket.on("signup_notify", getAllNotifications); //Signup
      socket.on("updateProfileNotify", getAllNotifications); //Profile Update
      socket.on("notification_request", getAllNotifications); //Req Document
      socket.on("notification request", getAllNotifications); //Req Document
      socket.on("notificationForRequest", getAllNotifications); //Req Document
      socket.on("notificationForsubscription", getAllNotifications); //Req Document
      socket.on("dispute_notification", getAllNotifications); //Create dispute
      socket.on("dispute notification", getAllNotifications); //Create dispute

      socket.on("disconnect", (reason) => {});
      return () => {
        if (userid) {
          socket.off("notificationForAssociate", getAllNotifications); // add client/associate
          socket.off("notification", getAllNotifications);
          socket.off("notification", getAllNotifications);
          socket.off("notification", getAllNotifications);
          socket.off("add by me", getAllNotifications);
          socket.off("Added As Associate", getAllNotifications);
          socket.off("add associate", getAllNotifications);
          socket.off("notify", getAllNotifications);
          socket.off("notify_share", getAllNotifications);
          socket.off("notification_project", getAllNotifications);
          socket.off("notification project", getAllNotifications);
          socket.off("notification_pupdate", getAllNotifications);
          socket.off("notification pupdate", getAllNotifications);
          socket.off("login_notify", getAllNotifications);
          socket.off("signup_notify", getAllNotifications);
          socket.off("updateProfileNotify", getAllNotifications);
          socket.off("notification_request", getAllNotifications);
          socket.off("notification request", getAllNotifications);
          socket.off("notificationForRequest", getAllNotifications);
          socket.off("notificationForsubscription", getAllNotifications);
          socket.off("dispute_notification", getAllNotifications);
          socket.off("dispute notification", getAllNotifications); //Create dispute
        }
        socket.off("connect", (reason) => {});
        socket.off("disconnect", (reason) => {});
      };
    }
  }, [getAllNotifications]);

  async function readnotification(id, item) {
    if (item?.NotifyRead) {
      return;
    }

    try {
      const data = {
        notificationId: id,
      };
      dispatch(NotificationStatus(data)).then((res) => {
        if (res?.payload?.status === 200) {
          console.log("Notification Status Res", res?.payload?.data);
          SuccessToast("Read Success");
          dispatch(getUserNotifications(userId));
        } else {
          ErrorToast(res?.payload?.message);
        }
      });
    } catch (error) {
      console.error("Error:", error);
    }
  }
  async function ReadAll() {
    if (Unreadnotification) {
      setShowModal(true);
    }
  }

  const handleReadAll = async () => {
    setLoading(true);
    try {
      const data = { userId };
      dispatch(markAllRead(data)).then((res) => {
        setLoading(false);
        setShowModal(false);
        if (res?.payload?.status === 200) {
          dispatch(getUserNotifications(userId));
        } else {
          console.error(res?.payload?.message);
        }
      });
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotification(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const groupNotificationsByDate = (notifications) => {
    const grouped = {};
    notifications?.forEach((item) => {
      const date = moment(item.createdAt).format("YYYY-MM-DD");
      const today = moment().format("YYYY-MM-DD");
      const yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");

      let label = moment(item.createdAt).format("MMMM D, YYYY");
      if (date === today) label = "Today";
      else if (date === yesterday) label = "Yesterday";

      if (!grouped[label]) {
        grouped[label] = [];
      }
      grouped[label].push(item);
    });
    return grouped;
  };

  const notificationGroups = groupNotificationsByDate(notificationdata);

  const images = {
    addUser: "Images/notification/AddUser.png",
    notification: "Images/Dashboard/Contracts.svg",
    password: "Images/notification/password.png",
    profileUpdate: "Images/notification/profileUpdate.png",
    requestDoc: "Images/notification/RequestDoc.png",
    updateContract: "Images/Dashboard/Contracts.svg",
    updateProject: "Images/Dashboard/project-icon.svg",
    shareContract: "Images/Contract/share-06.svg",
  };

  const imageGet = (notificationType) => {
    switch (notificationType) {
      case "Added As Associate":
        return images.addUser;
      case "Add Associate":
        return images.addUser;
      case "Added as user":
        return images.addUser;
      case "Contract Updated":
        return images.updateContract;
      case "password":
        return images.password;
      case "Profile updated":
        return images.profileUpdate;
      case "updated project":
        return images.updateProject;
      case "Share Contract":
        return images.shareContract;
      case "Project_Creation":
        return images.updateProject;
      case "Request Documents":
        return images.requestDoc;
      case "added dispute":
        return images.requestDoc;
      default:
        return images.notification;
    }
  };

  return (
    <>
      <div className="header-main">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {showBack && (
            <button
              type="button"
              aria-label="Go back"
              className="back-btn"
              onClick={() => (onBack ? onBack() : navigate(-1))}
            >
              <img
                src="/Images/Clients/backarrow.svg"
                alt="back"
                style={{ height: 24, width: 24 }}
              />
            </button>
          )}
          <p className="header-heading">{headername}</p>
        </div>
        <div className="header-Rhs">
          {/* <img src="/Images/Dashboard/notification.svg" alt="notification" /> */}
          <div className="navbar__notification">
            <div className="navbar__notification__dropdown">
              {Unreadnotification ? (
                <img
                  src="/Images/Dashboard/notification copy.svg"
                  alt="notification"
                  className="notification-img-unread"
                  onClick={(e) => {
                    e.stopPropagation();
                    setNotification(!notification);
                  }}
                />
              ) : (
                <img
                  onClick={(e) => {
                    e.stopPropagation();
                    setNotification(!notification);
                  }}
                  src="/Images/Dashboard/notification.svg"
                  alt="notification"
                  className="notification-img"
                />
              )}
            </div>
          </div>
          {headername !== "Profile" && (
            <img
              src="/Images/Dashboard/profile.svg"
              alt="profile"
              className="prof-img"
              onClick={handleProfile}
            />
          )}
        </div>

        {notification && (
          <div className="notification-drop" ref={notificationRef}>
            <div className="notify-top">
              <p className="mark-read" onClick={ReadAll}>
                Mark all as read
              </p>
            </div>

            <div
              className="notify-cards"
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {notificationdata && notificationdata.length > 0 ? (
                Object.entries(notificationGroups).map(([dateLabel, items]) => (
                  <div key={dateLabel}>
                    <h2 className="navbar__notification__dropdown__title">
                      {dateLabel}
                    </h2>
                    {items.map((item, index) => (
                      <div
                        key={index}
                        className="notify-cancel notify-pt"
                        onClick={() => readnotification(item?.id, item)}
                      >
                        <div>
                          <img
                            style={{ height: 32, width: 32 }}
                            src={imageGet(item?.action)}
                            alt="notify-lock"
                          />
                        </div>
                        <div className="notify-bluedot-subtxt">
                          <div>
                            {toSentenceCase(
                              item?.action?.replace(/_/g, " ") || item?.action
                            )}
                            <p className="Cancel-des">{item?.msg}</p>
                          </div>
                          {item?.NotifyRead === false && (
                            <div className="blue-dot"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <div
                  className="notify-cards"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "60vh",
                  }}
                >
                  <p style={{ textAlign: "center" }}>
                    No notifications available
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          centered
          className="modal"
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>Confirm Action</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to mark all notifications as read?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleReadAll} disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Confirm"}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}
