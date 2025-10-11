import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import ContractTable from "../../Components/Tables/Contracts/ContractTable";
import ContractProjectTable from "../../Components/Tables/ContractProject/ContractProjectTable";
import CreateContract from "../../Components/Cards/CreateContract/CreateContract";
import NoProjectCard from "../../Components/Cards/NoProject/NoProjectCard";
import Header from "../../Components/Header/Header";
import { useDispatch, useSelector } from "react-redux";
import {
  getAcceptClient,
  getClient,
  getContract,
} from "../../services/redux/middleware/getContract";
import { useNavigate } from "react-router-dom";
import ScreenLoader from "../../Components/loader/ScreenLoader";
import {
  getfourProjects,
  getFourProjectsAsContributor,
} from "../../services/redux/middleware/Project/project";
import { getTotalCount } from "../../services/redux/middleware/Project/project";
import AddContract from "../../Components/Modals/AddContract/AddContract";
import Button from "@mui/material/Button";
import { LatestProjContract } from "../../services/redux/middleware/Project/project";
import NoClients from "../../Components/Cards/NoClients/NoClients";
import FourClients from "../../Components/Tables/FourClients/FourClients";
import AddClients from "../../Components/Modals/AddClients/AddClients";
import AddProject from "../../Components/Modals/AddProject/AddProject";
import { dashboardCountApi } from "../../services/redux/middleware/dashboardCount";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userRole, setRole] = useState();
  const [modalShow, setModalShow] = useState(false);
  const [modalShowClients, setShowClients] = useState(false);
  const [modalShowProject, setModalShowProject] = useState(false);
  const [dashboadData, setdashboadData] = useState(null);
  const ContractData = useSelector(
    (state) => state?.getContract?.contract?.data
  );

  const FourProjectData = useSelector(
    (state) => state?.getfourProject?.myFourProjects?.data
  );

  const FourProjectDataAsContributor = useSelector(
    (state) =>
      state?.getFourProjectsAsContributor?.myFourProjectsAsContributor?.data
  );

  const ClientDataMap = useSelector(
    (state) => state?.getAllClient?.allClient?.data
  );

  const filteredClients = ClientDataMap?.associates.filter((row) => row?.user);

  useEffect(() => {
    const userrole = localStorage.getItem("role");
    setRole(userrole);
  }, [userRole]);

  useEffect(() => {
    const userid = localStorage.getItem("_id");
    dispatch(getTotalCount(userid));
    dispatch(getContract(userid));
    dispatch(getfourProjects(userid));
    dispatch(getFourProjectsAsContributor(userid));
    dispatch(LatestProjContract(userid));
  }, [dispatch]);
  const LatestContract = useSelector(
    (state) => state?.getLatestProjCon?.myData?.data?.contract
  );
  async function Addcontract() {
    setModalShow(true);
  }
  const LatestProject = useSelector(
    (state) => state?.getLatestProjCon?.myData?.data?.projects
  );

  async function AddProj() {
    setModalShowProject(true);
  }
  const totalcount = useSelector(
    (state) => state?.getTotalcount?.myTotalCount?.data
  );

  const userLoading = useSelector((state) => state?.getTotalcount);

  useEffect(() => {
    const userid = localStorage.getItem("_id");
    const data = {
      id: userid,
      page: 1,
    };

    dispatch(getClient(data));
    dispatch(getAcceptClient(data));
  }, [dispatch]);

  const dashBoardCountGet = async () => {
    const userid = localStorage.getItem("_id");
    try {
      const res = await dispatch(dashboardCountApi(userid));

      setdashboadData(res?.payload?.data);
    } catch (error) {}
  };
  useEffect(() => {
    dashBoardCountGet();
  }, [ContractData, FourProjectData, ClientDataMap]);

  async function AddClientsToDashBoard() {
    setShowClients(true);
  }

  return (
    <>
      <Header headername={"Dashboard"} />

      {userLoading.loading && <ScreenLoader />}

      {userRole === "organization" && dashboadData ? (
        <div className="org-card-r1">
          <div
            className={
              dashboadData?.oneDaycount?.projectOneDayCount < 0
                ? "org-card-inner2"
                : "org-card-inner"
            }
          >
            <div className="org-lhs-rhs">
              <div>
                <p className="total-p-txt">Total projects</p>
                <p className="total-value-p">{dashboadData?.projects}</p>
                {dashboadData?.oneDaycount?.projectOneDayCount !== 0 && (
                  <p
                    className={
                      dashboadData?.oneDaycount?.projectOneDayCount < 0
                        ? "total-minus-p"
                        : "total-plus-p"
                    }
                  >
                    {dashboadData?.oneDaycount?.projectOneDayCount < 0
                      ? "-" + dashboadData?.oneDaycount?.projectOneDayCount
                      : "+" + dashboadData?.oneDaycount?.projectOneDayCount ??
                        ""}
                  </p>
                )}
              </div>
              <div>
                {dashboadData?.oneDaycount?.projectOneDayCount !== 0 && (
                  <img
                    src={
                      dashboadData?.oneDaycount?.projectOneDayCount < 0
                        ? "/Images/Dashboard/arrow-drop-red.svg"
                        : "/Images/Dashboard/arrow-down-card.svg"
                    }
                    alt="arrow-up"
                  />
                )}
              </div>
            </div>
          </div>

          <div
            className={
              dashboadData?.oneDaycount?.clientOndayCount < 0
                ? "org-card-inner2"
                : "org-card-inner"
            }
          >
            <div className="org-lhs-rhs">
              <div>
                <p className="total-p-txt">Total clients</p>
                <p className="total-value-p">{dashboadData?.clients}</p>

                {dashboadData?.oneDaycount?.clientOndayCount !== 0 && (
                  <p
                    className={
                      dashboadData?.oneDaycount?.clientOndayCount < 0
                        ? "total-minus-p"
                        : "total-plus-p"
                    }
                  >
                    {" "}
                    {dashboadData?.oneDaycount?.clientOndayCount < 0
                      ? "-" + dashboadData?.oneDaycount?.clientOndayCount
                      : "+" + dashboadData?.oneDaycount?.clientOndayCount ?? ""}
                  </p>
                )}
              </div>
              <div>
                {dashboadData?.oneDaycount?.clientOndayCount != 0 && (
                  <img
                    src={
                      dashboadData?.oneDaycount?.clientOndayCount < 0
                        ? "/Images/Dashboard/arrow-drop-red.svg"
                        : "/Images/Dashboard/arrow-down-card.svg"
                    }
                    alt="arrow"
                  />
                )}
              </div>
            </div>
          </div>

          <div
            className={
              dashboadData?.oneDaycount?.contractOneDayCount < 0
                ? "org-card-inner2"
                : "org-card-inner"
            }
          >
            <div className="org-lhs-rhs">
              <div>
                <p className="total-p-txt">Total contracts</p>
                <p className="total-value-p">{dashboadData?.contracts}</p>

                {dashboadData?.oneDaycount?.contractOneDayCount !== 0 && (
                  <p
                    className={
                      dashboadData?.oneDaycount?.contractOneDayCount < 0
                        ? "total-minus-p"
                        : "total-plus-p"
                    }
                  >
                    {" "}
                    {dashboadData?.oneDaycount?.contractOneDayCount < 0
                      ? "-" + dashboadData?.oneDaycount?.contractOneDayCount ??
                        ""
                      : "+" + dashboadData?.oneDaycount?.contractOneDayCount ??
                        ""}
                  </p>
                )}
              </div>
              <div>
                {dashboadData?.oneDaycount?.contractOneDayCount !== 0 && (
                  <img
                    src={
                      dashboadData?.oneDaycount?.contractOneDayCount < 0
                        ? "/Images/Dashboard/arrow-drop-red.svg"
                        : "/Images/Dashboard/arrow-down-card.svg"
                    }
                    alt="arrow-up"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="Dash-body">
        {filteredClients?.length > 0 ? (
          <div className="contract-contain">
            <div className="contract-r1">
              <p className="contract-head">
                {userRole === "organization" ? "Clients" : "Associates"}
              </p>
              <div className="view-add-btn">
                <div
                  onClick={() => navigate("/Clients")}
                  className="view-all-btn-div"
                >
                  <p className="view-all-contain">
                    View all{" "}
                    <img
                      src="/Images/Dashboard/chevron-right.svg"
                      alt="arrow-icon"
                    />
                  </p>
                </div>

                <div className="Add-con-btn-div new-add-btn">
                  <Button
                    className="add-btn-contract new-add-btn"
                    onClick={() => AddClientsToDashBoard()}
                  >
                    {userRole === "organization"
                      ? "Add Client"
                      : "Add Associate"}
                  </Button>
                  <AddClients
                    show={modalShowClients}
                    onHide={() => setShowClients(false)}
                  />
                </div>
              </div>
            </div>

            <FourClients />
          </div>
        ) : (
          <div className="create-contract-div">
            <NoClients />
          </div>
        )}
      </div>
      <div className="Dash-body">
        {ContractData?.contracts?.length > 0 ? (
          <div className="contract-contain">
            <div className="contract-r1">
              <p className="contract-head">Contracts</p>
              <div className="view-add-btn">
                <div
                  onClick={() => navigate("/AllContract")}
                  className="view-all-btn-div"
                >
                  <p className="view-all-contain">
                    View all{" "}
                    <img
                      src="/Images/Dashboard/chevron-right.svg"
                      alt="arrow-icon"
                    />
                  </p>
                </div>

                <div className="Add-con-btn-div new-add-btn">
                  <Button
                    className="add-btn-contract new-add-btn"
                    onClick={() => Addcontract()}
                  >
                    Add Contract
                  </Button>
                  <AddContract
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    setModalShow={setModalShow}
                    showpreview={true}
                  />
                </div>
              </div>
            </div>

            <ContractTable />
          </div>
        ) : (
          <div className="create-contract-div">
            <CreateContract />
          </div>
        )}

        {FourProjectData?.projects?.length > 0 ||
        FourProjectDataAsContributor?.projects?.length > 0 ? (
          <div className="contract-project-contain">
            <div className="contract-r1">
              <p className="contract-head">Projects</p>
              <div className="drop-view-div view-add-btn">
                <div onClick={() => navigate("/ProjectsTable")}>
                  <p className="view-all-contain">
                    View all{" "}
                    <img
                      src="/Images/Dashboard/chevron-right.svg"
                      alt="arrow-icon"
                    />
                  </p>
                </div>
                {userRole === "organization" ? (
                  <div className="projecttable__main-headingbtn">
                    <button onClick={() => AddProj()}>Add project</button>
                  </div>
                ) : null}
                <AddProject
                  show={modalShowProject}
                  onHide={() => setModalShowProject(false)}
                />
              </div>
            </div>
            <ContractProjectTable />
          </div>
        ) : (
          <div className="noproject-div">
            <NoProjectCard />
          </div>
        )}
      </div>
    </>
  );
}
