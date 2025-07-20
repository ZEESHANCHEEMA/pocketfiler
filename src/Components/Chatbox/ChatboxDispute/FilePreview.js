import React, { useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai"; // Import close icon

const FilePreview = ({ fileUrl }) => {
  const [isFullPreview, setIsFullPreview] = useState(false);

  if (!fileUrl) return null;

  const getFileType = (url) => {
    if (/\.(jpeg|jpg|gif|png|webp)$/i.test(url)) return "image";
    if (/\.(pdf)$/i.test(url)) return "pdf";
    if (/\.(doc|docx)$/i.test(url)) return "doc";
    if (/\.(html|htm)$/i.test(url)) return "html";
    return "file";
  };

  const fileType = getFileType(fileUrl);

  return (
    <>
      {!isFullPreview ? (
        <div
          style={{
            cursor: "pointer",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            backgroundColor: "black",
            width: "300px",
            padding: fileType !== "image" ? "10px" : "8px",
            borderRadius: "8px",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          }}
          onClick={() => setIsFullPreview(true)}
        >
          {fileType === "image" ? (
            <img
              src={fileUrl}
              alt="Preview"
              width="100px"
              height="100px"
              style={{
                borderRadius: "8px",
                objectFit: "cover",
              }}
            />
          ) : fileType === "pdf" ? (
            <iframe
              src={fileUrl}
              width="280px"
              height="100px"
              style={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                border: "none",
                overflow: "hidden",
                boxShadow: "0px 0px 10px rgba(255, 249, 249, 0.1)",
              }}
            ></iframe>
          ) : fileType === "doc" || fileType === "html" ? (
            <iframe
              src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
                fileUrl
              )}`}
              width="280px"
              height="100px"
              style={{
                backgroundColor: "#fff",
                borderRadius: "8px",
              }}
            ></iframe>
          ) : (
            <img
              src={
                fileType === "pdf"
                  ? "/Images/File/PDF.svg"
                  : fileType === "doc"
                  ? "/Images/File/DOC.svg"
                  : "/Images/File/file.png"
              }
              alt={fileType}
              width="32px"
              height="32px"
            />
          )}
          <div
            style={{
              backgroundColor: "#212121",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {fileType !== "image" && (
              <img
                src={
                  fileType === "pdf"
                    ? "/Images/File/PDF.svg"
                    : fileType === "doc"
                    ? "/Images/File/DOC.svg"
                    : "/Images/File/file.png"
                }
                alt={fileType}
                width="24px"
                height="24px"
              />
            )}
            <p
              style={{
                fontSize: "14px",
                wordBreak: "break-all",
                borderRadius: "8px",
              }}
            >
              {fileUrl.replace(
                "https://pocketfiler.s3.us-west-1.amazonaws.com/",
                ""
              )}
            </p>

            {/* <div
              style={{
                display: "flex",
                gap: "8px",
                marginTop: "5px",
                marginLeft: "5px",
                alignItems: "center",
              }}
            >
              {fileType !== "image" && (
                <img
                  src={
                    fileType === "pdf"
                      ? "/Images/File/PDF.svg"
                      : fileType === "doc"
                      ? "/Images/File/DOC.svg"
                      : "/Images/File/file.png"
                  }
                  alt={fileType}
                  width="24px"
                  height="24px"
                />
              )}
              <p style={{ color: "white", fontSize: "12px" }}>Size:330 KB</p>
            </div> */}
          </div>
        </div>
      ) : (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100vw",
            height: "100vh",
            display: "flex",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "9999",
          }}
        >
          {/* Close Icon */}
          <AiOutlineClose
            onClick={() => setIsFullPreview(false)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              fontSize: "30px",
              color: "#fff",
              cursor: "pointer",
              background: "rgba(0, 0, 0, 0.6)",
              borderRadius: "50%",
              padding: "5px",
            }}
          />

          {/* Preview Content */}
          {fileType === "image" ? (
            <img
              src={fileUrl}
              alt="Full Preview"
              style={{ maxWidth: "90%", maxHeight: "90%", borderRadius: "8px" }}
            />
          ) : fileType === "pdf" ? (
            <iframe
              src={fileUrl}
              width="80%"
              height="80%"
              style={{
                backgroundColor: "#fff",
                borderRadius: "8px",
              }}
            ></iframe>
          ) : fileType === "doc" || fileType === "html" ? (
            <iframe
              src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
                fileUrl
              )}`}
              width="80%"
              height="80%"
              style={{
                backgroundColor: "#fff",
                borderRadius: "8px",
              }}
            ></iframe>
          ) : (
            <a
              href={fileUrl}
              download
              style={{
                color: "#fff",
                fontSize: "18px",
                textDecoration: "underline",
              }}
            >
              Download File
            </a>
          )}
        </div>
      )}
    </>
  );
};

export default FilePreview;
