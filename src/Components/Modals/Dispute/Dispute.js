import Button from "@mui/material/Button";
import Modal from "react-bootstrap/Modal";
import "./dispute.css";
import * as React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { useDispatch, useSelector } from "react-redux";
import { SuccessToast, ErrorToast } from "../../toast/Toast";
import { useState, useEffect } from "react";
import { createDispute } from "../../../services/redux/middleware/helpCenter";
import { getAllProjectDispute } from "../../../services/redux/middleware/Dispute/dispute";
import { useNavigate } from "react-router-dom";
import { DisputeData } from "../../../services/redux/middleware/Dispute/dispute";

export default function Dispute(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [UserClickID, setUserClickID] = useState();
  const [selectedClientId, setSelectedClientID] = useState();
  const [loader, setLoader] = useState(false);
  const [userID, setUserID] = useState();
  const [message, setMessage] = useState("");

  const UserProjects = useSelector(
    (state) => state?.getAllProjectdispute?.myProjects?.data
  );

  const userLoading = useSelector((state) => state?.getAllProjectdispute);

  console.log("Projects of user", UserProjects);
  const handleSelectClient = (item) => {
    setUserClickID(item);
    setSelectedClientID(item.id);
  };

  useEffect(() => {
    const userid = localStorage.getItem("_id");
    console.log("user id ", userid);
    setUserID(userid);
    dispatch(getAllProjectDispute(userid));
  }, []);

  async function createdDispute() {
    setLoader(true);
    try {
      const data = {
        userId: userID,
        projectId: selectedClientId,
        msg: message.trim(),
      };

      if (!userID || !selectedClientId || !message.trim()) {
        ErrorToast("Please fill in all required fields");
        return;
      }
      dispatch(createDispute(data)).then((res) => {
        if (res?.payload?.status === 200) {
          setLoader(false);
          console.log(" Dispute", res?.payload?.data);

          SuccessToast("Added Successfully");
          props.onHide();
          setMessage("");
          setUserClickID("");
          setSelectedClientID("");
          const dataall = {
            id: userID,
            page: 1,
          };
          dispatch(DisputeData(dataall));
          navigate(`/Disputes`);
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
      {/* {loader && <ScreenLoader />} */}
      {/* {userLoading.loading && <ScreenLoader />} */}

      <Modal
        {...props}
        // size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        className="add-project-modal "
      >
        <Modal.Header
          style={{ padding: "70px", paddingBottom: "0px", paddingTop: "60px" }}
        >
          <Modal.Title
            id="contained-modal-title-vcenter"
            className="add-project__header"
          >
            <div className="dispute__main-header">
              <p className="dispute__main-heading mb-0">Disputes</p>
              <p className="dispute__main-paragraph">
                Choose a project you want to appeal on
              </p>
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
          <div className="dispute__body">
            <p className="dispute__body-head">Projects</p>
            <Dropdown>
              <Dropdown.Toggle id="dropdown-basic-dispute" className="">
                <p
                  className={
                    UserClickID ? "dropdown_title" : "dropdown_placeholder"
                  }
                >
                  {UserClickID ? UserClickID?.title : "Select Project"}
                </p>

                <img
                  className="dropdown__image-dispute"
                  src="/Images/HelpCenter/arrow.svg"
                  alt="arrow"
                />
              </Dropdown.Toggle>

              <Dropdown.Menu className="dispute__dropdown-body">
                {UserProjects?.projects?.length > 0 ? (
                  UserProjects?.projects?.map((item, index) => (
                    <Dropdown.Item
                      key={index}
                      // href={`#/action-${index + 1}`}
                      color="black"
                      onClick={() => handleSelectClient(item)}
                    >
                      {item?.title}
                    </Dropdown.Item>
                  ))
                ) : (
                  <div className="no-project-item">
                    <p>No Project Found</p>
                  </div>
                )}
              </Dropdown.Menu>
            </Dropdown>
            <label>Message</label>
            <textarea
              type="text"
              placeholder="Please explain dispute in details..."
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
          </div>
          <div className="add-project__main-btn">
            <Button className="client-project__btn" onClick={createdDispute}>
              Dispute
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
