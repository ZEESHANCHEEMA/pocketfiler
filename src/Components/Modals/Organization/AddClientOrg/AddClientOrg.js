import Button from "@mui/material/Button";
import Modal from "react-bootstrap/Modal";
import "./AddClientOrg.css";
import React, { useState, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { getClient } from "../../../../services/redux/middleware/getContract";
import ScreenLoader from "../../../loader/ScreenLoader";
import { useDispatch, useSelector } from "react-redux";
import {
  addProjectClient,
  getContributors,
  getContributorsNopaging,
} from "../../../../services/redux/middleware/Project/project";
import { SuccessToast, ErrorToast } from "../../../toast/Toast";
import { userDetails } from "../../../../services/redux/middleware/signin";

export default function AddClientOrg(props) {
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [userID, setUserID] = useState("");
  const [clientsInfo, setClientsInfo] = useState([{}]);
  const [email, setEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [AllContriButers, setAllContriButers] = useState([]);

  const Clients = useSelector((state) => state?.getAllClient?.allClient?.data);
  const filteredClients = Clients?.associates?.filter((item) =>
    item?.user?.email?.toLowerCase().includes(searchQuery?.toLowerCase())
  );

  const getAllCLient = () => {
    const userid = localStorage.getItem("_id");
    console.log("user id ", userid);
    setUserID(userid);
    const data = {
      id: userid,
    };
    dispatch(getClient(data));
  };
  useEffect(() => {
    getAllCLient();
  }, []);

  const fetchDataAll = async () => {
    try {
      const data = {
        projectId: props.projectid,
      };
      const res = await dispatch(getContributorsNopaging(data));
      setAllContriButers(res?.payload?.data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchDataAll();
  }, []);

  const allContributersEmailFilter = AllContriButers
    ? AllContriButers.map((item) => item?.user?.email)
    : [];
  const handleSelectClientAgain = (item, index) => {
    const updatedClientsInfo = [...clientsInfo];
    updatedClientsInfo[index] = { ...item }; // Update the client information for the selected input box
    setClientsInfo(updatedClientsInfo);
  };

  const toggleAddMore = () => {
    setClientsInfo([...clientsInfo, {}]); // Add an empty object when adding more sections
  };

  const removeAddMoreSection = (index) => {
    const updatedClientsInfo = [...clientsInfo];
    updatedClientsInfo.splice(index, 1); // Remove the client info at the specified index
    setClientsInfo(updatedClientsInfo);
  };
  async function handleAddClient() {
    setLoader(true);

    try {
      if (!!email && !!clientsInfo[0]?.id) {
        ErrorToast("Both email and clients cannot be present at the same time");
        setLoader(false);
        return;
      }

      if (!email && clientsInfo.length === 0) {
        ErrorToast("At least one of email or clients is required");
        setLoader(false);
        return;
      }

      if (
        email &&
        !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
      ) {
        ErrorToast("Invalid email address");
        setLoader(false);
        return;
      }
      const userData = await dispatch(userDetails(userID));

      if (email === userData?.payload?.data?.email) {
        ErrorToast("You cannot request to yourself.");
        setLoader(false);
        return;
      }

      const data = {
        projectId: props.projectid,
        clients: clientsInfo,
        userId: userID,
        email: email,
      };

      dispatch(addProjectClient(data)).then((res) => {
        if (res?.payload?.status === 200) {
          setLoader(false);
          const apiData = {
            projectId: props.projectid,
            page: 1,
          };
          dispatch(getContributors(apiData));
          getAllCLient();
          setClientsInfo([{}]);
          fetchDataAll();
          SuccessToast("Client Added Successfully in Project");
          props.onHide();
        } else {
          setLoader(false);
          ErrorToast(res?.payload?.message);
        }
      });
    } catch (error) {
      console.error("Error:", error);
    }
  }
  console.log(clientsInfo, "clientsInfoclientsInfoclientsInfo");
  return (
    <>
      {loader && <ScreenLoader />}
      <Modal
        {...props}
        // size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="add-client-org-modal"
      >
        <Modal.Header
          style={{ padding: "70px", paddingBottom: "0px", paddingTop: "60px" }}
        >
          <Modal.Title
            id="contained-modal-title-vcenter"
            className="add-project__header add-contract-header"
          >
            <div className="add-contract-m-heading">
              <h6 className="mb-0 ">Add client</h6>
              <p>Choose a client below or invite by email</p>
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
          style={{ padding: "70px", paddingTop: "50px", paddingBottom: "60px" }}
        >
          <div className="add-project-body">
            <div className="add-contract__input">
              <label className="contract-name-head">Email address</label>
              <input
                type="email"
                placeholder="Enter Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="Or-div-org">
              <p className="or-add-client">Or add existing client</p>
              <hr className="custom-hr-org"></hr>
            </div>

            <div>
              {/* <div> */}
              {/* <div className=" " onClick={toggleAddMore}>
                {clientsInfo?.length == 0 && (
                  <>
                    <div className="add-m-clients ">
                      <img
                        src="/Images/Clients/plus-circle.svg"
                        alt="Add-more-clients "
                      />
                      <p className="add-m-txt ">Add more clients</p>
                    </div>
                  </>
                )}
              </div> */}

              {clientsInfo.map((client, index) => (
                <div key={index} className="add-more-whole ">
                  {index !== 0 && (
                    <label className="contract-name-head mt-contract-name">
                      Add client
                    </label>
                  )}
                  {index == 0 && (
                    <label className="contract-name-head">Add client</label>
                  )}

                  <div className="drop-main-org w-100 ">
                    <Dropdown className="drop-add-client-org w-100 ">
                      <Dropdown.Toggle className="dropdown-add-client-org2 ">
                        {client
                          ? client?.email || "Select Client"
                          : "Select Client"}
                        <img
                          className="dropdown__image-project"
                          src="/Images/HelpCenter/arrow.svg"
                          alt="arrow"
                        />
                      </Dropdown.Toggle>

                      {index == 0 &&
                        client?.email &&
                        clientsInfo?.length == 1 && (
                          <img
                            src="/Images/Clients/cancel.svg"
                            alt="Cross"
                            style={{ marginLeft: 16 }}
                            onClick={() => setClientsInfo([{}])}
                          />
                        )}
                      <Dropdown.Menu>
                        <div className="search-client-input">
                          <input
                            type="text"
                            placeholder="Search by email"
                            value={searchQuery}
                            className="no-project-item"
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        {filteredClients?.length > 0 ? (
                          filteredClients
                            ?.filter(
                              (item) =>
                                !clientsInfo.some(
                                  (selectedClient) =>
                                    selectedClient?.id == item?.user?.id
                                )
                            )
                            .filter(
                              (item) =>
                                item?.associate?.status !== "pending" &&
                                item?.associate?.status !== "rejected" &&
                                !allContributersEmailFilter?.includes(
                                  item?.user?.email
                                )
                            )
                            .map((item, idx) => (
                              <Dropdown.Item
                                key={idx}
                                onClick={() =>
                                  handleSelectClientAgain(item?.user, index)
                                }
                              >
                                {item?.user?.email}
                              </Dropdown.Item>
                            ))
                        ) : (
                          <div className="no-project-item">
                            <p>No Client Found</p>
                          </div>
                        )}
                      </Dropdown.Menu>
                    </Dropdown>
                    <div>
                      {index !== 0 && ( // Render cross icon only if index is not 0
                        <img
                          src="/Images/Clients/cancel.svg"
                          alt="Cross"
                          onClick={() => removeAddMoreSection(index)}
                        />
                      )}
                    </div>
                  </div>

                  {index === clientsInfo?.length - 1 &&
                    clientsInfo[index]?.id && (
                      <div className="add-m-clients" onClick={toggleAddMore}>
                        <img
                          src="/Images/Clients/plus-circle.svg"
                          alt="Add-more-clients"
                        />
                        <p className="add-m-txt">Add more clients</p>
                      </div>
                    )}
                </div>
              ))}
            </div>

            <div className="add-contract__main-btn">
              <Button
                className="continue-add-btn "
                // onClick={() => setModalShow(true)}
                onClick={handleAddClient}
              >
                Add Client
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
