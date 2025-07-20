import { useLocation, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { useEffect, useState } from "react";
import { getTermAndConditions } from "../../services/redux/middleware/signin";
import { useDispatch } from "react-redux";
import parse from "html-react-parser";

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [htmlContent, setHtmlContent] = useState("");

  const title = location.state?.title || "Privacy Policy"; // Default title
  const TermAndConditionDataGet = async () => {
    console.log(title, "dsdsdsdsdsdsdsds");
    try {
      const res = await dispatch(getTermAndConditions());
      console.log(res, "resresresresresjjjjjjj");
      setHtmlContent(res?.payload?.data?.description || "No data available");
    } catch (error) {
      console.log(error, "errorerrorerror");
    }
  };
  useEffect(() => {
    title == "Terms" && TermAndConditionDataGet();
  }, [title]);

  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
      <div style={styles.headerContainer}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          <IoArrowBack size={24} color="#000" />
        </button>
        <h2 style={styles.header}>{title}</h2>
      </div>
      {title == "Terms" ? (
        <div
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            margin: "20px auto",
          }}
        >
          {parse(htmlContent)}
        </div>
      ) : (
        <iframe
          src="https://pocketfiler.com/privacypolicy.html"
          style={{ width: "100%", height: "calc(100% - 50px)", border: "none" }}
          title={title}
        ></iframe>
      )}
    </div>
  );
};

const styles = {
  headerContainer: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    borderBottom: "1px solid #ccc",
  },
  backButton: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    marginRight: "10px",
  },
  header: {
    fontSize: "20px",
    fontWeight: "bold",
  },
};

export default PrivacyPolicy;
