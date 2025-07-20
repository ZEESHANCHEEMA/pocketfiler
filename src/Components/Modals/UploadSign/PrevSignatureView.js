import React from "react";
const PrevSignatureView = ({ image, onClear }) => (
  <div style={{ position: "relative" }}>
    {image && (
      <img
        src={image}
        alt="Signature"
        style={{
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
          borderRadius: "10px",
          width: "100%",
          height: "100%",
        }}
      />
    )}
    {image && (
      <button
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          backgroundColor: "transparent",
          border: "none",
          cursor: "pointer",
        }}
        onClick={onClear}
      >
        Clear
      </button>
    )}
  </div>
);

export default PrevSignatureView;
