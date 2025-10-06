import Button from "@mui/material/Button";
import Modal from "react-bootstrap/Modal";
// import "./dispute.css";
import * as React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getContributors } from "../../../services/redux/middleware/Project/project";
// import { getClient } from "../../../services/redux/middleware/getContract";
import { RequestDoc } from "../../../services/redux/middleware/Project/project";
import { SuccessToast, ErrorToast } from "../../toast/Toast";
import ScreenLoader from "../../loader/ScreenLoader";
import { viewProjectActivities } from "../../../services/redux/middleware/Project/project";

export default function ReqDocument(props) {
  const dispatch = useDispatch();
  const [userID, setUserID] = useState();
  const [UserClickID, setUserClickID] = useState();
  const [selectedClientId, setSelectedClientID] = useState();
  const [loader, setLoader] = useState(false);
  const [AllContriButers, setAllContriButers] = useState([]);

  const Clients = useSelector(
    (state) => state?.getcontributors?.myContributors?.data
  );
  console.log("contributors are", Clients);

  const handleSelectClient = (item) => {
    setUserClickID(item);
    console.log("this is items", item);
    setSelectedClientID(item?.user?._id);
  };

  useEffect(() => {
    const userid = localStorage.getItem("_id");
    console.log("user id ", userid);
    setUserID(userid);
    const data = {
      projectId: props.projectid,
      page: 1,
    };
    dispatch(getContributors(data));
  }, [dispatch, props.projectid]);

  useEffect(() => {
    const list = Clients?.contributors || [];
    setAllContriButers(Array.isArray(list) ? list : []);
  }, [Clients]);

  async function handleReqDoc() {
    try {
      setLoader(true);

      if (!selectedClientId) {
        ErrorToast("Please select a client to request documents");
        setLoader(false);
        return;
      }
      const data = {
        projectId: props.projectid,
        userId: userID,
        activity: "Project Documents",
        request_to_userid: selectedClientId,
        status: "requested",
      };
      dispatch(RequestDoc(data)).then((res) => {
        if (res?.payload?.status === 200) {
          setLoader(false);
          console.log("Req doc success", res?.payload?.data);
          SuccessToast("Document Request Sent Successfully");
          dispatch(viewProjectActivities(props.projectid));
          setSelectedClientID("");
          setUserClickID("");

          // navigate("/Dashboard");
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
              <p className="dispute__main-heading mb-0">Request documents</p>
              <p className="dispute__main-paragraph">Choose a client below</p>
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
            <p className="dispute__body-head">Select client</p>
            <Dropdown>
              <Dropdown.Toggle id="dropdown-basic-dispute" className="">
                <p
                  style={
                    UserClickID ? { color: "black" } : { color: "#858585" }
                  }
                  className="dropdown_placeholder"
                >
                  {UserClickID ? UserClickID?.user?.email : "Select Client"}
                </p>
                <img
                  className="dropdown__image-dispute"
                  src="/Images/HelpCenter/arrow.svg"
                  alt="arrow"
                />
              </Dropdown.Toggle>

              <Dropdown.Menu className="w-100">
                {AllContriButers?.length > 0
                  ? AllContriButers.map((item, index) =>
                      item?.user?._id !== userID ? (
                        <Dropdown.Item
                          key={index}
                          onClick={() => handleSelectClient(item)}
                        >
                          {item?.user?.email}
                        </Dropdown.Item>
                      ) : null
                    )
                  : "No Client Found"}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="add-project__main-btn">
            <Button className="client-project__btn" onClick={handleReqDoc}>
              Request documents
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
