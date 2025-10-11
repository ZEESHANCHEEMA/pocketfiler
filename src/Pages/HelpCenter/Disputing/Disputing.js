import React, { useEffect, useState } from "react";
import "./Disputing.css";
import Header from "../../../Components/Header/Header";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { viewproject } from "../../../services/redux/middleware/Project/project";
import { viewProjectActivities } from "../../../services/redux/middleware/Project/project";
import ChatboxDispute from "../../../Components/Chatbox/ChatboxDispute/ChatboxDispute";
import { WithDrawDispute } from "../../../services/redux/middleware/Dispute/dispute";
import { SuccessToast, ErrorToast } from "../../../Components/toast/Toast";
import { toSentenceCase } from "../../../utils/helperFunction";
import { Button, Modal } from "react-bootstrap";
const Disputing = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location, "locationlocationlocationlocation");
  const disputeData = location.state;
  const { projectid } = useParams();
  const ProjectData = useSelector(
    (state) => state?.getviewproject?.viewProject?.data
  );
  const [show, setShow] = useState(false);
  const ConvertDate = (originalDateStr) => {
    const originalDate = new Date(originalDateStr);
    const formattedDate = originalDate.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
    return formattedDate;
  };

  useEffect(() => {
    dispatch(viewproject(projectid));
  }, [projectid]);

  useEffect(() => {
    dispatch(viewProjectActivities(projectid));
    console.log("getting all activities");
  }, [projectid]);

  const UserProjectActivity = useSelector(
    (state) => state?.getAllProjectActivity?.allProjectActivity?.data
  );
  console.log("Project Activity user", UserProjectActivity);

  async function handleWithdraw() {
    try {
      const data = {
        id: disputeData?.id,
      };
      dispatch(WithDrawDispute(data)).then((res) => {
        if (res?.payload?.status === 200) {
          console.log("WIthdrawing", res?.payload?.data);
          handleClose();
          SuccessToast("Withdraw Dispute Success");
          navigate("/Disputes");
        } else {
          ErrorToast(res?.payload?.message);
        }
      });
    } catch (error) {
      handleClose();
      console.error("Error:", error);
    }
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
      <Header
        headername={"Dispute details"}
        showBack
        onBack={() => navigate(-1)}
      />
      <>
        <div className="ProjectActivities__top-box ">
          <div className="ProjectActivities__top-box_header">
            <div className="ProjectActivities__top-box_header-txt">
              <h4>{ProjectData?.title}</h4>

              <p
                style={{
                  color:
                    disputeData?.status === "inprogress"
                      ? "#D32121"
                      : disputeData?.status === "Withdrawn" ||
                        disputeData?.status === "closed"
                      ? "#166FBF"
                      : "none",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: "500",
                  lineHeight: "160%",
                  textAlign: "center",

                  borderRadius: "50px",
                  background:
                    disputeData?.status === "inprogress"
                      ? "#FBEDED"
                      : disputeData?.status === "Withdrawn" ||
                        disputeData?.status === "closed"
                      ? "#F1F6FB"
                      : "none",
                  height: "39px",
                  width: "105px",
                  letterSpacing: "0.8px",

                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {toSentenceCase(disputeData?.status)}
              </p>
            </div>

            {disputeData?.status !== "closed" && (
              <div className="ProjectActivities__top-box_header-btn">
                <>
                  <button className="disputing__top-btn" onClick={handleShow}>
                    Withdraw Dispute
                  </button>
                </>
              </div>
            )}
          </div>
          <div className="ProjectActivities__box-top">
            <div className="ProjectActivities__box">
              <p className="ProjectActivities__box1">
                Date <span>{ConvertDate(ProjectData?.createdAt)}</span>
              </p>
              <p className="ProjectActivities__box2">
                Type <span>{ProjectData?.type}</span>
              </p>
            </div>
          </div>
          <div className="ProjectActivities__txt">
            <p>{ProjectData?.description}</p>
          </div>
        </div>
        <div>
          <ChatboxDispute ProjectData={ProjectData} disputeData={disputeData} />
        </div>
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Withdrawal</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to withdraw this dispute?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleWithdraw}>
              Withdraw
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    </>
  );
};

export default Disputing;
