import Button from "@mui/material/Button";
import Modal from "react-bootstrap/Modal";
import "./Contract.css";
import * as React from "react";
import { useState, useEffect } from "react";
import UploadSign from "../UploadSign/UploadSign";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";

import { savecontract } from "../../../services/redux/middleware/contract";
import ScreenLoader from "../../../Components/loader/ScreenLoader";
import { useNavigate } from "react-router-dom";
import { SuccessToast, ErrorToast } from "../../toast/Toast";
import Parser from "html-react-parser";
import AddContract from "../AddContract/AddContract";
import AIClauseChecker from "../AIClauseChecker/AIClauseChecker";
import { getAllContract } from "../../../services/redux/middleware/getAllContract";
import { setContract } from "../../../services/redux/reducer/addcontract";
import { setContractSign } from "../../../services/redux/reducer/addsign";
import { getContract } from "../../../services/redux/middleware/getContract";
import { getTotalCount } from "../../../services/redux/middleware/Project/project";

export default function Contract(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [UserID, setUserID] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [uploadsign, setUploadSign] = useState(false);
  const [formattedContent, setFormattedContent] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [showAIChecker, setShowAIChecker] = useState(false);

  const ContractName = useSelector(
    (state) => state?.addcontract?.contract.name
  );

  const ContractType = useSelector(
    (state) => state?.addcontract?.contract.type
  );

  const ContractContent = useSelector(
    (state) => state?.addcontracteditor?.contracteditorcontent
  );
  console.log("this is content on contract", ContractContent);

  const ContractSign = useSelector((state) => state?.addsign.contractsign);
  console.log("Contract Sign is", ContractSign);



  useEffect(() => {
    const userid = localStorage.getItem("_id");

    setUserID(userid);
  }, [UserID]);

  useEffect(() => {
    if (ContractContent && ContractContent !== "undefined") {
      const parser = new DOMParser();
      const doc = parser.parseFromString(ContractContent, "text/html");
      const images = doc.querySelectorAll("img");
      images.forEach((image) => {
        image.style.width = "100%";
      });
      setFormattedContent(doc.body.innerHTML);
    } else {
      setFormattedContent("");
    }
  }, [ContractContent]);

  async function SaveContract() {
    if (!ContractType) {
      ErrorToast("Contract Type is required.");
      return;
    }
    if (!ContractName) {
      ErrorToast("Contract Name is required.");
      return;
    }
    if (!startDate) {
      ErrorToast("Contract date is required.");
      return;
    }
    if (!UserID) {
      ErrorToast("User ID is required.");
      return;
    }
    if (!ContractSign) {
      ErrorToast("Signature is required.");
      return;
    }
    if (!ContractContent) {
      ErrorToast("Contract Content is required.");
      return;
    }
    setLoader(true);
    try {
      const data = {
        category: ContractType,
        contractName: ContractName,
        Date: startDate,
        userId: UserID,
        signatureImage: ContractSign,
        contractText: ContractContent,
      };
      const dataall = {
        id: UserID,
        page: 1,
      };
      dispatch(savecontract(data)).then((res) => {
        if (res?.payload?.status === 200) {
          setLoader(false);
          console.log("Contract Added res", res?.payload?.data);
          dispatch(setContract({ name: "", type: "" }));
          dispatch(setContractSign(""));
          SuccessToast("Contract Added Successfully");
          dispatch(getAllContract(dataall));
          dispatch(getContract(UserID));
          dispatch(getTotalCount(UserID));
          navigate("/Dashboard");
          setFormattedContent("");
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

  console.log("format", formattedContent);

  const handleEditName = () => {
    setModalShow(true);
    // props.onHide();
  };
  console.log(ContractSign, "ContractSignContractSignContractSign");

  const getFileContent = (file) => {
    if (!file) return <p>No file available</p>;

    if (file.endsWith(".pdf")) {
      return <iframe src={file} width="100%" height="500px" title="PDF Document Viewer" />;
    }

    if (file.endsWith(".doc") || file.endsWith(".docx")) {
      return (
        <iframe
          src={file}
          width="100%"
          height="100vh"
          frameBorder="0"
          scrolling="auto"
          title="Word Document Viewer"
        />
      );
    }

    if (
      file.endsWith(".png") ||
      file.endsWith(".jpg") ||
      file.endsWith(".jpeg")
    ) {
      return (
        <img
          src={file}
          alt="Uploaded content"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      );
    }

    return <p>{file}</p>; // Default case
  };
  return (
    <>
      {loader && <ScreenLoader />}
      <Modal
        {...props}
        // size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop={true}
        className="contract-modal"
      >
        <Modal.Header
          style={{ padding: "70px", paddingBottom: "0px", paddingTop: "60px", position: "relative" }}
        >
          <Modal.Title
            id="contained-modal-title-vcenter"
            className="contract-title-top"
          >
            <p className="contract-title">{ContractName}</p>
            <img
              src="/Images/Contract/edit-icon.svg"
              alt="edit-icon"
              className="edit-icon-name"
              onClick={handleEditName}
              // onClick={() => setModalShow(true)}
            />
            <AddContract
              show={modalShow}
              onHide={() => setModalShow(false)}
              showpreview={false}
            />
          </Modal.Title>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={props.onHide}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: "#666",
              width: "30px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              transition: "background-color 0.2s"
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "#f0f0f0"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
          >
            ×
          </button>
        </Modal.Header>
        <Modal.Body
          style={{ padding: "0px", paddingTop: "50px", paddingBottom: "30px" }}
        >
          <div
            style={{
              paddingLeft: "36px",
              paddingRight: "36px",
            }}
          >
            <div
              style={{ width: "100%", overflowY: "auto", maxHeight: "500px" }}
            >
              <div
                style={{
                  width: "100%",
                }}
              >
                {formattedContent && formattedContent !== "undefined" &&
                /\.(pdf|doc|docx|png|jpe?g)$/i.test(formattedContent)
                  ? getFileContent(formattedContent)
                  : formattedContent && formattedContent !== "undefined" 
                    ? Parser(formattedContent)
                    : <p>No contract content available</p>}
              </div>
            </div>

            <div className="contract-btm">
              <div
                className={
                  ContractSign
                    ? "d-flex justify-content-between align-items-center "
                    : "sign-date-contain"
                }
              >
                <div className={"sign-inner-contain"}>
                  <div className="sign-edit">
                    {ContractSign ? (
                      <>
                        <img
                          src={ContractSign}
                          alt="Signature"
                          width={"94px"}
                          height={"63px"}
                          style={{
                            objectFit: "contain",
                          }}
                          onError={() => console.log("Error loading image")}
                        />
                        <UploadSign
                          show={uploadsign}
                          onHide={() => setUploadSign(false)}
                        />
                        <img
                          onClick={() => setUploadSign(true)}
                          src="/Images/Contract/edit-icon.svg"
                          alt="edit"
                          className="edit-icon-name"
                        />
                        {/* <img src="https://drive.google.com/uc?export=view&id=1vNV9Pn3H_3pzwjJyfE7zB_Sf0Wd20ybk" alt="Uploaded Image" /> */}
                      </>
                    ) : (
                      <>
                        <p
                          className="Upload-sign-txt"
                          onClick={() => setUploadSign(true)}
                        >
                          Upload Signature
                        </p>
                        <UploadSign
                          show={uploadsign}
                          onHide={() => setUploadSign(false)}
                        />

                        <img
                          onClick={() => setUploadSign(true)}
                          src="/Images/Contract/edit-icon.svg"
                          alt="edit"
                          className="edit-icon-name"
                        />
                      </>
                    )}
                  </div>

                  <p className="sign-txt">Signature</p>
                </div>

                <div className="sign-inner-contain">
                  <div className="pb-date" style={{ position: "relative" }}>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      autoFocus={false}
                      className="custom-datepicker ytdhfg"
                      placeholderText="Select Date"
                    />
                    <img
                      src="/Images/Contract/edit-icon.svg"
                      alt="edit"
                      className="edit-icon-name sfsvfe"
                    />
                  </div>

                  <p className="sign-txt">Date</p>
                </div>
              </div>

              <div className="contract-actions">
                <Button className="save-contract-btn" onClick={SaveContract}>
                  Save contract
                </Button>
                <Button className="check-clause-ai-btn" onClick={() => {
                  setShowAIChecker(true);
                }}>
                  Check Clause with AI
                </Button>
              </div>
            </div>
            <div className="contract-footer">
              <img
                src="/Images/Contract/pocketfiler - logo.svg"
                alt="logo"
                className="contract-logo"
              />
              <p className="www-txt">www.pocketfiler.com</p>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      
      {/* AI Clause Checker Modal */}
      <AIClauseChecker
        show={showAIChecker}
        onHide={() => setShowAIChecker(false)}
        contractContent={formattedContent || ""}
        onSaveContract={SaveContract}
        contractData={{
          ContractName: ContractName || "",
          ContractType: ContractType || "",
          ContractContent: ContractContent || "",
          ContractSign: ContractSign || "",
          startDate: startDate || null,
          UserID: UserID || ""
        }}
      />
    </>
  );
}
