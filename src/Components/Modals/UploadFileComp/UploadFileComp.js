import Button from "@mui/material/Button";
import Modal from "react-bootstrap/Modal";
import { useRef, useState } from "react";
import { SuccessToast, ErrorToast } from "../../toast/Toast";
import { API_URL } from "../../../services/client";
import api from "../../../services/apiInterceptor.js";
import "./UploadFileComp.css";
import * as React from "react";
import ScreenLoader from "../../loader/ScreenLoader.js";
import useDrivePicker from "react-google-drive-picker";
import DropboxChooser from "react-dropbox-chooser";

export default function UploadFileComp(props) {
  const [openPicker, authResponse] = useDrivePicker();
  const accesstTokenRef = useRef();
  React.useEffect(() => {
    accesstTokenRef.current = authResponse?.access_token;
  }, [authResponse]);
  const fileInputRef = useRef(null);
  const [loader, setLoader] = useState(false);
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoader(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await api.post(`${API_URL}/upload/uploadimage`, formData);
        if (res.status === 200) {
          setLoader(false);

          props?.onUploadSuccess(res?.data?.data);

          SuccessToast("Project Doc Uploaded Successfully");
          props.onHide();
        } else {
          setLoader(false);
          ErrorToast(res?.payload?.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

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
        props?.onUploadSuccess(res?.data?.data);
        SuccessToast("Project Doc Uploaded Successfully");
        props.onHide();
      } catch (error) {
        console.error("Error uploading file:", error);

        return null;
      }
    } catch (error) {
      console.error("Error downloading file:", error);

      return null;
    } finally {
    }
  };
  // const APP_KEY = "aap7woidfm3fzfp";
  const APP_KEY = "pbd8yygg97ghlb4";
  const onSuccess = (files) => {
    props?.onUploadSuccess(files[0].link);
    props.onHide();
  };
  return (
    <>
      {loader && <ScreenLoader />}
      <Modal
        {...props}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="add-project-modal"
      >
        <Modal.Header
          style={{ padding: "70px", paddingBottom: "0px", paddingTop: "60px" }}
        >
          <Modal.Title
            id="contained-modal-title-vcenter"
            className="add-project__header"
            style={{
              marginBottom: "34px",
            }}
          >
            <div
              className="add-project__main-header"
              style={{ display: "flex", alignItems: "center" }}
            >
              <h6 style={{ margin: "0px" }}>Upload project docs</h6>
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
        <Modal.Body>
          <div className="add-project-body">
            <div className="Upload__project-file">
              <label
                className="Upload__project-file-phone"
                htmlFor="file-input"
              >
                <input
                  type="file"
                  id="file-input"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <span>From device</span>
              </label>

              <label
                onClick={handleOpenPicker}
                className="Upload__project-file-phone1"
              >
                <input
                  type="file"
                  id="file-input"
                  style={{ display: "none" }}
                />
                <span>Google Drive</span>
              </label>

              <DropboxChooser
                appKey={APP_KEY}
                success={(files) => onSuccess(files)}
                cancel={() => console.log("closed")}
                linkType="direct"
              >
                <label className="Upload__project-file-phone3">
                  <input
                    type="file"
                    id="file-input"
                    style={{ display: "none" }}
                  />
                  <span>Drop Box</span>
                </label>
                <div className="dropbox"> </div>
              </DropboxChooser>
            </div>
            <div className="upload-project__main-btn">
              <Button
                className="upload-project__btn"
                onClick={props.onHide}
                style={{ marginBottom: "40px" }}
              >
                Save docs
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
