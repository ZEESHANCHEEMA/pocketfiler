// import React from 'react';
import Header from "../../Components/Header/Header";
import "./projecttable.css";
import IconButton from "@mui/material/IconButton";

import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Dropdown from "react-bootstrap/Dropdown";
import AddProject from "../../Components/Modals/AddProject/AddProject";
import UpdateProject from "../../Components/Modals/UpdateProject/UpdateProject";
import { useMediaQuery } from "react-responsive";
import { useDispatch, useSelector } from "react-redux";
import { getAllProject } from "../../services/redux/middleware/Project/project";
import ScreenLoader from "../../Components/loader/ScreenLoader";
import { useNavigate } from "react-router-dom";
import AddClientOrg from "../../Components/Modals/Organization/AddClientOrg/AddClientOrg";
import { LatestProjContract } from "../../services/redux/middleware/Project/project";
import Calendar from "react-calendar";
import { toSentenceCase } from "../../utils/helperFunction";

const ProjectsTable = () => {
  const isMobile = useMediaQuery({
    query: "(max-width: 768px)",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [USERID, setUserId] = useState("");
  const [opensearch, setOpenSearch] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [selectedView, setSelectedView] = useState("");
  const [selectedEdit, setSelectedEdit] = useState("");
  const [selectedAddClient, setSelectedAddClient] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const [modalShowUpdate, setModalShowUpdate] = useState(false);
  const [modalShowClient, setModalShowClient] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [value, setValue] = useState(new Date().getFullYear());
  const [showDropdown, setShowDropdown] = useState(false); // State to manage the dropdown visibility
  const handleSearchInput = () => {
    setOpenSearch((prevOpensearch) => !prevOpensearch);
  };

  const ConvertDate = (originalDateStr) => {
    const originalDate = new Date(originalDateStr);
    const formattedDate = originalDate.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
    return formattedDate;
  };

  const userLoading = useSelector((state) => state?.getAllProjects);
  const ProjectAllData = useSelector(
    (state) => state?.getAllProjects?.myallProjects
  );

  const handleChangePagitation = (event, value) => {
    const userid = localStorage.getItem("_id");
    const data =
      debouncedSearchQuery?.length > 0
        ? {
            id: userid,
            search: debouncedSearchQuery,
            page: value ? value : 1,
          }
        : {
            id: userid,
            page: value ? value : 1,
          };
    dispatch(getAllProject(data));
    setCurrentPage(value);
  };

  const handleClient = (projectId) => {
    console.log("Selected Add client row is", projectId);
    setSelectedAddClient(projectId);
    setModalShowClient(true);
  };

  const handleViewProject = (projectLike) => {
    const pid =
      (projectLike && projectLike._id) ||
      (projectLike && projectLike.id) ||
      projectLike;
    console.log("Selected View Project Row is", pid);
    setSelectedView(pid);
    if (pid) {
      navigate(`/ProjectActivities/${pid}`);
    }
  };

  const handleEditProject = (proId) => {
    console.log("Project ID:", proId);
    setSelectedEdit(proId);
    setModalShowUpdate(true);
  };

  // Debounce search query to prevent API calls on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const getAllProjects = () => {
      const userid = localStorage.getItem("_id");
      console.log("user id ", userid);
      setUserId(userid);

      const data =
        debouncedSearchQuery?.length > 0
          ? {
              id: userid,
              search: debouncedSearchQuery,
            }
          : {
              id: userid,
              page: 1,
              year: value,
            };

      dispatch(getAllProject(data));
      dispatch(LatestProjContract(userid));
      setCurrentPage(1);
    };

    getAllProjects();
  }, [value, debouncedSearchQuery, dispatch]);

  async function AddProj() {
    setModalShow(true);
  }

  const [userRole, setRole] = useState();

  useEffect(() => {
    const userrole = localStorage.getItem("role");
    setRole(userrole);
  }, [userRole]);

  const handleYearSelect = (selectedDate) => {
    setSearchQuery("");
    setValue(selectedDate.getFullYear());
    setShowDropdown(false); // Close the dropdown when a date is selected
  };

  return (
    <>
      <Header headername={"Projects"} />
      {userLoading.loading && <ScreenLoader />}

      <>
        {/* {ProjectAllData?.data?.projects?.length > 0 ? ( */}
        <div className="profit-table">
          <div
            className="row-3 profittable__main "
            style={{ overflowX: "auto" }}
          >
            <div className="profit-table__main-data">
              <div className="table-above-row-info">
                <div>
                  <h6 className="user-heading mb-0"> Projects </h6>
                </div>

                <div className="projecttable__main-head">
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
                      placeholder="Search projects..."
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
                  {userRole === "organization" ? (
                    <div className="projecttable__main-headingbtn">
                      <button onClick={() => AddProj()}>Add project</button>
                    </div>
                  ) : null}

                  <AddProject
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                  />
                </div>
              </div>

              {ProjectAllData?.data?.projects?.length > 0 ? (
                <>
                  <TableContainer
                    sx={{
                      boxShadow: "none",
                      minHeight: "530px",
                      height: "300px",
                    }}
                    className="project-table-container"
                  >
                    <Table sx={{ overflowX: "auto" }} aria-label="simple table">
                      <TableHead
                        style={{ height: "51px", borderRadius: "15px" }}
                      >
                        <TableRow className="columns-name">
                          <TableCell
                            className="column-head"
                            style={{
                              textAlign: "left",
                              borderTopLeftRadius: "15px",
                              // width: isMobile ? "35%" : "20%"
                            }}
                          >
                            Date
                          </TableCell>
                          <TableCell
                            className="column-head"
                            style={{ textAlign: "left" }}
                          >
                            Title
                          </TableCell>
                          <TableCell
                            className="column-head"
                            style={{ textAlign: "left" }}
                          >
                            Description
                          </TableCell>
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
                            Type
                          </TableCell>
                          <TableCell
                            className="column-head"
                            style={{
                              textAlign: "left",
                              borderTopRightRadius: "15px",
                            }}
                          ></TableCell>
                        </TableRow>
                      </TableHead>
                      {ProjectAllData?.data?.projects?.length > 0 ? (
                        <TableBody>
                          {ProjectAllData?.data?.projects.map((row, index) => (
                            <TableRow
                              style={{ height: "75px" }}
                              onClick={() => handleViewProject(row)}
                            >
                              <TableCell
                                component="th"
                                scope="row"
                                style={{
                                  color: "#606060",
                                  fontSize: "14px",
                                  fontStyle: "normal",
                                  fontWeight: "500",
                                  lineHeight: "160%",
                                  textAlign: "left",
                                  cursor: "pointer",
                                  letterSpacing: "0.8px",
                                }}
                              >
                                {ConvertDate(row?.createdAt)}
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
                                  cursor: "pointer",
                                  letterSpacing: "0.8px",
                                }}
                              >
                                {row && row?.title?.length > 25
                                  ? `${row?.title.slice(0, 25)}...`
                                  : row?.title}
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
                                  cursor: "pointer",
                                  letterSpacing: "0.8px",
                                }}
                              >
                                {row?.description?.length > 10
                                  ? `${row?.description.slice(0, 10)}...`
                                  : row?.description}
                              </TableCell>
                              <TableCell component="th" scope="row">
                                <p
                                  style={{
                                    // color: "#166FBF",
                                    color:
                                      row?.status === "inprogress"
                                        ? "#D32121"
                                        : row?.status === "completed"
                                        ? "#166FBF"
                                        : "none",
                                    fontSize: "14px",
                                    fontStyle: "normal",
                                    fontWeight: "500",
                                    lineHeight: "160%",
                                    textAlign: "center",
                                    // cursor: "pointer",
                                    // background: "#F1F6FB",
                                    borderRadius: "50px",
                                    background:
                                      row?.status === "inprogress"
                                        ? "#FBEDED"
                                        : row?.status === "completed"
                                        ? "#F1F6FB"
                                        : "none",
                                    height: "39px",
                                    width: "105px",
                                    letterSpacing: "0.8px",
                                    // paddingTop: "10px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  {toSentenceCase(row?.status)}
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
                                  cursor: "pointer",
                                  fontFamily: "ClashGrotesk",
                                  letterSpacing: "0.8px",
                                }}
                              >
                                {row?.type?.length > 10
                                  ? `${row?.type.slice(0, 10)}...`
                                  : row?.type}
                              </TableCell>
                              <TableCell
                                style={{
                                  color: "#0A1126",
                                  fontSize: "14px",
                                  fontStyle: "normal",
                                  fontWeight: "500",
                                  lineHeight: "160%",
                                  textAlign: "right",
                                  letterSpacing: "0.5px",
                                }}
                              >
                                <IconButton
                                  aria-label="expand row"
                                  size="small"
                                  style={{ background: "transparent" }}
                                >
                                  {row?.userId === USERID && (
                                    <img
                                      src="/Images/Dashboard/edit-icon.svg"
                                      alt="edit"
                                      onClick={(e) => {
                                        e.stopPropagation();

                                        handleEditProject(row);
                                      }}
                                    />
                                  )}
                                </IconButton>

                                <IconButton
                                  aria-label="expand row"
                                  size="small"
                                  // onClick={() => setOpen(!open)}
                                  style={{
                                    background: "transparent",
                                    marginLeft: "20px",
                                  }}
                                >
                                  {row?.userId !== USERID ? (
                                    <img
                                      src="/Images/Projects/menu-eye-icon.svg"
                                      alt="view"
                                      onClick={() => handleViewProject(row)}
                                    />
                                  ) : (
                                    <div>
                                      <Dropdown
                                        onClick={(e) => {
                                          e.stopPropagation();
                                        }}
                                        className="drop-contract-dot"
                                      >
                                        <Dropdown.Toggle className="dropdown-dot">
                                          ...
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                          <Dropdown.Item
                                            style={{
                                              borderBottom: "1px solid #ECECEC",
                                            }}
                                            onClick={() =>
                                              handleViewProject(row?.id)
                                            }
                                          >
                                            <img
                                              src="/Images/Contract/eye.svg"
                                              alt="view contract"
                                              className="eye-share-dropimg"
                                            />
                                            View project
                                          </Dropdown.Item>
                                          <Dropdown.Item
                                            onClick={() =>
                                              handleClient(row?._id || row?.id)
                                            }
                                          >
                                            <img
                                              src="/Images/Projects/add-client.svg"
                                              alt="Add Client"
                                              className="eye-share-dropimg"
                                            />
                                            Add Client
                                          </Dropdown.Item>
                                        </Dropdown.Menu>
                                      </Dropdown>
                                    </div>
                                  )}
                                </IconButton>
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
                          count={ProjectAllData?.data?.totalPages}
                          page={currentPage}
                          // count={10}
                          size={"18px"}
                          sx={{
                            fontSize: "1px",
                          }}
                          siblingCount={isMobile ? 0 : 1}
                          // boundaryCount={1}
                          shape="rounded"
                          onChange={handleChangePagitation}
                        />
                      </div>
                    </Stack>
                  </div>
                </>
              ) : (
                <div className="Add-project-main">
                  <div className="Add-project-inner">
                    <div className="Add-project">
                      <div className="add-project__value">
                        <img src="/Images/Projects/document.svg" alt="/" />
                        <h6>Add project</h6>
                        <p>
                          Create and manage project with ease. Get started now!
                        </p>
                        <button onClick={() => setModalShow(true)}>
                          Add project
                        </button>
                        {modalShow && (
                          <AddProject
                            show={modalShow}
                            onHide={() => setModalShow(false)}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {modalShowUpdate && (
          <UpdateProject
            projectid={selectedEdit}
            show={modalShowUpdate}
            onHide={() => setModalShowUpdate(false)}
          />
        )}
        {modalShowClient && (
          <AddClientOrg
            projectid={selectedAddClient}
            show={modalShowClient}
            onHide={() => setModalShowClient(false)}
          />
        )}
      </>
    </>
  );
};

export default ProjectsTable;
