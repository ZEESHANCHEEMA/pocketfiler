import Button from "@mui/material/Button";
import Modal from "react-bootstrap/Modal";
import * as React from "react";
import { useState, useEffect } from "react";
import UploadSign from "../UploadSign/UploadSign";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";

import ScreenLoader from "../../../Components/loader/ScreenLoader";
import { useNavigate } from "react-router-dom";
import { SuccessToast, ErrorToast } from "../../toast/Toast";
import { viewcontract } from "../../../services/redux/middleware/contract";
import EditContractName from "./EditContractNameType";
import { getAllContract } from "../../../services/redux/middleware/getAllContract";
import { editcontractSignDate } from "../../../services/redux/middleware/contract";
import { getContract } from "../../../services/redux/middleware/getContract";
import { setContractEditor } from "../../../services/redux/reducer/addcontracteditor";
import { API_URL } from "../../../services/client";
import api from "../../../services/apiInterceptor";
import TestingEditior from "../../../Pages/TestingEditior";

export default function EditContract(props) {
  const { ContractID, show, onHide, mode = "view", ...modalProps } = props;

  // Add CSS for spinner animation
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  const fileInputRef = React.useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [UserID, setUserID] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [uploadsign, setUploadSign] = useState(false);
  const [formattedContent, setFormattedContent] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [editable, seteditable] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  const ContractPreviousData = useSelector(
    (state) => state?.getviewcontract?.viewContract?.data
  );

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };
  console.log(
    "Contract Previous Data from edit contract",
    ContractPreviousData
  );

  const ContractPreviouContext = useSelector(
    (state) => state?.getviewcontract?.viewContract?.data?.contractText || 
                 state?.getviewcontract?.viewContract?.data?.content ||
                 state?.getviewcontract?.viewContract?.data?.text
  );

  // Add debugging to check if data is loading
  const isLoading = useSelector(
    (state) => state?.getviewcontract?.loading
  );
  console.log("🔍 EditContract: Contract loading state:", isLoading);
  console.log("🔍 EditContract: Contract data structure:", ContractPreviousData);
  console.log("🔍 EditContract: Contract text content:", ContractPreviouContext);
  console.log("🔍 EditContract: Contract data keys:", ContractPreviousData ? Object.keys(ContractPreviousData) : 'No data');

  const ContractSign = useSelector((state) => state?.addsign.contractsign);
  console.log("Contract Signature is", ContractPreviouContext);
  
  // Debug user ID comparison
  console.log("🔍 EditContract: User ID Debug:", {
    currentUserID: UserID,
    contractUserId: ContractPreviousData?.userId,
    isOwner: ContractPreviousData?.userId === UserID,
    showEditIcon: ContractPreviousData?.userId === UserID
  });

  useEffect(() => {
    if (ContractID && show) {
      console.log("🔍 EditContract: Contract ID is", ContractID);
      console.log("🔍 EditContract: Modal show state is", show);
      console.log("🔍 EditContract: Mode is", mode);
      console.log("🔍 EditContract: About to dispatch viewcontract action for ContractID:", ContractID);
      dispatch(viewcontract(ContractID));
      console.log("🔍 EditContract: Dispatched viewcontract action");
      
      // If mode is edit, automatically enable edit mode
      if (mode === "edit") {
        console.log("🔍 EditContract: Auto-enabling edit mode");
        setTimeout(() => {
          seteditable(true);
          setImageSrc(ContractPreviouContext);
          dispatch(setContractEditor(ContractPreviouContext));
        }, 1000); // Small delay to ensure contract data is loaded
      }
    }
  }, [ContractID, show, mode]);

  useEffect(() => {
    const userid = localStorage.getItem("_id");
    console.log("user id ", userid);
    setUserID(userid);
  }, [UserID]);

  // Load signature and date from contract data when it becomes available
  useEffect(() => {
    if (ContractPreviousData) {
      console.log("🔍 EditContract: Loading signature and date from contract data");
      
      // Load signature if available
      if (ContractPreviousData.signatureImage || ContractPreviousData.signature) {
        console.log("🔍 EditContract: Setting signature from contract data");
        // Note: We don't have a setter for ContractSign, it's managed by Redux
        // The signature should be displayed automatically from ContractPreviousData
      }
      
      // Load date if available
      if (ContractPreviousData.Date || ContractPreviousData.date) {
        console.log("🔍 EditContract: Setting date from contract data:", ContractPreviousData.Date || ContractPreviousData.date);
        const contractDate = new Date(ContractPreviousData.Date || ContractPreviousData.date);
        setStartDate(contractDate);
      }
      
      console.log("🔍 EditContract: Signature and date loading complete");
    }
  }, [ContractPreviousData]);

  console.log("format", formattedContent);
  console.log("🔍 EditContract: Current state:", {
    editable: editable,
    modalShow: modalShow,
    ContractID: ContractID,
    show: show,
    mode: mode,
    hasContractData: !!ContractPreviousData
  });

  const handleEditName = () => {
    console.log("🔍 handleEditName called - enabling edit mode");
    setModalShow(true);
    // Also enable content editing mode
    seteditable(true);
    setImageSrc(ContractPreviouContext);
    dispatch(setContractEditor(ContractPreviouContext));
  };

  const ContractName = useSelector(
    (state) => state?.addcontract?.contract.name
  );
  console.log("Contract Name ", ContractName);

  const ContractType = useSelector(
    (state) => state?.addcontract?.contract.type
  );

  const ContractContent = useSelector(
    (state) => state?.addcontracteditor?.contracteditorcontent
  );

  async function SaveContract() {
    setLoader(true);
    try {
      const data = {
        id: ContractID,
        userId: UserID,
        date: startDate ? startDate : ContractPreviousData?.Date || ContractPreviousData?.date,
        signature: ContractSign
          ? ContractSign
          : ContractPreviousData?.signatureImage || ContractPreviousData?.signature,

        contractText:
          editable && ContractContent
            ? ContractContent
            : ContractPreviouContext,
      };

      dispatch(editcontractSignDate(data)).then((res) => {
        if (res?.payload?.status === 200) {
          setLoader(false);
          console.log("Contract Edited res", res?.payload?.data);
          // dispatch(setContract({ name:"",type:"" }));
          // dispatch(setContractSign(""));
          dispatch(viewcontract(ContractID));
          const dataall = {
            id: UserID,
            page: 1,
          };
          dispatch(getAllContract(dataall));
          dispatch(getContract(UserID));
          SuccessToast("Contract EDITED Successfully");

          // navigate("/Dashboard")

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

  const getFileContent = (file) => {
    if (!file) return <p>No file available</p>;

    if (file.endsWith(".pdf")) {
      return <iframe src={file} width="100%" height="500px" />;
    }

    if (file.endsWith(".doc") || file.endsWith(".docx")) {
      return (
        <iframe
          src={file}
          width="100%"
          height="100vh"
          frameBorder="0"
          scrolling="auto"
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

    return <p>{file}</p>;
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      const allowedTypes = [
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
        "application/pdf",
        "image/png",
        "image/jpeg",
        "application/msword",
      ];
      if (!allowedTypes.includes(file.type)) {
        console.error(
          "File type not supported. Please upload a Word document, PNG, JPEG, or PDF."
        );
        ErrorToast(
          "File type not supported. Please upload a Word document, PNG, JPEG, or PDF."
        );
        return;
      }

      try {
        const formData = new FormData();
        formData.append("file", file);
        console.log("FILE Name:", file.name);
        const res = await api.post(
          `${API_URL}/contract/uploadContractFile/${UserID}`,
          formData
        );
        if (res.status === 200) {
          setImageSrc(res?.data?.uploadingTheFile?.original);
          dispatch(setContractEditor(res?.data?.uploadingTheFile?.original));
          SuccessToast("Contract Uploaded Successfully");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };
  return (
    <>
      {loader && <ScreenLoader />}
      <Modal
        {...modalProps}
        show={show}
        onHide={onHide}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="contract-modal"
      >
        <Modal.Header
          style={{ padding: "70px", paddingBottom: "0px", paddingTop: "60px" }}
        >
          <Modal.Title
            id="contained-modal-title-vcenter"
            className="contract-title-top"
          >
            <p className="contract-title">
              {ContractPreviousData?.contractName || ContractPreviousData?.name || "Untitled Contract"}
            </p>
            {ContractPreviousData?.userId === UserID && (
              <img
                src="/Images/Contract/edit-icon.svg"
                alt="edit-icon"
                className="edit-icon-name"
                onClick={handleEditName}
                // onClick={() => setModalShow(true)}
              />
            )}
            


            <EditContractName
              show={modalShow}
              onHide={() => setModalShow(false)}
              showpreview={false}
              editable={(res) => {
                seteditable(true);
                setImageSrc(ContractPreviouContext);
                dispatch(setContractEditor(ContractPreviouContext));
              }}
              ContractID={ContractID}
            />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            padding: "0px",
            paddingTop: "50px",
            paddingBottom: "30px",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              paddingLeft: "36px",
              paddingRight: "36px",
            }}
          >
            <div
              style={{
                width: "100%",
                overflowY: "auto",
                maxHeight: "500px",
              }}
            >
              {isLoading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <ScreenLoader />
                  <p style={{ marginTop: '20px', color: '#666' }}>Loading contract data...</p>
                </div>
              ) : !ContractPreviousData ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <ScreenLoader />
                  <p style={{ marginTop: '20px', color: '#666' }}>Loading contract data...</p>
                  <details style={{ marginTop: '20px', textAlign: 'left' }}>
                    <summary>Debug Info</summary>
                    <pre style={{ fontSize: '12px', color: '#666' }}>
                      {JSON.stringify({ ContractID, show, isLoading }, null, 2)}
                    </pre>
                  </details>
                </div>
              ) : !editable ? (
                <div>
                  {ContractPreviouContext &&
                  /\.(pdf|doc|docx|png|jpe?g)$/i.test(
                    ContractPreviouContext
                  ) ? (
                    getFileContent(ContractPreviouContext)
                  ) : ContractPreviouContext ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: ContractPreviouContext,
                      }}
                    />
                  ) : (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                      <p>No contract content available.</p>
                      <details style={{ marginTop: '10px', textAlign: 'left' }}>
                        <summary>Debug Info</summary>
                        <pre style={{ fontSize: '12px', color: '#666' }}>
                          {JSON.stringify({ 
                            ContractPreviousData, 
                            ContractPreviouContext,
                            hasContractText: !!ContractPreviousData?.contractText,
                            hasContent: !!ContractPreviousData?.content,
                            hasText: !!ContractPreviousData?.text
                          }, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div
                    className="btn-upload-contract"
                    onClick={handleUploadClick}
                  >
                    Upload document
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                      accept=".doc,.docx,.pdf,.png,.jpg,.jpeg"
                    />
                  </div>
                  {imageSrc &&
                    /\.(pdf|doc|docx|png|jpe?g)$/i.test(
                      ContractPreviouContext
                    ) && (
                      <div
                        className="btn-clear-upload"
                        onClick={() => {
                          setImageSrc(null);
                          dispatch(setContractEditor(null));
                          fileInputRef.current.value = null;
                        }}
                      >
                        <img
                          src="/Images/Projects/close.svg"
                          alt="clear-upload-icon"
                          style={{ paddingRight: "8px" }}
                        />
                        Clear Upload
                      </div>
                    )}
                  {imageSrc && /\.(pdf|doc|docx|png|jpe?g)$/i.test(imageSrc) ? (
                    getFileContent(imageSrc)
                  ) : (
                    <TestingEditior
                      imgcontent={imageSrc && `<p>${imageSrc}</p>`}
                    />
                  )}
                </div>
              )}
            </div>

            <div className="contract-btm">
              <div className="sign-date-contain align-items-end">
                <div className="sign-inner-contain">
                  <div className="sign-edit">
                    {isLoading ? (
                      <div style={{ width: "94px", height: "63px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ width: "20px", height: "20px", border: "2px solid #f3f3f3", borderTop: "2px solid #3498db", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
                      </div>
                    ) : (ContractPreviousData?.signatureImage || ContractPreviousData?.signature) ? (
                      <img
                        src={ContractPreviousData?.signatureImage || ContractPreviousData?.signature}
                        alt="signature"
                        width={"94px"}
                        height={"63px"}
                      />
                    ) : (
                      <>
                        {ContractSign ? (
                          <>
                            <img
                              src={ContractSign}
                              alt="Signature"
                              width={"94px"}
                              height={"63px"}
                            />
                            <UploadSign
                              show={uploadsign}
                              onHide={() => setUploadSign(false)}
                            />
                            <img
                              onClick={() => setUploadSign(true)}
                              src="/Images/Contract/edit-icon.svg"
                              alt="edit"
                              className="  edit-icon-name"
                            />
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
                              className="  edit-icon-name"
                            />
                          </>
                        )}
                      </>
                    )}
                  </div>

                  <p className="sign-txt">Signature</p>
                </div>

                <div className="sign-inner-contain">
                  {isLoading ? (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "20px" }}>
                      <div style={{ width: "16px", height: "16px", border: "2px solid #f3f3f3", borderTop: "2px solid #3498db", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
                    </div>
                  ) : (ContractPreviousData?.Date || ContractPreviousData?.date) ? (
                    <>
                      {new Date(ContractPreviousData?.Date || ContractPreviousData?.date).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        }
                      )}
                    </>
                  ) : (
                    <>
                      <div className="d-flex pb-date">
                        <DatePicker
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          autoFocus={false}
                          className="custom-datepicker"
                          placeholderText="Select Date"
                        />

                        <img src="/Images/Contract/edit-icon.svg" alt="edit" />
                      </div>
                    </>
                  )}
                  <p className="sign-txt">Date</p>
                </div>
              </div>

              {editable && (
                <div>
                  <Button
                    className={"save-contract-btn"}
                    onClick={SaveContract}
                  >
                    Save contract
                  </Button>
                </div>
              )}
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
    </>
  );
}
