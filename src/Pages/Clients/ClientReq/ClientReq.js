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
import AddClients from "../../../Components/Modals/AddClients/AddClients";
import Header from "../../../Components/Header/Header";
import { useMediaQuery } from "react-responsive";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { getAcceptClient } from "../../../services/redux/middleware/getContract";
import ScreenLoader from "../../../Components/loader/ScreenLoader";
import { updateClient } from "../../../services/redux/middleware/getContract";
import { ErrorToast, SuccessToast } from "../../../Components/toast/Toast";
import { useNavigate } from "react-router-dom";

const ClientReq = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userRoles, setUserRoles] = useState();
  // const [userID, setUserID] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState();
  const [modalShow, setModalShow] = useState(false);
  const [removeClient, setRemoveClient] = useState(false);
  const [opensearch, setOpenSearch] = useState(false);
  const [email, setEmail] = useState();
  const [userID, setUserId] = useState();
  const [loader, setLoader] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const AcceptClientData = useSelector((state) => state?.getAcceptClient);
  const AcceptClientDataMap = useSelector(
    (state) => state?.getAcceptClient?.allClient?.data
  );

  console.log("AcceptClientData", AcceptClientData);

  // const filteredClients = AcceptClientDataMap?.associates.filter((row) =>
  //   row?.user?.fullname?.toLowerCase().includes(searchQuery?.toLowerCase())
  // );

  const filteredClients = AcceptClientDataMap?.associates.filter(
    (row) =>
      row?.user?.fullname?.toLowerCase().includes(searchQuery?.toLowerCase()) ??
      row
  );

  useEffect(() => {
    const userid = localStorage.getItem("_id");
    console.log("user id ", userid);
    setUserId(userid);
    const data = {
      id: userid,
      page: 1,
    };
    dispatch(getAcceptClient(data));
  }, []);

  const handleChangePagitation = (event, value) => {
    const userid = localStorage.getItem("_id");

    const data = {
      id: userid,
      page: value ? value : 1,
    };
    dispatch(getAcceptClient(data));
    setCurrentPage(value);
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
  }, [userRoles]);

  // for update associate

  useEffect(() => {
    const userid = localStorage.getItem("_id");
    setUserId(userid);
  }, []);

  async function AcceptedClient(id) {
    setLoader(true);
    try {
      const data = {
        id: id,
        status: "accepted",
      };
      dispatch(updateClient(data)).then((res) => {
        if (res?.payload?.status === 200) {
          console.log(res.payload.message);
          setLoader(false);
          SuccessToast("Associate accepted Successfully");

          const data = {
            id: userID,
            page: 1,
          };
          dispatch(getAcceptClient(data));
        } else {
          console.log(res);
          setLoader(false);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
  async function RejectedClient(associateid) {
    setLoader(true);
    try {
      const data = {
        id: associateid,
        status: "rejected",
      };
      dispatch(updateClient(data)).then((res) => {
        if (res?.payload?.status === 200) {
          console.log(res.payload.message);
          setLoader(false);
          SuccessToast("Associate Rejected Successfully");
          const data = {
            id: userID,
            page: 1,
          };
          dispatch(getAcceptClient(data));
        } else {
          console.log(res);
        }
      });
    } catch (error) {
      console.log(error);
      ErrorToast("error");
    }
  }

  return (
    <>
      <Header
        headername={
          userRoles === "organization"
            ? "Clients Requests"
            : "Associate Requests"
        }
      />
      {loader && <ScreenLoader />}

      <div className="Dash-body">
        <div className="contract-contain pb-allcontract">
          <div className="contract-r1 pb-0">
            {userRoles === "organization" ? (
              <p className="contract-head">Clients Requests</p>
            ) : (
              <p className="contract-head">Associate Requests</p>
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
          <p className="total-contracts-txt">
            Total {filteredClients && filteredClients.length}
            {filteredClients && filteredClients.length === 1
              ? " Request"
              : " Requests"}
          </p>
          {AcceptClientData?.loading && <ScreenLoader />}
          {filteredClients?.length > 0 ? (
            <TableContainer sx={{ boxShadow: "none", minHeight: "400px" }}>
              <Table sx={{ overflowX: "auto" }} aria-label="simple table">
                <TableHead style={{ height: "51px" }}>
                  <TableRow className="columns-name">
                    <TableCell
                      className="column-head"
                      style={{ textAlign: "left" }}
                    >
                      Profile
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
                      style={{ textAlign: "left", width: "235px" }}
                    ></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredClients?.map((row, index) => {
                    const user = row?.inviter?.id ? row?.inviter : row?.user;
                    return (
                      <TableRow
                        style={{
                          height: "75px",
                          borderLeft: "1px solid #ECECEC",
                          borderRight: "1px solid #ECECEC",
                        }}
                      >
                        <TableCell component="th" scope="row">
                          <img
                            src={
                              user?.profilePicture
                                ? user?.profilePicture
                                : "Images/default-profile.png"
                            }
                            alt="profile"
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "8px",
                            }}
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          scope="row"
                          style={{
                            textAlign: "left",
                          }}
                        >
                          {user?.fullname}
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
                            // cursor: "pointer",
                            letterSpacing: "0.8px",
                          }}
                        >
                          {user?.email}
                        </TableCell>

                        <TableCell component="th" scope="row">
                          <div
                            style={{
                              display: "flex",
                              gap: "30px",
                            }}
                          >
                            <p
                              style={{
                                width: "82px",
                                height: "39px",
                                background: "#166FBF",
                                color: "#FFFFFF",
                                fontWeight: "500",
                                fontSize: "14px",
                                fontFamily: "ClashGrotesk",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: "50px",
                                cursor: "pointer",
                              }}
                              onClick={() => AcceptedClient(row?.associate?.id)}
                            >
                              Accept
                            </p>
                            <p
                              style={{
                                width: "82px",
                                height: "39px",
                                background: "#D32121",
                                color: "#FFFFFF",
                                fontWeight: "500",
                                fontSize: "14px",
                                fontFamily: "ClashGrotesk",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: "50px",
                                cursor: "pointer",
                              }}
                              onClick={() => RejectedClient(row?.associate?.id)}
                            >
                              Reject
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <div className="empty__state-main">
              <div className="empty__state" style={{ height: "454px" }}>
                <img src="/Images/Clients/user.svg" alt="/" />
                <p className="empty__state-head">
                  No {userRoles === "organization" ? "Client" : "Associate"}{" "}
                  Request
                </p>
                <p className="empty__state-p">
                  You have currently no{" "}
                  {userRoles === "organization" ? "Client" : "Associate"}{" "}
                  requests at this moment
                </p>
              </div>
            </div>
          )}
          <div className="page-table__pagenation">
            <Stack spacing={2}>
              <div className="custom-pagination-container">
                <Pagination
                  count={AcceptClientDataMap?.totalPages}
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
      </div>
    </>
  );
};

export default ClientReq;
