import React from "react";
import "./ClientRequest.css";
import Header from "../../Components/Header/Header";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getContributors,
  viewproject,
} from "../../services/redux/middleware/Project/project";
import { useParams } from "react-router-dom";
import RemoveContributor from "../../Components/Modals/RemoveContributor/RemoveContributor";
import AddClientOrg from "../../Components/Modals/Organization/AddClientOrg/AddClientOrg";
import Button from "@mui/material/Button";
const ClientRequest = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { projectid } = useParams();
  const [opensearch, setOpenSearch] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [UserId, setUserId] = useState();
  const [removeClient, setRemoveClient] = useState(false);
  const [removeClientID, setRemoveClientID] = useState();
  const [removeClientName, setRemoveClientName] = useState();
  const [removeClientEmail, setRemoveClientEmail] = useState();
  const [removeClientProfile, setRemoveClientProfile] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [userRoles, setUserRoles] = useState();
  const ProjectData = useSelector(
    (state) => state?.getviewproject?.viewProject?.data
  );

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setUserRoles(userRole);
  }, [userRoles]);

  const isMobile = useMediaQuery({
    query: "(max-width: 768px)",
  });

  const MyContributors = useSelector(
    (state) => state?.getcontributors?.myContributors?.data
  );
  console.log("My Contributors are", MyContributors);

  const filteredContributors = MyContributors?.contributors?.filter((row) =>
    row?.user?.fullname?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchInput = () => {
    setOpenSearch((prevOpensearch) => !prevOpensearch);
  };

  useEffect(() => {
    const userid = localStorage.getItem("_id");
    setUserId(userid);
    const data = {
      projectId: projectid,
      page: 1,
    };
    dispatch(getContributors(data));
  }, [dispatch, projectid]);

  const handleChangePagitation = (event, value) => {
    const data = {
      projectId: projectid,
      page: value ? value : 1,
    };
    dispatch(getContributors(data));
    setCurrentPage(value);
  };

  const searchUser = (value) => {
    if (value) {
      setSearchQuery(value);
      const data = {
        projectId: projectid,
        search: value,
      };
      dispatch(getContributors(data));
    } else {
      setSearchQuery(value);
      const data = {
        projectId: projectid,
        page: value ? value : 1,
      };
      dispatch(getContributors(data));
      setCurrentPage(value);
    }
  };

  useEffect(() => {
    dispatch(viewproject(projectid));
  }, [dispatch, projectid]);
  return (
    <>
      <Header
        headername={
          <>
            <img
              src="/Images/Clients/backarrow.svg"
              alt="/"
              style={{ zIndex: 1500, position: "relative" }}
              className="header__arrow-img"
              onClick={() => navigate(-1)}
            />{" "}
            Project Contributors{" "}
          </>
        }
      />
      <div className="Dash-body">
        <div className="contract-contain pb-allcontract">
          <div className="contract-r1 pb-0">
            <p className="contract-head">Contributors</p>

            <div className="contributor-client-btn">
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
                    placeholder="Search contracts..."
                    className="search-input-contract"
                    onChange={(e) => searchUser(e.target.value)}
                  />
                </div>
              </div>

              {ProjectData?.userId === UserId && (
                <div className="Add-con-btn-div">
                  <Button
                    className="add-btn-contract"
                    onClick={() => setModalShow(true)}
                  >
                    Add Contributor
                  </Button>
                  <AddClientOrg
                    projectid={projectid}
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                  />
                </div>
              )}
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
                }}
              />
              <input
                type="text"
                placeholder="Search contracts..."
                className="search-input-contract"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
          <p className="total-contracts-txt">
            Total {MyContributors && MyContributors?.totalContributors}{" "}
            Contributors
          </p>

          <TableContainer sx={{ boxShadow: "none" }}>
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
                {filteredContributors?.map((item, index) => (
                  <TableRow
                    key={index}
                    style={{
                      height: "75px",
                      borderLeft: "1px solid #ECECEC",
                      borderRight: "1px solid #ECECEC",
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {item?.user?.profilePicture ? (
                        <img
                          src={item?.user?.profilePicture}
                          alt="profile"
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "32px",
                          }}
                        />
                      ) : (
                        <img
                          src="/Images/default-profile.png"
                          alt="profile"
                          style={{ width: "40px", height: "40px" }}
                        />
                      )}
                      <p></p>
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{
                        textAlign: "left",
                      }}
                    >
                      {item?.user?.fullname}
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
                      {item?.user?.email}
                    </TableCell>

                    <TableCell component="th" scope="row">
                      <div
                        style={{
                          display: "flex",
                          gap: "30px",
                        }}
                      >
                        {item?.project?.owner !== null ? (
                          <p
                            style={{
                              width: "128px",
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
                          >
                            Project Owner
                          </p>
                        ) : ProjectData?.userId === UserId ? (
                          <p
                            onClick={() => {
                              setRemoveClient(true);
                              setRemoveClientID(item?.user?.id);
                              setRemoveClientName(item?.user?.fullname);
                              setRemoveClientEmail(item?.user?.email);
                              setRemoveClientProfile(
                                item?.user?.profilePicture
                              );
                            }}
                            style={{
                              width: "128px",
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
                          >
                            Remove
                          </p>
                        ) : (
                          <p
                            style={{
                              width: "128px",
                              height: "39px",
                              backgroundColor: "ButtonFace",
                              color: "ButtonText",
                              fontWeight: "500",
                              fontSize: "14px",
                              fontFamily: "ClashGrotesk",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              borderRadius: "50px",
                            }}
                          >
                            Member
                          </p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <div className="page-table__pagenation">
            <Stack spacing={2}>
              <div className="custom-pagination-container">
                <Pagination
                  count={MyContributors?.totalPages}
                  page={currentPage}
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
        <RemoveContributor
          show={removeClient}
          clientid={removeClientID}
          clientname={removeClientName}
          clientemail={removeClientEmail}
          clientprofile={removeClientProfile}
          projectid={projectid}
          onHide={() => setRemoveClient(false)}
        />
      </div>
    </>
  );
};

export default ClientRequest;
