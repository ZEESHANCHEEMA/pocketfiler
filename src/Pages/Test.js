import React from "react";
import GoogleDrivePicker from "../Components/GoogleDrivePicker/GoogleDrivePicker";
import DemoModal from "../Components/Modals/DemoModal/DemoModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import EmailSentSuccess from "../Components/Modals/EmailSentSuccess/EmailSentSuccess";
import AddContract from "../Components/Modals/AddContract/AddContract";
import UploadSign from "../Components/Modals/UploadSign/UploadSign";
import Contract from "../Components/Modals/Contract/Contract";
import ContractEditor from "../Components/Modals/ContractEditor/ContractEditor";
import ShareContract from "../Components/Modals/ShareContract/ShareContract";
import AddClientOrg from "../Components/Modals/Organization/AddClientOrg/AddClientOrg";
import SmartContract from "../Components/Modals/Organization/SmartContract/SmartContract";
import RequestPayment from "../Components/Modals/Organization/RequestPayment/RequestPayment";
import RemoveContributor from "../Components/Modals/RemoveContributor/RemoveContributor";
import { Remove } from "@mui/icons-material";
import Disputing from "../Components/Disputing/Disputing";

export default function Test() {
  const navigate = useNavigate();
  const [modalShow, setModalShow] = useState(false);
  const [modalShow2, setModalShow2] = useState(false);
  const [modalShow3, setModalShow3] = useState(false);

  return (
    <>
      <div>
      <Disputing/>
        <h1>PocketFiler</h1>
        {/* <GoogleDrivePicker/> */}
        <Button onClick={() => setModalShow(true)}>Open Modal</Button>
        <RemoveContributor show={modalShow} onHide={() => setModalShow(false)} />

        {/* <AddClientOrg show={modalShow} onHide={() => setModalShow(false)} /> */}
        {/* <Button onClick={() => setModalShow2(true)}>Open Modal</Button>
        <Button onClick={() => setModalShow3(true)}>Open Modal</Button> */}
        {/* <RequestPayment show={modalShow} onHide={() => setModalShow(false)} />
        <SmartContract show={modalShow2} onHide={() => setModalShow2(false)} />
        <AddClientOrg show={modalShow3} onHide={() => setModalShow3(false)} /> */}
        {/* <ShareContract
        show={modalShow} onHide={() => setModalShow(false)}
        /> */}
        {/* <ContractEditor
        show={modalShow} onHide={() => setModalShow(false)}
        /> */}
        {/* <Contract
        show={modalShow} onHide={() => setModalShow(false)}
        /> */}
        {/* <UploadSign
        show={modalShow} onHide={() => setModalShow(false)}
        /> */}
        {/* <AddContract 
        show={modalShow} onHide={() => setModalShow(false)}
        /> */}
        {/* <DemoModal show={modalShow} onHide={() => setModalShow(false)} /> */}
      </div>
    </>
  );
}
