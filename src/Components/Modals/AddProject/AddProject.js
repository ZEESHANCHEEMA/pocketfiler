import Button from "@mui/material/Button";
import Modal from "react-bootstrap/Modal";
import { useState, useEffect } from "react";
import "./addproject.css";
import * as React from "react";
import { ErrorToast, SuccessToast } from "../../../Components/toast/Toast";
import { createproject } from "../../../services/redux/middleware/Project/project";
import { useDispatch } from "react-redux";
import ScreenLoader from "../../../Components/loader/ScreenLoader";
import { useNavigate } from "react-router-dom";
import { getAllProject } from "../../../services/redux/middleware/Project/project";
import { getfourProjects } from "../../../services/redux/middleware/Project/project";
import { LatestProjContract } from "../../../services/redux/middleware/Project/project";
// import { BorderBottom } from "@mui/icons-material";

export default function AddProject(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [userId, setUserId] = useState();
  const [projectType, setProjectType] = useState();
  const [projectTitle, setProjectTitle] = useState();
  const [projectDescription, setProjectDescription] = useState();

  useEffect(() => {
    const userid = localStorage.getItem("_id");
    setUserId(userid);
    dispatch(LatestProjContract(userid));
  }, []);

  const formValidation = () => {
    if (!projectTitle) {
      ErrorToast("Please Enter Title");
      return false;
    } else if (!projectType) {
      ErrorToast("Please Enter Type");
      return false;
    } else if (!projectDescription) {
      ErrorToast("Please Enter Description");
      return false;
    }
  };

  async function CreateProject() {
    const res = formValidation();
    if (res === false) {
      return false;
    }
    setLoader(true);
    try {
      const data = {
        title: projectTitle,
        type: projectType,
        description: projectDescription,
        userId: userId,
      };
      console.log("this is project", data, userId);

      const dataall = {
        id: userId,
        page: 1,
      };
      dispatch(createproject(data)).then((res) => {
        if (res?.payload?.status === 200) {
          setLoader(false);
          console.log("Creating Project res", res?.payload?.data);
          SuccessToast("Project Created Successfully");
          dispatch(getfourProjects(userId));
          dispatch(getAllProject(dataall));

          props.onHide();
        } else {
          setLoader(false);
          ErrorToast(res?.payload?.message);
        }
      });
    } catch (error) {
      console.error("Error:", error);
    }
  }
  return (
    <>
      {loader && <ScreenLoader />}
      <Modal
        {...props}
        // size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="add-project-modal"
      >
        <Modal.Header
          style={{ padding: "70px", paddingBottom: "0px", paddingTop: "60px" }}
        >
          <Modal.Title
            id="contained-modal-title-vcenter"
            className="add-project__header"
          >
            <div
              className="add-project__main-header"
              style={{ display: "flex", flexDirection: "column", gap: "7px" }}
            >
              <h6 className="mb-0">Add project</h6>
              <p>Fill the details below to add project</p>
            </div>
            <div className="add-project__close">
              <img
                src="/Images/Projects/close.svg"
                alt="close-icon"
                onClick={props.onHide}
              />
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{ padding: "70px", paddingTop: "50px", paddingBottom: "60px" }}
        >
          <div className="add-project-body">
            <div className="add-project__input">
              <label>Project title</label>
              <input
                type="text"
                placeholder="Enter project title... "
                onChange={(e) => setProjectTitle(e.target.value)}
              />
            </div>
            <div className="add-project__input">
              <label>Project type</label>
              <input
                type="text"
                placeholder="Enter project type..."
                onChange={(e) => setProjectType(e.target.value)}
              />
            </div>
            <div className="add-project__input2">
              <label>Project description</label>
              <textarea
                type="text"
                placeholder="Project description..."
                className="addproj-textarea "
                onChange={(e) => setProjectDescription(e.target.value)}
              />
            </div>
            <div className="add-project__main-btn">
              <Button className="upload-project__btn" onClick={CreateProject}>
                Add project
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
