import Button from "@mui/material/Button";
import { useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useEffect } from "react";
import "./UploadSign.css";
import * as React from "react";
import { SuccessToast, ErrorToast } from "../../toast/Toast";
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "../../../services/client";
import api from "../../../services/apiInterceptor.js";
import { setContractSign } from "../../../services/redux/reducer/addsign.js";
import useDrivePicker from "react-google-drive-picker";
import DropboxChooser from "react-dropbox-chooser";
import ScreenLoader from "../../loader/ScreenLoader.js";
import SignaturePad from "./SignaturePad.js";
import { FaPenAlt } from "react-icons/fa";
import PrevSignatureView from "./PrevSignatureView.js";
export default function UploadSign(props) {
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [openPicker, authResponse] = useDrivePicker();
  const [fileNames, setFileNames] = useState([]);
  const [loader, setLoader] = useState(false);
  const [signaturePad, setsignaturePad] = useState(false);
  const [showPrevSign, setshowPrevSign] = useState();
  const accesstTokenRef = useRef();

  const getPrevSign = localStorage.getItem("prevSignature");

  useEffect(() => {
    accesstTokenRef.current = authResponse?.access_token;
  }, [authResponse]);

  const handleOpenPicker = () => {
    openPicker({
      clientId:
        "28463941306-5lf1hg4gaameiril58vvocosjahprfot.apps.googleusercontent.com",
      developerKey: "AIzaSyADjNOO1j9e9AE2CaKb5-8FU6GUBcy0D98",

      viewId: "DOCS_IMAGES",

      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,

      callbackFunction: (data) => {
        console.log(data, "datadatadataoooooodata");
        if (data.action === "cancel") {
          console.log("User clicked cancel/close button");
        }
        if (data.docs && data.docs.length > 0) {
          downloadFile(data?.docs[0]?.id);
        } else {
          console.log("No documents selected");
        }

        console.log(data);
      },
    });
  };

  const downloadFile = async (fileId) => {
    const fileUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
    console.log("Fetching from:", fileUrl);
    try {
      setLoader(true);
      const response = await fetch(fileUrl, {
        headers: {
          Authorization: `Bearer ${accesstTokenRef.current}`, // Pass OAuth Token
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error Response:", errorText);
        throw new Error("Failed to download image");
      }
      const blob = await response.blob();
      try {
        const fileName = `${Math.random()
          .toString(36)
          .slice(2, 11)}_uploaded_file.jpg`;
        const file = new File([blob], fileName);
        const formData = new FormData();
        formData.append("file", file);
        const res = await api.post(`${API_URL}/upload/uploadimage`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setImageSrc(res?.data?.data);
        // dispatch(setContractSign(res.data?.data));
        // props.onHide();

        // SuccessToast("Signature Uploaded Successfully");
      } catch (error) {
        console.error("Error uploading file:", error);
        setLoader(false);

        return null;
      }
      setLoader(false);
    } catch (error) {
      console.error("Error downloading file:", error);
      setLoader(false);

      return null;
    } finally {
      setLoader(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    setImageSrc(null);
    setsignaturePad(true);
    const file = e.target.files[0];
    console.log("Selected Signature file:", file);

    if (file) {
      setLoader(true);

      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await api.post(`${API_URL}/upload/uploadimage`, formData);

        if (res.status === 200) {
          setLoader(false);

          console.log("Signature Response", res);
          console.log("Signature Uploaded");
          setImageSrc(res?.data?.data);
          // dispatch(setContractSign(res?.data?.data));
          // console.log(res?.data?.data, "this is the SIGN URL");
          // SuccessToast("Signature Uploaded Successfully");
          // props.onHide();
        } else {
          setLoader(false);
          ErrorToast(res?.payload?.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  // const APP_KEY = "glccp41t338t9ap";
  // const APP_KEY = "aap7woidfm3fzfp";
  // const APP_KEY = "pbd8yygg97ghlb4";
  const APP_KEY = "pbd8yygg97ghlb4";

  const onSuccess = (files) => {
    console.log("DROPBOX UPLOADED FILE:", files);
    files.map((file) => {
      setFileNames((fileNames) => [...fileNames, file]);
    });

    setImageSrc(files[0].link);
    // dispatch(setContractSign(files[0].link));

    // console.log("hi file", files);
    // SuccessToast("Signature Uploaded Successfully");
    // props.onHide();
  };
  // const ContractSign = useSelector((state) => state?.addsign.contractsign);
  // console.log("contract  sign is", ContractSign);

  const ContractSign = useSelector((state) => state?.addsign.contractsign);
  console.log("contract  sign is", ContractSign);

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   console.log("Selected file:", file);
  //   setSelectedFile(file);
  //   SuccessToast("Sign Uploaded Successfully");

  //   // Show preview image if the selected file is an image
  //   if (file && file.type.startsWith("image/")) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setPreviewUrl(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //   } else {
  //     setPreviewUrl(null);
  //   }
  // };
  const saveSignature = () => {
    if (imageSrc) {
      dispatch(setContractSign(imageSrc));
      props.onHide();
      SuccessToast("Signature Uploaded Successfully");
    } else if (showPrevSign) {
      dispatch(setContractSign(showPrevSign));
      props.onHide();
      SuccessToast("Signature Uploaded Successfully");
    } else {
      ErrorToast("Please upload a signature");
    }
  };
  const signedSignature = (res) => {
    if (res?.data?.data) {
      dispatch(setContractSign(res?.data?.data));
      setsignaturePad(false);
      props.onHide();
      SuccessToast("Signature Uploaded Successfully");
    } else {
      ErrorToast("Please upload a signature");
    }
  };
  const signaturPadOpen = () => {
    setImageSrc(null);
    setsignaturePad(true);
    setshowPrevSign(false);
  };
  return (
    <>
      <Modal
        {...props}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="upload-sign-modal"
      >
        <Modal.Header
          style={{ padding: "70px", paddingBottom: "0px", paddingTop: "60px" }}
        >
          <Modal.Title
            id="contained-modal-title-vcenter"
            className="add-project__header upload-header"
          >
            <div className="add-project__main-header">
              <h6 className="mb-0 upload-sign-heading">Upload Signature</h6>
            </div>
            <div className="add-project__close add-contract-close">
              <img
                src="/Images/Projects/close.svg"
                alt="close-icon"
                onClick={props.onHide}
              />
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            padding: "70px",
            paddingTop: "45.5px",
            paddingBottom: "60px",
          }}
        >
          {loader && <ScreenLoader />}

          <div>
            {imageSrc && (
              <div className="previewImage">
                <img
                  src={imageSrc}
                  alt="Preview"
                  className="previewImageStyle"
                />
              </div>
            )}
            <div>
              {!imageSrc && signaturePad && (
                <SignaturePad
                  getSinature={(res) => {
                    signedSignature(res);
                  }}
                />
              )}
              {showPrevSign && !imageSrc && !signaturePad && (
                <PrevSignatureView
                  image={getPrevSign}
                  onClear={() => {
                    setshowPrevSign(null);
                    signaturPadOpen();
                  }}
                />
              )}
              {getPrevSign && !showPrevSign && (
                <div
                  className="upload-option pt-option"
                  onClick={() => {
                    setshowPrevSign(getPrevSign);
                    setsignaturePad(false);
                    setImageSrc(null);
                  }}
                >
                  <FaPenAlt className="upload-img" />

                  <p className="option-name">Previous Signatures</p>
                </div>
              )}

              <div
                className="upload-option pt-option"
                onClick={signaturPadOpen}
              >
                <FaPenAlt className="upload-img" />

                <p className="option-name">Draw signature</p>
              </div>
              <div className="upload-option" onClick={handleUploadClick}>
                <img
                  src="/Images/Contract/device.svg"
                  alt="device"
                  className="upload-img"
                />
                <p className="option-name">From device</p>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </div>

              <div
                className="upload-option pt-option"
                onClick={handleOpenPicker}
              >
                <img
                  src="/Images/Contract/google-drive.svg"
                  alt="google-drive"
                  className="upload-img"
                />
                <p className="option-name">Google drive</p>
              </div>

              <div className="pt-option">
                <DropboxChooser
                  appKey={APP_KEY}
                  success={(files) => onSuccess(files)}
                  cancel={() => console.log("closed")}
                  linkType="direct"
                >
                  {/* <br /> */}

                  <div className="upload-option ">
                    <img
                      src="/Images/Contract/dropbox.svg"
                      alt="Dropbox"
                      className="upload-img"
                    />
                    <p className="option-name">Dropbox</p>
                  </div>
                  <div className="dropbox"> </div>
                </DropboxChooser>
              </div>
            </div>
            <div>
              <Button onClick={saveSignature} className="btn-save-sign">
                Save signature
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
