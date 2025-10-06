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

  const [completeModal, setcompleteModal] = useState(false);
  const viewProjectState = useSelector((state) => state?.getviewproject);
  const ProjectData =
    viewProjectState?.viewProject?.data ??
    viewProjectState?.viewProject ??
    null;
  // const isLoadingProject = Boolean(viewProjectState?.loading);
  // const projectError = viewProjectState?.error;
  console.log("Project Data=======", ProjectData);
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

  const UserProjectActivity = useSelector(
    (state) => state?.getAllProjectActivity?.allProjectActivity?.data ?? []
  );

  console.log("Project Activity user", UserProjectActivity);

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
      <Header
        headername={
          <>
            <img
              src="/Images/Clients/backarrow.svg"
              alt="/"
              style={{ zIndex: 1500, position: "relative" }}
              className="header__arrow-img"
              onClick={() => navigate(-1)}
            />{" "}
            Projects
          </>
        }
      />
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
              {userId === ProjectData?.userId && (
                <img
                  style={{ cursor: "pointer" }}
                  src="/Images/Projects/edit-box.svg"
                  alt="edit"
                  className="project-edit-img"
                  onClick={() => setModalShowUpdate(true)}
                />
              )}
              <img
                style={{ cursor: "pointer" }}
                onClick={() => {
                  OnChatBox();
                }}
                src="/Images/Projects/chat.svg"
                alt="chat"
                className="project-edit-img"
              />
              {isMobile ? (
                <>
                  <img
                    src="/Images/Projects/upload-btn-mb.svg"
                    alt="upload document"
                    className="project-edit-img"
                    onClick={() => setModalShow(true)}
                  />
                  <img
                    src="/Images/Projects/request-btn.svg"
                    alt="Request document"
                    className="project-edit-img"
                    onClick={() => setReqModalShow(true)}
                  />
                </>
              ) : (
                <>
                  <button
                    className="ProjectActivities__top-box_header-btn1"
                    onClick={() => setModalShow(true)}
                  >
                    Upload documents
                  </button>
                  <button
                    className="ProjectActivities__top-box_header-btn2"
                    onClick={() => setReqModalShow(true)}
                  >
                    Request documents
                  </button>
                </>
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
            </div>
            <div className="btn-contributor-div">
              <button
                className="ProjectActivities__box-btn"
                onClick={() => {
                  OnProjectContributor();
                }}
              >
                Contributors
              </button>
              {ProjectData?.userId === userId &&
                ProjectData?.status === "inprogress" && (
                  <button
                    className="ProjectActivities__box-btn"
                    style={{
                      marginLeft: 24,
                    }}
                    onClick={() => {
                      setcompleteModal(true);
                    }}
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
            </div>
          </div>
          <div className="ProjectActivities__txt">
            <p>{ProjectData?.description}</p>
          </div>
        </div>
        {UserProjectActivity?.length > 0 ? (
          <div className="ProjectActivities__main ">
            <div className="ProjectActivities__main-txt">
              <h1>Project activities</h1>
              <p>Below is a breakdown of recent activities in your project</p>
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
