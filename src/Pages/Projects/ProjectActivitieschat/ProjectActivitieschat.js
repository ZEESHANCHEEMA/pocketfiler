import React, { useState, useEffect } from "react";
import "./projectActivitieschat.css";
import Sidebar from "../../../Components/Sidebar/Sidebar";
import Dropdown from "react-bootstrap/Dropdown";
import Chatbox from "../../../Components/Chatbox/Chatbox";
import UploadDocument from "../../../Components/Modals/UploadDocuments/UploadDocument";
import ProjectDocs from "../../../Components/Modals/ProjectDocs/ProjectDocs";
import Header from "../../../Components/Header/Header";
import { useMediaQuery } from "react-responsive";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useNavigation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { viewproject } from "../../../services/redux/middleware/Project/project";
import { viewProjectActivities } from "../../../services/redux/middleware/Project/project";
// const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
//     <a
//       href="/"
//       ref={ref}
//       onClick={(e) => {
//         e.preventDefault();
//         onClick(e);
//       }}
//     >
//       {/* Custom image for toggle */}
//       <img
//         src="/Images/Projects/arrow.svg"
//         alt="Toggle Icon"
//         style={{ width: '20px', height: '20px' }} // Adjust size as needed
//       />
//     </a>
//   ));

const ProjectActivitiesChat = () => {
  const isMobile = useMediaQuery({
    query: "(max-width: 768px)",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modalShow, setModalShow] = useState(false);
  const { projectid } = useParams();

  const viewProjectState = useSelector((state) => state?.getviewproject);
  const ProjectData =
    viewProjectState?.viewProject?.data ??
    viewProjectState?.viewProject ??
    null;
  // console.log("Project",projectid, "Project DATA ", ProjectData);

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
  }, [projectid]);

  useEffect(() => {
    dispatch(viewProjectActivities(projectid));
    console.log("getting all activities");
  }, [projectid]);

  const UserProjectActivity = useSelector(
    (state) => state?.getAllProjectActivity?.allProjectActivity?.data
  );
  console.log("Project Activity user", UserProjectActivity);

  const formatTime = (createdAt) => {
    if (!createdAt) return ""; // handle case where createdAt is undefined or null

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

  return (
    <>
      <Header headername={"Projects"} showBack onBack={() => navigate(-1)} />

      <>
        <div className="ProjectActivities__top-box ">
          <div className="ProjectActivities__top-box_header">
            <div className="ProjectActivities2__top-box_header-txt">
              <h4>{ProjectData?.title}</h4>
              <div className="bg__text">
                {" "}
                <p>{ProjectData?.status}</p>{" "}
              </div>
            </div>
            <div className="ProjectActivities__top-box_header-btn">
              {/* <img
                style={{ cursor: "pointer" }}
                src="/Images/Projects/edit-box.svg"
                alt="edit"
                className="project-edit-img"
              /> */}

              {/* {isMobile ? (
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
                  <button className="ProjectActivities__top-box_header-btn2">
                    Request documents
                  </button>
                </>
              )} */}

              <UploadDocument
                show={modalShow}
                onHide={() => setModalShow(false)}
              />
            </div>
          </div>
          <div className="ProjectActivities__box">
            <p className="ProjectActivities__box1">
              Date{" "}
              <span>
                {ConvertDate(ProjectData?.createdAt || ProjectData?.updatedAt)}
              </span>
            </p>
            <p className="ProjectActivities__box2">
              Type <span>{ProjectData?.type || "-"}</span>
            </p>
          </div>
          <div className="ProjectActivities__txt">
            <p>{ProjectData?.description}</p>
          </div>
        </div>

        <Chatbox />
      </>
    </>
  );
};

export default ProjectActivitiesChat;
