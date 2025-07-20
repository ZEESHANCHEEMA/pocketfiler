import React from "react";
import Lottie from "lottie-react";
import animationData from "./animation_lnailmmc.json";
import animationDataNew from "./Animation - 1714131415278.json"

function ScreenLoader({ text }) {
  return (
    <div
      className="position-fixed d-flex justify-content-center align-items-center"
      style={{
        zIndex: 999999999999,
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.2)",
      }}
    >
      <div className="d-flex flex-column align-items-center">
        <Lottie
          // animationData={animationData}
          animationData={animationDataNew}

          loop={true}
          autoplay={true}
          style={{ width: 700, height: 700 }}
        />
        <h2 className="text-white mt-5">{text}</h2>
      </div>
    </div>
  );
}

export default ScreenLoader;
