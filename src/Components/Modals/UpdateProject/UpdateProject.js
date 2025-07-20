import Button from "@mui/material/Button";
import Modal from "react-bootstrap/Modal";
import { useState, useEffect } from "react";
import "./updateproject.css";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateproject } from "../../../services/redux/middleware/Project/project";
import { SuccessToast, ErrorToast } from "../../toast/Toast";
import ScreenLoader from "../../loader/ScreenLoader";
import { viewproject } from "../../../services/redux/middleware/Project/project";
import { getAllProject } from "../../../services/redux/middleware/Project/project";
// import { BorderBottom } from "@mui/icons-material";

export default function UpdateProject(props) {
  const dispatch = useDispatch();
  const [UserID, setUserID] = useState();
  const [projectTitle, setProjectTitle] = useState();
  const [projectType, setProjectType] = useState();
  const [projectDescription, setProjectDescription] = useState();
  const [loader, setLoader] = useState(false);

  console.log("this is props", props);

  useEffect(() => {
    const userid = localStorage.getItem("_id");
    console.log("user id ", userid);
    setUserID(userid);
  }, [UserID]);

  useEffect(() => {
    setProjectTitle(props.projectid?.title || " ");
    setProjectType(props.projectid?.type || " ");
    setProjectDescription(props.projectid?.description || " ");
  }, [props.projectid]);

  async function UpdateProject() {
    setLoader(true);
    try {
      const data = {
        id: props.projectid.id,
        userId: UserID,
        title: projectTitle,
        type: projectType,
        description: projectDescription,
      };
      const dataall = {
        id: UserID,
        page: 1,
      };
      dispatch(updateproject(data)).then((res) => {
        if (res?.payload?.status === 200) {
          setLoader(false);
          console.log("Updated Project Data", res?.payload?.data);
          dispatch(getAllProject(dataall));
          dispatch(viewproject( props.projectid.id));
          SuccessToast("Updated Successfully");
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
      <Modal
        {...props}
        // size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="add-project-modal"
      >
        <Modal.Header style={{ padding: "70px", paddingBottom: "0px" }}>
          <Modal.Title
            id="contained-modal-title-vcenter"
            className="add-project__header"
          >
            <div
              className="add-project__main-header"
              style={{ display: "flex", flexDirection: "column", gap: "7px" }}
            >
              <h6 className="mb-0">Update project </h6>

              {/* <h6 className="mb-0">Update project {props?.projectid?.id}</h6> */}
              <p>Update the project details below</p>
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
        <Modal.Body style={{ padding: "70px" }}>
          <div className="add-project-body">
            <div className="add-project__input">
              <label>Project title</label>
              <input
                type="text"
                placeholder="Website development “Abid & Brothers” "
                onChange={(e) => setProjectTitle(e.target.value)}
                value={projectTitle}
              />
            </div>
            <div className="add-project__input">
              <label>Project type</label>
              <input
                type="text"
                placeholder="Sales"
                onChange={(e) => setProjectType(e.target.value)}
                value={projectType}
              />
            </div>
            <div className="add-project__input2">
              <label>Project description</label>
              <textarea
                type="text"
                placeholder="Project description..."
                onChange={(e) => setProjectDescription(e.target.value)}
                value={projectDescription}
              />
            </div>
            <div className="add-project__main-btn">
              <Button className="add-project__btn" onClick={UpdateProject}>
                Update project
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
