import React, { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import styles from "./SignaturePad.module.css"; // Import CSS module
import { API_URL } from "../../../services/client";
import api from "../../../services/apiInterceptor";
import { ErrorToast } from "../../toast/Toast";

const SignaturePad = ({ getSinature }) => {
  const sigCanvas = useRef(null);
  const handleSave = async () => {
    if (sigCanvas.current.isEmpty()) {
      ErrorToast("Please sign before saving!");

      return;
    }

    const signatureBase64 = sigCanvas.current.toDataURL("image/png");

    const blob = await fetch(signatureBase64).then((res) => res.blob());

    const randomName = Math.random().toString(36).slice(2, 11);
    const formData = new FormData();
    formData.append("file", blob, `${randomName}.png`);
    try {
      const res = await api.post(`${API_URL}/upload/uploadimage`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      getSinature(res);
      localStorage.setItem("prevSignature", res?.data?.data);
      console.log("Upload Success:", res.data);
    } catch (error) {
      console.error("Upload Error:", error);
    }
  };

  const handleClear = () => {
    sigCanvas.current.clear();
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Draw Your Signature</h2>
      <div className={styles.canvasWrapper}>
        <SignatureCanvas
          ref={sigCanvas}
          penColor="black"
          canvasProps={{
            height: 200,
            className: styles.signatureCanvas,
          }}
        />
      </div>
      <div className={styles.buttonGroup}>
        <button className={styles.button} onClick={handleSave}>
          Save
        </button>
        <button
          className={`${styles.button} ${styles.clearButton}`}
          onClick={handleClear}
        >
          Clear
      </button>
      </div>
    </div>
  );
};

export default SignaturePad;
