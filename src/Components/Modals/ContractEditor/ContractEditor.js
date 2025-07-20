import Button from "@mui/material/Button";
import Modal from "react-bootstrap/Modal";
import "./ContractEditor.css";
import * as React from "react";
import { Editor } from "primereact/editor";
import Form from "react-bootstrap/Form";
import { useState, useEffect, useRef } from "react";
import TextEditor from "../../TextEditor/TextEditor";
import Contract from "../Contract/Contract";
import { useDispatch, useSelector } from "react-redux";
import { SuccessToast, ErrorToast } from "../../toast/Toast";
import { API_URL } from "../../../services/client";
import api from "../../../services/apiInterceptor";
import ScreenLoader from "../../../Components/loader/ScreenLoader";
import AddContract from "../AddContract/AddContract";
import TestingEditior from "../../../Pages/TestingEditior";
import axios from "axios";
import { setContractEditor } from "../../../services/redux/reducer/addcontracteditor";

export default function ContractEditor(props) {
  const dispatch = useDispatch();
  const ContractName = useSelector(
    (state) => state?.addcontract?.contract.name
  );

  const ContractContent = useSelector(
    (state) => state?.addcontracteditor?.contracteditorcontent
  );

  const fileInputRef = useRef(null);
  const [loader, setLoader] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [modalShowpreview, setModalShowPreview] = useState(false);
  const [inputEditor, setInputEditor] = useState(false);

  const [imageSrc, setImageSrc] = useState(null);
  const [userId, setUserId] = useState();
  const [promptText, setPromptText] = useState("");

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handlePreviewContract = () => {
    if (!imageSrc && !ContractContent) {
      ErrorToast("Please upload a contract or generate content using ChatGPT");
      return;
    } else {
      SuccessToast("Contract Details Added Successfully");
      setModalShowPreview(true);
      props.onHide();
    }
  };
  const handleEditName = () => {
    setModalShow(true);
    props.onHide();
  };

  useEffect(() => {
    const userid = localStorage.getItem("_id");
    setUserId(userid);
  }, []);

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
      console.log("Detected File Type:", file.type);
      if (!allowedTypes.includes(file.type)) {
        console.error(
          "File type not supported. Please upload a Word document, PNG, JPEG, or PDF."
        );
        ErrorToast(
          "File type not supported. Please upload a Word document, PNG, JPEG, or PDF."
        );
        return;
      }
      setLoader(true);

      try {
        const formData = new FormData();
        formData.append("file", file);
        console.log("FILE Name:", file.name);
        const res = await api.post(
          `${API_URL}/contract/uploadContractFile/${userId}`,
          formData
        );
        if (res.status === 200) {
          setLoader(false);
          setImageSrc(res?.data?.uploadingTheFile?.original);
          dispatch(setContractEditor(res?.data?.uploadingTheFile?.original));
          SuccessToast("Contract Uploaded Successfully");
        }
      } catch (error) {
        setLoader(false);
        console.error("Error:", error);
      }
    }
  };

  async function ChatAi() {
    try {
      setLoader(true);
      console.log(promptText);
      const res = await axios.post(`${API_URL}/api/chat`, {
        prompt: promptText,
      });
      setLoader(false);
      setImageSrc(res?.data?.message?.content);
      console.log(res, "this is the response");
    } catch (error) {
      setLoader(false);
      console.log("this is error");
      ErrorToast(error);
    } finally {
      setLoader(false);
    }
  }
  console.log("hello img", imageSrc);

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

    return <p>{file}</p>; // Default case
  };

  return (
    <>
      {loader && <ScreenLoader />}

      <Modal
        {...props}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="contract-editor-modal"
      >
        <Modal.Header>
          <Modal.Title
            id="contained-modal-title-vcenter"
            className="add-project__header add-contract-header"
          >
            <div className="contract-editor-header">
              <p className="editor-title">{ContractName}</p>
              <img
                src="/Images/Contract/edit-icon.svg"
                alt="edit-icon"
                onClick={handleEditName}
              />
            </div>
            <AddContract
              show={modalShow}
              onHide={() => setModalShow(false)}
              showpreview={true}
            />
            <div className="add-project__close add-contract-close">
              <img
                src="/Images/Projects/close.svg"
                alt="close-icon"
                onClick={() => {
                  dispatch(setContractEditor(null));
                  setImageSrc(null);
                  props.onHide();
                }}
              />
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "30px", paddingTop: "0px" }}>
          <div>
            <div className="btn-upload-contract" onClick={handleUploadClick}>
              Upload document
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept=".doc,.docx,.pdf,.png,.jpg,.jpeg"
              />
            </div>
            {imageSrc && /\.(pdf|doc|docx|png|jpe?g)$/i.test(imageSrc) && (
              <div
                className="btn-clear-upload"
                onClick={() => {
                  setImageSrc(null);
                  dispatch(setContractEditor(null));
                  fileInputRef.current.value = null;
                }}
              >
                Clear Upload
              </div>
            )}
            {imageSrc && /\.(pdf|doc|docx|png|jpe?g)$/i.test(imageSrc) ? (
              getFileContent(imageSrc)
            ) : (
              <TestingEditior imgcontent={imageSrc && `<p>${imageSrc}</p>`} />
            )}

            <div
              onClick={() => {
                setInputEditor(!inputEditor);
              }}
              className="chatgpt-div"
            >
              <div className="chatglt-chld">
                <img
                  alt=""
                  style={{ paddingRight: "8px" }}
                  src="/Images/Subscription/chatgpt.svg"
                />
                <p>Write contract with ChatGPT</p>
                {inputEditor ? (
                  <img
                    alt=""
                    style={{ paddingLeft: "8px" }}
                    src="/Images/Subscription/uparrow.svg"
                  />
                ) : (
                  <img
                    alt=""
                    style={{ paddingLeft: "8px" }}
                    src="/Images/Subscription/arrowDown.svg"
                  />
                )}
              </div>
            </div>
            {inputEditor && (
              <div className="chat-input-box-area">
                <textarea
                  type="text"
                  placeholder="Enter promt..."
                  className="prompt-textarea"
                  onChange={(e) => {
                    setPromptText(e.target.value);
                  }}
                />

                <Button
                  className="btn-submit-txt"
                  onClick={() => {
                    ChatAi();
                  }}
                >
                  Submit
                </Button>
              </div>
            )}

            <div className="btn-preview-div">
              <Button className="btn-preview" onClick={handlePreviewContract}>
                Preview Contract
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Contract
        show={modalShowpreview}
        setModalShow={props.setModalShow}
        onHide={() => setModalShowPreview(false)}
      />
    </>
  );
}
