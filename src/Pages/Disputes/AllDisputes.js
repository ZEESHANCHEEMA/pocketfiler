import Header from "../../Components/Header/Header";
import "./AllDisputes.css";
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
import { useMediaQuery } from "react-responsive";
import { useDispatch, useSelector } from "react-redux";
import ScreenLoader from "../../Components/loader/ScreenLoader";
import { useNavigate } from "react-router-dom";
import { DisputeData } from "../../services/redux/middleware/Dispute/dispute";
import Dispute from "../../Components/Modals/Dispute/Dispute";
import Calendar from "react-calendar";
import { toSentenceCase } from "../../utils/helperFunction";
const AllDisputes = () => {
  const isMobile = useMediaQuery({
    query: "(max-width: 768px)",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [modalShow, setModalShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [value, setValue] = useState(new Date().getFullYear());
  const [showDropdown, setShowDropdown] = useState(false);

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
  const DisputeAllData = useSelector(
    (state) => state?.getDisputeData?.myDisputeDATA?.data
  );

  const handleChangePagitation = (event, pageNo) => {
    if (searchQuery) {
      const userid = localStorage.getItem("_id");
      const data = {
        id: userid,
        page: pageNo ? pageNo : 1,
        search: searchQuery,
      };

      dispatch(DisputeData(data));
      setCurrentPage(pageNo);
    } else {
      const userid = localStorage.getItem("_id");
      const data = {
        id: userid,
        page: pageNo ? pageNo : 1,
        year: value,
      };

      dispatch(DisputeData(data));
      setCurrentPage(pageNo);
    }
  };
  const handleViewProject = (projectId, allData) => {
    navigate(`/HelpCenter/Dispute/${projectId}`, { state: allData });
  };
  const handleAddDispute = () => {
    setModalShow(true);
  };
  useEffect(() => {
    const userid = localStorage.getItem("_id");
    const data = {
      id: userid,
      page: 1,
      year: value,
    };
    dispatch(DisputeData(data));
  }, [value]);
  const handleYearSelect = (selectedDate) => {
    setValue(selectedDate.getFullYear());

    setShowDropdown(false);
    setSearchQuery("");
  };
  const searchData = (Searchvalue) => {
    if (Searchvalue) {
      setSearchQuery(Searchvalue);
      const userid = localStorage.getItem("_id");
      const data = {
        id: userid,
        search: Searchvalue,
      };
      dispatch(DisputeData(data));
    } else {
      const userid = localStorage.getItem("_id");
      const data = {
        id: userid,
        page: currentPage,
        year: value,
      };
      dispatch(DisputeData(data));
    }
  };

  return (
    <>
      <Header headername={"Disputes"} />
      {userLoading.loading && <ScreenLoader />}

      <>
        <div className="profit-table">
          <div
            className="row-3 profittable__main "
            style={{ overflowX: "auto" }}
          >
            <div className="profit-table__main-data">
              <div className="table-above-row-info pb-0 clients-toolbar">
                <div>
                  <h6 className="user-heading mb-0"> Disputes </h6>
                </div>

                <div className="projecttable__main-head">
                  {/* mobile floating search icon removed; input always visible */}
                  <div
                    className={
                      isMobile ? "search-input-icon w-100" : "search-input-icon"
                    }
                  >
                    <img
                      src="/Images/Projects/search.svg"
                      alt="search-icon"
                      className="search-icon"
                      style={{
                        position: "absolute",
                        left: isMobile ? "14px" : "22px",
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Search disputes..."
                      className="search-input-contract"
                      style={isMobile ? { paddingLeft: "48px" } : undefined}
                      onChange={(e) => searchData(e.target.value)}
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
                  <div className="projecttable__main-headingbtn">
                    <button onClick={() => setModalShow(true)}>
                      Add Dispute
                    </button>
                  </div>
                  <Dispute
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                  />
                </div>
              </div>

              <p className="total-contracts-txt">
                Total {DisputeAllData?.totalDisputes}
                {DisputeAllData?.totalDisputes < 2 ? " dispute" : " disputes"}
              </p>
              {DisputeAllData?.disputes?.length > 0 ? (
                <>
                  <TableContainer
                    sx={{ boxShadow: "none", minHeight: "400px" }}
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
                              width: "25%",
                            }}
                          >
                            Project Name
                          </TableCell>
                          <TableCell
                            className="column-head"
                            style={{ textAlign: "left", width: "20%" }}
                          >
                            Date
                          </TableCell>
                          <TableCell
                            className="column-head"
                            style={{ textAlign: "left", width: "30%" }}
                          >
                            Description
                          </TableCell>
                          <TableCell
                            className="column-head"
                            style={{ textAlign: "left" }}
                          >
                            Status
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      {DisputeAllData?.disputes?.length > 0 ? (
                        <TableBody>
                          {DisputeAllData?.disputes?.map((row, index) => (
                            <TableRow
                              style={{ height: "75px" }}
                              key={index}
                              onClick={() =>
                                handleViewProject(row?.project?.id, row)
                              }
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
                                {row?.project?.title}
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
                                {row?.project?.description}
                              </TableCell>
                              <TableCell component="th" scope="row">
                                <p
                                  style={{
                                    color:
                                      row?.dispute?.status === "inprogress"
                                        ? "#D32121"
                                        : row?.dispute?.status ===
                                            "Withdrawn" ||
                                          row?.dispute?.status === "closed"
                                        ? "#166FBF"
                                        : "none",
                                    fontSize: "14px",
                                    fontStyle: "normal",
                                    fontWeight: "500",
                                    lineHeight: "160%",
                                    textAlign: "center",

                                    borderRadius: "50px",
                                    background:
                                      row?.status === "inprogress"
                                        ? "#FBEDED"
                                        : row?.dispute?.status ===
                                            "Withdrawn" ||
                                          row?.status === "closed"
                                        ? "#F1F6FB"
                                        : "none",
                                    height: "39px",
                                    width: "105px",
                                    letterSpacing: "0.8px",

                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  {toSentenceCase(row?.status)}
                                </p>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      ) : (
                        <div
                          className="Add-project-main"
                          style={{ alignSelf: "center" }}
                        >
                          <div className="Add-project-inner">
                            <div className="Add-project">
                              <div className="add-project__value dispute-margin">
                                <img
                                  src="/Images/Dashboard/no-dispute.svg"
                                  alt="/"
                                />
                                <h6 className="mb-0">No Dispute</h6>
                                <p>
                                  You have currently no dispute at this moment
                                </p>
                                <button onClick={() => handleAddDispute()}>
                                  Add Dispute
                                </button>
                              </div>

                              {modalShow && (
                                <Dispute
                                  show={modalShow}
                                  onHide={() => setModalShow(false)}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </Table>
                  </TableContainer>
                  <div className="page-table__pagenation">
                    <Stack spacing={2}>
                      <div className="custom-pagination-container">
                        <Pagination
                          count={DisputeAllData?.totalPages}
                          page={currentPage}
                          size={"18px"}
                          sx={{
                            fontSize: "1px",
                          }}
                          siblingCount={isMobile ? 0 : 1}
                          shape="rounded"
                          onChange={handleChangePagitation}
                        />
                      </div>
                    </Stack>
                  </div>
                </>
              ) : (
                <div className="Add-project-main  ">
                  <div className="Add-project-inner">
                    <div className="Add-project">
                      <div className="add-project__value dispute-margin">
                        <img src="/Images/Dashboard/no-dispute.svg" alt="/" />
                        <h6 className="mb-0">No Dispute</h6>
                        <p>You have currently no dispute at this moment</p>
                        <button onClick={() => handleAddDispute()}>
                          Add Dispute
                        </button>
                      </div>

                      {modalShow && (
                        <Dispute
                          show={modalShow}
                          onHide={() => setModalShow(false)}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    </>
  );
};

export default AllDisputes;
