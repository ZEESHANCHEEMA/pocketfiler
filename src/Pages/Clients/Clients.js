import "./clients.css";
import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import React, { useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import AddClients from "../../Components/Modals/AddClients/AddClients";
import RemoveClient from "../../Components/Modals/RemoveClient/RemoveClient";
import Header from "../../Components/Header/Header";
import { useMediaQuery } from "react-responsive";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { getClient } from "../../services/redux/middleware/getContract";
import ScreenLoader from "../../Components/loader/ScreenLoader";
import { getAcceptClient } from "../../services/redux/middleware/getContract";
import Calendar from "react-calendar";

const Clients = () => {
  const dispatch = useDispatch();
  const [userRoles, setUserRoles] = useState();
  const [userID, setUserID] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [removeClient, setRemoveClient] = useState(false);
  const [opensearch, setOpenSearch] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [removeAssociate, setRemoveAssociate] = useState();
  const [removeAssociateName, setRemoveAssociateName] = useState();
  const [removeProfile, setRemoveProfile] = useState();
  const [value, setValue] = useState(new Date().getFullYear());
  const [showDropdown, setShowDropdown] = useState(false);
  const ClientData = useSelector((state) => state?.getAllClient);
  const ClientDataMap = useSelector(
    (state) => state?.getAllClient?.allClient?.data
  );
  // const filteredClients = ClientDataMap?.associates.filter(
  //   (row) =>
  //     row?.user?.email?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
  //     row?.user?.fullname?.toLowerCase().includes(searchQuery?.toLowerCase())
  // );
  const searchUsers = (search) => {
    const userid = localStorage.getItem("_id");
    const data = {
      id: userid,
      search: search,
    };
    dispatch(getClient(data));
  };

  useEffect(() => {
    searchQuery?.length > 0 ? searchUsers(searchQuery) : getAllClients();
  }, [searchQuery]);

  useEffect(() => {
    getAllClients();
  }, [value]);

  const getAllClients = () => {
    const userid = localStorage.getItem("_id");
    setUserID(userid);
    const data = {
      id: userid,
      page: 1,
      year: value,
    };
    dispatch(getClient(data));
    dispatch(getAcceptClient(data));
  };
  const isMobile = useMediaQuery({
    query: "(max-width: 768px)",
  });
  const handleSearchInput = () => {
    setOpenSearch((prevOpensearch) => !prevOpensearch);
  };
  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setUserRoles(userRole);
  }, []);
  const handleChangePagitation = (event, value) => {
    const userid = localStorage.getItem("_id");
    const data = {
      id: userid,
      page: value ? value : 1,
    };
    dispatch(getClient(data));
    setCurrentPage(value);
  };
  const handleYearSelect = (selectedDate) => {
    setValue(selectedDate.getFullYear());
    setShowDropdown(false);
  };
  return (
    <>
      <Header
        headername={userRoles === "organization" ? "Clients" : "Associate"}
      />
      <>{ClientData?.loading && <ScreenLoader />}</>
      <div className="Dash-body">
        <div className="contract-contain pb-allcontract">
          <div className="contract-r1 pb-0">
            {userRoles === "organization" ? (
              <p className="contract-head">Clients</p>
            ) : (
              <p className="contract-head">Associate</p>
            )}

            <div className="contract-rhs">
              <div className="search-mb-contain">
                <div
                  className={isMobile ? "d-block" : "d-none"}
                  onClick={handleSearchInput}
                >
                  <img src="/Images/Contract/search.svg" alt="search" />
                </div>
              </div>

              <div className={isMobile ? "d-none" : "search-input-icon"}>
                <img
                  src="/Images/Projects/search.svg"
                  alt="search-icon"
                  className="search-icon"
                  style={{
                    position: "absolute",
                    left: "22px",
                    top: "45%",
                    transform: "translateY(-50%)",
                  }}
                />
                <input
                  type="text"
                  placeholder={
                    userRoles === "user"
                      ? "Search Associates..."
                      : "Search Clients..."
                  }
                  className="search-input-contract"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="drop-main">
                <Dropdown
                  className="drop-week"
                  show={showDropdown}
                  onToggle={() => setShowDropdown(!showDropdown)}
                >
                  <Dropdown.Toggle
                    id="dropdown-basic"
                    className="dropdown-week"
                  >
                    <img
                      src="/Images/Projects/calender.svg"
                      alt="/"
                      className="calendar-dropimg"
                    />
                    <span>{value ?? "This Year"}</span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Calendar
                      view="decade"
                      value={value}
                      defaultValue={value}
                      defaultActiveStartDate={new Date(2030, 0, 1)}
                      maxDate={new Date(2025, 0, 1)}
                      onClickYear={handleYearSelect}
                    />
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <div className="Add-con-btn-div">
                <Button
                  className="add-btn-contract"
                  onClick={() => setModalShow(true)}
                >
                  {userRoles == "user" ? "Add associate" : "Add Client"}
                </Button>
                <AddClients
                  show={modalShow}
                  onHide={() => setModalShow(false)}
                />
              </div>
            </div>
          </div>
          {opensearch && (
            <div className="search-input-icon  ">
              <img
                src="/Images/Projects/search.svg"
                alt="search-icon"
                className="search-icon-allcontract"
                style={{
                  position: "absolute",
                  left: "22px",
                  top: "45%",
                  // transform: "translateY(-50%)",
                }}
              />
              <input
                type="text"
                placeholder={
                  userRoles === "user"
                    ? "Search Associates..."
                    : "Search Clients..."
                }
                className="search-input-contract"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
          {userRoles === "user" ? (
            <p className="total-contracts-txt">
              Total {ClientDataMap && ClientDataMap?.totalAssociates} Associate
              {ClientDataMap?.totalAssociates > 1 ? "s" : ""}
            </p>
          ) : (
            <p className="total-contracts-txt">
              Total {ClientDataMap && ClientDataMap?.totalAssociates} Client
              {ClientDataMap?.totalAssociates > 1 ? "s" : ""}
            </p>
          )}
          {ClientDataMap?.associates?.length > 0 ? (
            <div>
              <TableContainer sx={{ boxShadow: "none", minHeight: "400px" }}>
                <Table sx={{ overflowX: "auto" }} aria-label="simple table">
                  <TableHead style={{ height: "51px" }}>
                    <TableRow className="columns-name">
                      <TableCell
                        className="column-head"
                        style={{ textAlign: "left" }}
                      >
                        Status
                      </TableCell>
                      <TableCell
                        className="column-head"
                        style={{ textAlign: "left" }}
                      >
                        Full name
                      </TableCell>
                      <TableCell
                        className="column-head"
                        style={{ textAlign: "left" }}
                      >
                        Email address
                      </TableCell>
                      <TableCell
                        className="column-head"
                        style={{ textAlign: "left" }}
                      >
                        Contact number
                      </TableCell>

                      <TableCell
                        className="column-head"
                        style={{ textAlign: "left" }}
                      ></TableCell>
                    </TableRow>
                  </TableHead>
                  {ClientDataMap?.associates?.length > 0 ? (
                    <TableBody>
                      {ClientDataMap?.associates?.map((row, index) => (
                        <TableRow
                          style={{
                            height: "75px",
                            borderLeft: "1px solid #ECECEC",
                            borderRight: "1px solid #ECECEC",
                          }}
                        >
                          <TableCell component="th" scope="row">
                            <p
                              style={{
                                color:
                                  row?.associate?.status == "pending"
                                    ? "#5F6D86"
                                    : row?.associate?.status == "rejected"
                                    ? "#D32121"
                                    : "#166FBF ",

                                fontSize: "14px",
                                fontStyle: "normal",
                                fontWeight: "500",
                                lineHeight: "160%",
                                textAlign: "center",
                                background:
                                  row?.associate?.status == "pending"
                                    ? "#F6F6F6"
                                    : row?.associate?.status == "rejected"
                                    ? "#D3212114"
                                    : "#F1F6FB ",
                                borderRadius: "50px",
                                height: "39px",
                                width: "97px",
                                letterSpacing: "0.8px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                textTransform: "capitalize",
                              }}
                            >
                              {row?.associate?.status}
                            </p>
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            style={{
                              color: "#0A1126",
                              fontSize: "14px",
                              fontStyle: "normal",
                              fontWeight: "500",
                              lineHeight: "160%",
                              textAlign: "left",
                              letterSpacing: "0.8px",
                            }}
                          >
                            {row?.user?.fullname
                              ? row?.user?.fullname
                              : "- - -"}
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            style={{
                              color: "#0A1126",
                              fontSize: "14px",
                              fontStyle: "normal",
                              fontWeight: "500",
                              lineHeight: "160%",
                              textAlign: "left",
                              letterSpacing: "0.8px",
                            }}
                          >
                            {row?.user?.email}
                          </TableCell>

                          <TableCell
                            component="th"
                            scope="row"
                            style={{
                              color: "#0A1126",
                              fontSize: "14px",
                              fontStyle: "normal",
                              fontWeight: "500",
                              lineHeight: "160%",
                              textAlign: "left",
                              fontFamily: "ClashGrotesk",
                              letterSpacing: "0.8px",
                            }}
                          >
                            {row?.user?.phoneNo
                              ? row?.user?.phoneNo
                              : "-    -    -"}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            <p
                              onClick={() => {
                                setRemoveClient(true);
                                setRemoveAssociate(
                                  row?.associate?._id ||
                                    row?.associate?.associateid ||
                                    row?.associate?.id
                                );
                                setRemoveAssociateName(row?.user?.fullname);
                                setRemoveProfile(row?.user?.profilePicture);
                              }}
                              style={{
                                color: "#0A1126",
                                fontSize: "14px",
                                fontStyle: "normal",
                                fontWeight: "500",
                                lineHeight: "15.99px",
                                textAlign: "center",
                                cursor: "pointer",
                                border: "1px solid #EDEDED",
                                borderRadius: "12px",
                                height: "39px",
                                width: "105px",
                                letterSpacing: "0.8px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              Remove
                            </p>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  ) : (
                    <div className="pt-2 ps-1">
                      <h5>No Data Found</h5>
                    </div>
                  )}
                </Table>
              </TableContainer>
              <div className="page-table__pagenation">
                <Stack spacing={2}>
                  <div className="custom-pagination-container">
                    <Pagination
                      count={ClientDataMap?.totalPages}
                      page={currentPage}
                      // count={10}
                      size={"18px"}
                      sx={{
                        fontSize: "1px",
                      }}
                      siblingCount={isMobile ? 0 : 1}
                      boundaryCount={1}
                      shape="rounded"
                      onChange={handleChangePagitation}
                    />
                  </div>
                </Stack>
              </div>
            </div>
          ) : (
            <div className="empty__state-main">
              <div className="empty__state">
                <img src="/Images/Clients/users.svg" alt="/" />
                <p className="empty__state-head">
                  No {userRoles === "organization" ? "Client" : "Associate"}{" "}
                  Available
                </p>
                <p className="empty__state-p">
                  You have currently no{" "}
                  {userRoles === "organization" ? "Client" : "Associate"} at
                  this moment
                </p>
                <button
                  className="empty__state-btn"
                  onClick={() => setModalShow(true)}
                >
                  {userRoles == "user" ? "Add associate" : "Add Client"}
                </button>
                <AddClients
                  show={modalShow}
                  onHide={() => setModalShow(false)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <RemoveClient
        show={removeClient}
        removeassociate={removeAssociate}
        removeassociatename={removeAssociateName}
        removeProfile={removeProfile}
        onHide={() => setRemoveClient(false)}
      />
    </>
  );
};

export default Clients;
