import React from "react";
import Button from "@mui/material/Button";
import "./NoProject.css";
import { useState, useEffect } from "react";
import AddProject from "../../Modals/AddProject/AddProject";
import { getfourProjects } from "../../../services/redux/middleware/Project/project";
import { useDispatch } from "react-redux";

export default function NoProjectCard() {
  const dispatch = useDispatch();
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
          <p className="card-contract-head">No project</p>
          <p className="card-contract-sub">
            Currently you don’t have any projects.
          </p>
        </div>
      ) : (
        <div className="noproject-card">
          <p className="card-contract-head">Add project</p>
          <p className="card-contract-sub">
            Create and manage project with ease. Get started now!
          </p>

          <div className="d-flex align-items-center justify-content-center">
            <Button
              className="card-contract-btn"
              onClick={() => setModalShow(true)}
            >
              Add project
            </Button>
          </div>

          <AddProject show={modalshow} onHide={() => setModalShow(false)} />
        </div>
      )}
    </>
  );
}
