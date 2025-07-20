import React from "react";
import Button from "@mui/material/Button";
import "./NoClients.css";
import { useState, useEffect } from "react";
import AddProject from "../../Modals/AddProject/AddProject";
import { getfourProjects } from "../../../services/redux/middleware/Project/project";
import { useDispatch } from "react-redux";
import AddClients from "../../Modals/AddClients/AddClients";

export default function NoClients() {
  const [modalshow, setModalShow] = useState(false);
  const [userRoles, setUserRoles] = useState();

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setUserRoles(userRole);
  }, [userRoles]);

  return (
    <>
      {userRoles === "user" ? (
        <div className="noproject-card2">
          <p className="card-contract-head">No Associate</p>
          <p className="card-contract-sub">
            Currently, you don’t have any Associate.
          </p>
          <div className="d-flex align-items-center justify-content-center">
            <Button
              className="card-contract-btn"
              onClick={() => setModalShow(true)}
            >
              {userRoles === "user" ? "Add Associate" : "Add Client"}
            </Button>
          </div>

          <AddClients show={modalshow} onHide={() => setModalShow(false)} />
        </div>
      ) : (
        <div className="noproject-card">
          <p className="card-contract-head">No Clients</p>
          <p className="card-contract-sub">
            Currently, you don’t have any Client.
          </p>

          <div className="d-flex align-items-center justify-content-center">
            <Button
              className="card-contract-btn"
              onClick={() => setModalShow(true)}
            >
              {userRoles === "user" ? "Add Associate" : "Add Client"}
            </Button>
          </div>

          <AddClients show={modalshow} onHide={() => setModalShow(false)} />
        </div>
      )}
    </>
  );
}
