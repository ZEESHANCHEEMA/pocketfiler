import Button from "@mui/material/Button";
import Modal from "react-bootstrap/Modal";
import { useState, useEffect } from "react";
import "./RemoveContributor.css";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeClients } from "../../../services/redux/middleware/getContract";
import { SuccessToast, ErrorToast } from "../../toast/Toast";
import { getClient } from "../../../services/redux/middleware/getContract";
import { getContributors } from "../../../services/redux/middleware/Project/project";
import { removeContributors } from "../../../services/redux/middleware/Project/project";

export default function RemoveContributor(props) {
  console.log("My Props are", props);

  const [userId, setUserId] = useState();
  const dispatch = useDispatch();

  // to remove Client

  // useEffect(() => {
  //   const userid = localStorage.getItem("_id");
  //   setUserId(userid);
  //   console.log("user id ", userid);
  // }, []);
  // const ClientData = useSelector(
  //   (state) => state?.getAllClient?.allClient?.data?.associates
  // );

  // console.log("Client Data", ClientData);

  async function handleRemove() {
    try {
      dispatch(removeContributors(props?.clientid)).then((res) => {
        if (res?.payload?.status === 200) {
          console.log(res.payload.message);
          SuccessToast("Client Removed Successfully");
          props.onHide();

          const dataall = {
            projectId: props.projectid,
            page: 1,
          };
          dispatch(getContributors(dataall));
          console.log("user id ", dataall);
        } else {
          console.log(res);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="remove-contributor-modal "
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="add-project__close mt-close">
            <img
              src="/Images/Projects/close.svg"
              alt="close-icon"
              onClick={props.onHide}
            />
          </div>
          <div className="email-sent-body">
            {props.clientprofile ? (
              <img
                src={props.clientprofile}
                alt="Profile"
                height={"180px"}
                width={"180px"}
                style={{ borderRadius: "16px" }}
              />
            ) : (
              <img
                alt="Profile"
                height={"180px"}
                width={"180px"}
                style={{ borderRadius: "16px" }}
                src="/Images/profile-default-avatar.jpg"
              />
            )}

            <p className="name-sent-head ">{props.clientname}</p>
            <p className="client-email-head ">{props.clientemail}</p>
            <p className="confirmation-text">
              Are you sure you want to remove {props.clientname} as a
              contributor?
            </p>
            <Button onClick={handleRemove} className="btn-remove-contributor">
              <img
                src="/Images/Projects/trash-01.svg"
                alt="remove"
                style={{ paddingRight: "12px" }}
              />
              Remove contributor
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
