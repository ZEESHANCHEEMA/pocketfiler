import Button from "@mui/material/Button";
import Modal from "react-bootstrap/Modal";
import { useState, useEffect } from "react";
import "./removeClient.css";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeClients } from "../../../services/redux/middleware/getContract";
import { SuccessToast, ErrorToast } from "../../toast/Toast";
import { getClient } from "../../../services/redux/middleware/getContract";

export default function ResetPassSuccess(props) {
  console.log(props);

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

  async function RemoveClient() {
    try {
      const associationId = props?.removeassociate;
      if (!associationId) {
        ErrorToast("Missing association id. Please try again.");
        return;
      }
      dispatch(removeClients(associationId)).then((res) => {
        if (res?.payload?.status === 200) {
          console.log(res.payload.message);
          SuccessToast("Client Removed Successfully");
          props.onHide();
          const userid = localStorage.getItem("_id");
          console.log("user id ", userid);
          setUserId(userid);
          const data = {
            id: userid,
            page: 1,
          };
          dispatch(getClient(data));
          console.log("user id ", data);
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
        className="email-sent-modal"
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="email-sent-body">
            <img
              style={{ height: 100, width: 100, borderRadius: 8 }}
              src={
                props?.removeProfile
                  ? props?.removeProfile
                  : "/Images/Clients/remove-client-icon.svg"
              }
              alt="reset-password-icon"
            />
            <p className="email-sent-head  top-pd">
              Remove {props.removeassociatename}
            </p>
            <p className="email-msg">
              Are you sure you want to remove {props.removeassociatename ?? ""}{" "}
              from associates?
            </p>
            <Button onClick={RemoveClient} className="btn-awesome-client">
              Remove
            </Button>
            <Button onClick={props.onHide} className="btn-awesome-client1">
              Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
