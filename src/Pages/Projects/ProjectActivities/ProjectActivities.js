import React, { useState, useEffect } from "react";
import "./projectActivities.css";
import Dropdown from "react-bootstrap/Dropdown";
import UploadDocument from "../../../Components/Modals/UploadDocuments/UploadDocument";
import Header from "../../../Components/Header/Header";
import { useMediaQuery } from "react-responsive";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
  CompleteProject,
  viewproject,
} from "../../../services/redux/middleware/Project/project";
import { viewProjectActivities } from "../../../services/redux/middleware/Project/project";
import ReqDocument from "../../../Components/Modals/ReqDocument/ReqDocument";
import { useLocation } from "react-router-dom";
import UpdateProject from "../../../Components/Modals/UpdateProject/UpdateProject";
import CompleteProjectModal from "./CompleteProjectModal";
import { ErrorToast, SuccessToast } from "../../../Components/toast/Toast";
import { toSentenceCase } from "../../../utils/helperFunction";
import FilePreviewModal from "./FilePreviewModal";
// Payment UI removed per design update
import { getContributors } from "../../../services/redux/middleware/Project/project";
import ProjectPayment from "../../../Components/Modals/ProjectPayment/ProjectPayment";
import RequestPayment from "../../../Components/Modals/Organization/RequestPayment/RequestPayment";

const ProjectActivities = () => {
  const isMobile = useMediaQuery({
    query: "(max-width: 768px)",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modalShow, setModalShow] = useState(false);
  const [reqModalShow, setReqModalShow] = useState(false);
  const { projectid } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const dispute = queryParams.get("dispute");
  const [modalShowUpdate, setModalShowUpdate] = useState(false);
  const [showPreviewModal, setshowPreviewModal] = useState(false);
  const [selectedImage, setselectedImage] = useState("");
  const userId = localStorage.getItem("_id");
  const currentUserRole = localStorage.getItem("role");

  const [completeModal, setcompleteModal] = useState(false);
  const [paymentModalShow, setPaymentModalShow] = useState(false);
  const [requestPaymentShow, setRequestPaymentShow] = useState(false);
  const viewProjectState = useSelector((state) => state?.getviewproject);
  const ProjectData =
    viewProjectState?.viewProject?.data ??
    viewProjectState?.viewProject ??
    null;
  const projectOwnerRole =
    ProjectData?.creator?.role ||
    ProjectData?.owner?.role ||
    ProjectData?.user?.role ||
    undefined;
  const canComplete =
    ProjectData?.status === "inprogress" &&
    currentUserRole &&
    projectOwnerRole &&
    currentUserRole === projectOwnerRole;
  const canMakePayment =
    String(ProjectData?.userId) === String(userId) ||
    currentUserRole === "organization";
  // const isLoadingProject = Boolean(viewProjectState?.loading);
  // const projectError = viewProjectState?.error;
  const ConvertDate = (originalDateStr) => {
    if (!originalDateStr) return "-";
    const originalDate = new Date(originalDateStr);
    if (Number.isNaN(originalDate.getTime())) return "-";
    return originalDate.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  useEffect(() => {
    console.log("id is", projectid);
    dispatch(viewproject(projectid));
    console.log("viewing");
  }, [dispatch, projectid]);

  useEffect(() => {
    dispatch(viewProjectActivities(projectid));
    console.log("getting all activities");
  }, [dispatch, projectid]);

  // Load contributors for first 3 avatars
  useEffect(() => {
    if (!projectid) return;
    const payload = { projectId: projectid, page: 1 };
    dispatch(getContributors(payload));
  }, [dispatch, projectid]);

  // Call Stripe payments APIs on page view to aid debugging/visibility

  const UserProjectActivity = useSelector(
    (state) => state?.getAllProjectActivity?.allProjectActivity?.data ?? []
  );

  console.log("Project Activity user", UserProjectActivity);

  // Contributors (for avatars)
  const contributorsData = useSelector(
    (state) => state?.getcontributors?.myContributors?.data
  );
  const topThreeContributors =
    contributorsData?.contributors?.slice(0, 3) || [];

  // Determine if current user is a contributor on this project
  const isContributor = Boolean(
    contributorsData?.contributors?.some((c) => {
      const contributorId = c?.user?._id || c?._id || c?.userId;
      return String(contributorId) === String(userId);
    })
  );

  const formatTime = (createdAt) => {
    if (!createdAt) return "";
    const date = new Date(createdAt);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";

    // Convert hours to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be converted to 12

    // Padding minutes with zero if needed
    minutes = minutes < 10 ? "0" + minutes : minutes;

    return `${hours}:${minutes} ${ampm}`;
  };
  // Note: Stripe payments listing and intent detail calls are moved to their own flow.

  // Responsive styles for the Chat CTA
  const chatBtnStyle = {
    display: "flex",
    alignItems: "center",
    gap: isMobile ? 6 : 8,
    backgroundColor: "#0A2540",
    color: "#fff",
    border: "none",
    borderRadius: 9999,
    padding: isMobile ? "8px 12px" : "10px 16px",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(10,37,64,0.15)",
    transition: "transform .15s ease, box-shadow .15s ease",
  };
  const chatLabelStyle = {
    fontWeight: 500,
    fontSize: isMobile ? 14 : 16,
    lineHeight: 1,
  };
  const chatIconStyle = {
    width: isMobile ? 16 : 18,
    height: isMobile ? 16 : 18,
  };

  // Reusable action button style (Upload, etc.) for responsive design
  const actionBtnStyle = {
    display: "flex",
    alignItems: "center",
    gap: isMobile ? 6 : 8,
    backgroundColor: "#0A2540",
    color: "#fff",
    border: "none",
    borderRadius: 9999,
    padding: isMobile ? "10px 14px" : "12px 24px",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(10,37,64,0.15)",
  };
  const actionLabelStyle = {
    fontWeight: 500,
    fontSize: isMobile ? 14 : 16,
    lineHeight: 1,
  };

  function OnChatBox() {
    if (dispute === "true") {
      navigate(`/HelpCenter/Dispute/${projectid}`);
    } else {
      navigate(`/ProjectActivities/chatBox/${projectid}`);
    }
  }
  function OnProjectContributor() {
    navigate(`/ProjectContributor/${projectid}`);
  }

  const handleClick = (url) => {
    if (url) {
      setselectedImage(url);
      setshowPreviewModal(true);
      // window.open(url, "_blank");
    }
  };

  // const handleClickCall = (url) => {
  //   if (url) {
  //     const fullUrl = url.startsWith("http") ? url : `http://${url}`;
  //     window.open(fullUrl, "_blank");
  //   }
  // };

  const getIconByExtension = (url) => {
    if (typeof url !== "string") return "/Images/File/file.png";
    const lower = url.toLowerCase();
    if (lower.endsWith(".pdf")) return "/Images/File/PDF.svg";
    if (lower.endsWith(".doc") || lower.endsWith(".docx"))
      return "/Images/File/DOC.svg";
    if (lower.endsWith(".jpg") || lower.endsWith(".jpeg"))
      return "/Images/File/JPG.svg";
    if (lower.endsWith(".png")) return "/Images/File/pngIcon.png";
    if (lower.endsWith(".txt")) return "/Images/File/TXT.svg";
    return "/Images/File/file.png";
  };

  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };
  const handleDropdownItemClick = (e) => {
    e.stopPropagation();
  };

  const completeProjectApi = () => {
    const apiData = {
      userId: userId,
      projectId: projectid,
      status: "completed",
    };
    try {
      dispatch(CompleteProject(apiData)).then((res) => {
        if (res?.payload?.status === 200) {
          SuccessToast("Project Updated Successfully");
          CompleteProjectModal(false);
          dispatch(viewproject(projectid));
        } else {
          ErrorToast(res?.payload?.message || "An error occurred");
          CompleteProjectModal(false);
        }
        CompleteProjectModal(false);
      });
    } catch (error) {
      CompleteProjectModal(false);
    }
  };
  return (
    <>
      <Header headername={"Projects"} showBack onBack={() => navigate(-1)} />
      <>
        <div className="ProjectActivities__top-box ">
          <div className="ProjectActivities__top-box_header">
            <div className="ProjectActivities__top-box_header-txt">
              <h4>{ProjectData?.title}</h4>
              <div
                style={{
                  background:
                    ProjectData?.status === "inprogress"
                      ? "#FBEDED"
                      : ProjectData?.status === "completed"
                      ? "#F1F6FB"
                      : "none",
                }}
                className="bg__text"
              >
                <p
                  style={{
                    color:
                      ProjectData?.status === "inprogress"
                        ? "#D32121"
                        : ProjectData?.status === "completed"
                        ? "#166FBF"
                        : "none",
                  }}
                >
                  {toSentenceCase(ProjectData?.status)}
                </p>
              </div>
            </div>
            <div className="ProjectActivities__top-box_header-btn">
              {isMobile ? (
                <button
                  onClick={() => setModalShow(true)}
                  style={actionBtnStyle}
                  aria-label="Upload documents"
                >
                  <span style={actionLabelStyle}>Upload documents</span>
                </button>
              ) : (
                <button
                  className="ProjectActivities__top-box_header-btn1"
                  onClick={() => setModalShow(true)}
                  style={{
                    backgroundColor: "#0A2540",
                    color: "#fff",
                    border: "none",
                    borderRadius: 9999,
                    padding: "12px 24px",
                    cursor: "pointer",
                  }}
                >
                  Upload documents
                </button>
              )}

              <ReqDocument
                show={reqModalShow}
                projectid={projectid}
                onHide={() => setReqModalShow(false)}
              />

              <UploadDocument
                show={modalShow}
                onHide={() => setModalShow(false)}
              />
            </div>
          </div>
          <div className="ProjectActivities__box-top">
            <div className="ProjectActivities__box">
              <p className="ProjectActivities__box1">
                Date{" "}
                <span>
                  {ConvertDate(
                    ProjectData?.createdAt || ProjectData?.updatedAt
                  )}
                </span>
              </p>
              <p className="ProjectActivities__box2">
                Type <span>{ProjectData?.type || "-"}</span>
              </p>
              <p className="ProjectActivities__box2" style={{ marginLeft: 24 }}>
                Organization{" "}
                <span>
                  {ProjectData?.organization ||
                    ProjectData?.organizationName ||
                    ProjectData?.orgName ||
                    ProjectData?.creator?.organizationName ||
                    ProjectData?.owner?.organizationName ||
                    "-"}
                </span>
              </p>
            </div>
            <div className="btn-contributor-div">
              {canComplete && (
                <button
                  className="ProjectActivities__box-btn"
                  style={{
                    marginLeft: 24,
                  }}
                  onClick={() => {
                    setcompleteModal(true);
                  }}
                  tabIndex="0"
                  aria-label="Complete project"
                >
                  Complete Project
                </button>
              )}

              <CompleteProjectModal
                modalVisible={completeModal}
                onCompleteProject={completeProjectApi}
                onModalClose={() => {
                  setcompleteModal(false);
                }}
              />

              {/* Payment components removed per design update */}
              <RequestPayment
                show={requestPaymentShow}
                onHide={() => setRequestPaymentShow(false)}
                projectData={ProjectData}
                clientName={ProjectData?.clientName}
              />

              {/* Top 3 contributors avatars; click navigates to contributors screen */}
              {topThreeContributors?.length > 0 && (
                <div
                  className="contributors-avatars"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0,
                    marginLeft: 24,
                  }}
                >
                  {topThreeContributors.map((c, idx) => (
                    <img
                      key={c?.user?._id || idx}
                      src={
                        c?.user?.profilePicture ||
                        "/Images/profile-default-avatar.jpg"
                      }
                      alt={c?.user?.fullname || "contributor"}
                      onClick={() => OnProjectContributor()}
                      style={{
                        height: 48,
                        width: 48,
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginLeft: idx === 0 ? 0 : -22,
                        border: "none",
                        position: "relative",
                        zIndex: idx === 0 ? 3 : idx === 1 ? 2 : 1,
                        cursor: "pointer",
                      }}
                    />
                  ))}
                </div>
              )}
              <ProjectPayment
                show={paymentModalShow}
                onHide={() => setPaymentModalShow(false)}
                projectData={ProjectData}
              />
            </div>
          </div>
          <div className="ProjectActivities__txt">
            <p>{ProjectData?.description}</p>
          </div>
          {/* <div>
            <button
              className="ProjectActivities__top-box_header-btn2"
              onClick={() => setReqModalShow(true)}
            >
              Request documents
            </button>
          </div> */}
        </div>
        {UserProjectActivity?.length > 0 ? (
          <div className="ProjectActivities__main ">
            <div className="flex justify-between items-center">
              <div className="ProjectActivities__main-txt">
                <h1>Project activities</h1>
                <p>Below is a breakdown of recent activities in your project</p>
              </div>
              {/* Chat CTA - show for contributors and organizations */}
              {currentUserRole === "organization" ||
              (isContributor && currentUserRole === "user") ? (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <button
                    type="button"
                    onClick={OnChatBox}
                    aria-label="Open chat"
                    style={chatBtnStyle}
                  >
                    <img
                      src="/Images/Projects/chat.svg"
                      alt=""
                      aria-hidden="true"
                      style={chatIconStyle}
                    />
                    <span style={chatLabelStyle}>Chat</span>
                  </button>
                  {/* <button
                    className="pay-primary-btn"
                    onClick={() => setRequestPaymentShow(true)}
                    tabIndex="0"
                    aria-label="Withdraw payment"
                  >
                    Withdraw payment
                  </button> */}
                </div>
              ) : isContributor && canMakePayment ? (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <img
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      OnChatBox();
                    }}
                    src="/Images/Projects/chat.svg"
                    alt="chat"
                    className="project-edit-img"
                  />
                  {/* <button
                    className="pay-primary-btn"
                    onClick={() => setPaymentModalShow(true)}
                    tabIndex="0"
                    aria-label="Make payment"
                  >
                    Make Payment
                  </button> */}
                </div>
              ) : null}
            </div>

            <div>
              {UserProjectActivity?.map((items, index) => {
                return (
                  <Dropdown
                    className="ProjectActivities__dropdown"
                    key={index}
                    show={openDropdown === index}
                    onToggle={() => toggleDropdown(index)}
                  >
                    <Dropdown.Toggle
                      //   as={CustomToggle}
                      id="dropdown-basic1"
                      // id={`dropdown-basic-${index}`}
                      className="dropdown__menu"
                      value=""
                      onClick={() => toggleDropdown(index)}
                    >
                      <div className="ProjectActivities__dropdown-header">
                        <h1>{items?.date}</h1>
                        <p>
                          {items?.totalActivities}{" "}
                          {Number(items?.totalActivities) > 1
                            ? "Activities"
                            : "Activity"}
                        </p>
                      </div>
                      <button className="dropdown__image-project-arrow">
                        <img src="/Images/HelpCenter/arrow.svg" alt="arrow" />
                      </button>
                    </Dropdown.Toggle>

                    {items?.data?.map((item, index) => {
                      console.log(item, "itemitemitemjjjj");
                      return (
                        <Dropdown.Menu className="show1">
                          <Dropdown.Item
                            // disabled

                            key={index}
                            as="div"
                            onClick={handleDropdownItemClick}
                            // className="dropdown__text"
                          >
                            <div className="ProjectActivities__main-activities">
                              <div className="ProjectActivities__main-activities-text">
                                {item?.requester?.profilePicture ? (
                                  <img
                                    src={item?.requester?.profilePicture}
                                    alt="/"
                                    width="28px"
                                    height={"28px"}
                                    style={{
                                      borderRadius: "50%",
                                    }}
                                  />
                                ) : (
                                  <img
                                    src={"/Images/profile-default-avatar.jpg"}
                                    alt="/"
                                    width="35px"
                                    height={"35px"}
                                    style={{
                                      borderRadius: "50%",
                                    }}
                                  />
                                )}

                                <div className="Project-jimmy-drop ">
                                  <p>{item?.requester?.fullname}</p>

                                  <div className="up-docs-drop">
                                    <span>{item?.status}</span>
                                    <p className="activity-txt">
                                      {item?.activity}
                                    </p>
                                    {item?.requestedUser && (
                                      <>
                                        <p className="from-txt">from</p>
                                        <p
                                          style={{
                                            textTransform: "capitalize",
                                          }}
                                        >
                                          {item?.requestedUser?.fullname}
                                        </p>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="ProjectActivities__main-activities-date">
                                <p>{formatTime(item?.createdAt)}</p>
                              </div>
                            </div>
                            {item?.documentUrl !== null && (
                              <div className="document-container ms-3">
                                <img
                                  src={getIconByExtension(item.documentUrl)}
                                  alt="Document"
                                  width="70px"
                                  height="70px"
                                  style={{
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleClick(item.documentUrl)}
                                />
                              </div>
                            )}

                            {item?.activity === "Audio-Call" && (
                              <div className="document-container ms-3">
                                <img
                                  // src={getIconByExtension(item?.callUrl)}
                                  src="/Images/Projects/call.svg"
                                  alt="Document"
                                  width="40px"
                                  height="40px"
                                  style={{
                                    // borderRadius: "50%",
                                    cursor: "pointer",
                                  }}
                                  // onClick={() => handleClickCall(item?.callUrl)}
                                />
                              </div>
                            )}

                            {item?.activity === "Video-Call" && (
                              <div className="document-container ms-3">
                                <img
                                  // src={getIconByExtension(item?.callUrl)}
                                  src="/Images/Projects/vediocall.svg"
                                  alt="Video"
                                  width="40px"
                                  height="40px"
                                  style={{
                                    // borderRadius: "50%",
                                    cursor: "pointer",
                                  }}
                                  // onClick={() => handleClickCall(item?.callUrl)}
                                />
                              </div>
                            )}
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      );
                    })}
                  </Dropdown>
                );
              })}
            </div>
            <div></div>
          </div>
        ) : (
          <div className="ProjectActivities__main-empty ">
            <img src="/Images/Projects/no project activity.svg" alt="/" />
            <p className="no-project-activity-head">No Project Activity</p>
            <p className="no-project-activity-p">
              Currently you don’t have any project activity.
            </p>
          </div>
        )}
        {/* <Chatbox /> */}
      </>
      {modalShowUpdate && (
        <UpdateProject
          projectid={ProjectData}
          show={modalShowUpdate}
          onHide={() => setModalShowUpdate(false)}
        />
      )}

      <FilePreviewModal
        file={selectedImage}
        onClose={() => setshowPreviewModal(false)}
        isOpen={showPreviewModal}
      />
    </>
  );
};

export default ProjectActivities;
