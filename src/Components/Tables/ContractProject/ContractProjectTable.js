import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import Paper from "@mui/material/Paper";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import React from "react";
import "./ContractProjectTable.css";
import Dropdown from "react-bootstrap/Dropdown";
import { getfourProjects } from "../../../services/redux/middleware/Project/project";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AddClientOrg from "../../Modals/Organization/AddClientOrg/AddClientOrg";
import UpdateProject from "../../Modals/UpdateProject/UpdateProject";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function ContractProjectTable() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userId, setUserId] = useState();
  const [contractowner, setContractOwner] = useState(false);
  const [selectedView, setSelectedView] = useState("");
  const [selectedEdit, setSelectedEdit] = useState("");
  const [selectedAddClient, setSelectedAddClient] = useState("");
  const [modalShowUpdate, setModalShowUpdate] = useState(false);
  const [modalShowClient, setModalShowClient] = useState(false);
  const FourProjectData = useSelector(
    (state) => state?.getfourProject?.myFourProjects?.data
  );
  console.log("My Own Projects in table", FourProjectData);

  useEffect(() => {
    const userid = localStorage.getItem("_id");
    console.log("user id ", userid);
    setUserId(userid);
    // setUserID(userid);
    dispatch(getfourProjects(userid));
  }, []);

  const handleClient = (projectId) => {
    console.log("Selected Add client row is", projectId);
    setSelectedAddClient(projectId);
    setModalShowClient(true);
  };

  const handleViewProject = (projectId) => {
    console.log("Selected View Project Row is", projectId);
    setSelectedView(projectId);
    navigate(`/ProjectActivities/${projectId}`);
  };

  const handleEditProject = (proId) => {
    console.log("Project ID:", proId);
    setSelectedEdit(proId);
    setModalShowUpdate(true);
  };

  const ConvertDate = (originalDateStr) => {
    const originalDate = new Date(originalDateStr);
    const formattedDate = originalDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formattedDate;
  };

  const [userRole, setRole] = useState();

  useEffect(() => {
    const userrole = localStorage.getItem("role");
    setRole(userrole);
  }, [userRole]);

  function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    return (
      <React.Fragment>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell
            component="th"
            scope="row"
            style={{
              color: " #606060",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: "500",
              lineHeight: "17.22px",
              textAlign: "start",
              paddingLeft: "20px",
              paddingTop: "33px",
              paddingBottom: "33px",
            }}
          >
            {ConvertDate(row?.createdAt)}
          </TableCell>

          <TableCell
            style={{
              color: " #0a1126",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: "400",
              lineHeight: "17.22px",

              textAlign: "start",
              paddingLeft: "20px",
              paddingTop: "33px",
              paddingBottom: "33px",
            }}
          >
            {row && row.title && row?.title?.length > 10
              ? `${row?.title.slice(0, 10)}...`
              : row?.title}
          </TableCell>
          <TableCell
            style={{
              color: " #0a1126",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: "400",
              lineHeight: "17.22px",

              textAlign: "start",
              paddingLeft: "20px",
              paddingTop: "33px",
              paddingBottom: "33px",
            }}
          >
            {row?.creator?.organizationName}
          </TableCell>
          <TableCell
            style={{
              color: " #0a1126",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: "400",
              lineHeight: "17.22px",
              textTransform: "capitalize",
              textAlign: "start",
              color: row.status === "In-Progress" ? "#D32121" : "#166FBF",
              paddingLeft: "20px",
              paddingTop: "33px",
              paddingBottom: "33px",
            }}
          >
            <div
              className={
                row.status === "In-Progress"
                  ? "status-txt-progress"
                  : "status-txt-compl"
              }
            >
              {" "}
              {row?.status}
            </div>
          </TableCell>
          <TableCell
            style={{
              color: " #0a1126",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: "400",
              lineHeight: "17.22px",

              textAlign: "start",
              paddingLeft: "20px",
              paddingTop: "33px",
              paddingBottom: "33px",
            }}
          >
            {row && row?.type?.length > 10
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
              // gap: "10px",
              // display: "flex",
            }}
          >
            <IconButton
              aria-label="expand row"
              size="small"
              // onClick={() => setOpen(!open)}
              style={{ background: "transparent" }}
            >
              {row?.userId == userId && (
                <img
                  src="/Images/Dashboard/edit-icon.svg"
                  alt="edit"
                  onClick={() => handleEditProject(row)}
                />
              )}
            </IconButton>
            <IconButton
              aria-label="expand row"
              size="small"
              // onClick={() => setOpen(!open)}
              style={{ background: "transparent", marginLeft: "20px" }}
            >
              {row?.userId != userId ? (
                <img
                  src="/Images/Projects/menu-eye-icon.svg"
                  alt="view"
                  onClick={() => handleViewProject(row.id)}
                />
              ) : (
                <div>
                  <Dropdown className="drop-contract-dot">
                    <Dropdown.Toggle
                      // id="dropdown-basic"
                      className="dropdown-dot"
                    >
                      ...
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {/* <Dropdown.Item
                          style={{
                            borderBottom: "1px solid #ECECEC",
                          }}
                        >
                          <img
                            src="/Images/Projects/file-05.svg"
                            alt="Smart contract"
                            className="eye-share-dropimg"
                          />
                          Smart contract
                        </Dropdown.Item> */}
                      <Dropdown.Item
                        style={{
                          borderBottom: "1px solid #ECECEC",
                        }}
                        onClick={() => handleViewProject(row.id)}
                      >
                        <img
                          src="/Images/Contract/eye.svg"
                          alt="view contract"
                          className="eye-share-dropimg"
                        />
                        View project
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleClient(row.id)}>
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
        <TableRow>
          <TableCell
            style={{
              paddingBottom: 0,
              paddingTop: 0,
              borderBottom: "none",
              padding: 0,
            }}
            colSpan={12}
          >
            {/* <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 0 }}>
                
                <Table aria-label="purchases" size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        width={"4%"}
                        style={{ minWidth: "4%" }}
                      ></TableCell>

                      <TableCell
                        className="inner-column"
                        width={"10%"}
                        style={{ minWidth: "10%" }}
                      >
                        NFT Name
                      </TableCell>
                      <TableCell
                        className="inner-column"
                        width={"18%"}
                        style={{ minWidth: "18%" }}
                      >
                        Mint Date
                      </TableCell>
                      <TableCell
                        className="inner-column"
                        width={"10%"}
                        style={{ minWidth: "10%" }}
                      >
                        Price
                      </TableCell>
                      <TableCell
                        className="inner-column"
                        width={"12%"}
                        style={{ minWidth: "12%" }}
                      >
                        Status
                      </TableCell>
                      <TableCell
                        className="inner-column"
                        width={"12%"}
                        style={{ minWidth: "12%" }}
                      >
                        Value
                      </TableCell>
                      <TableCell
                        className="inner-column"
                        width={"12%"}
                        style={{ minWidth: "12%" }}
                      >
                        Payout
                      </TableCell>
                      <TableCell
                        className="inner-column"
                        width={"8%"}
                        style={{ minWidth: "8%" }}
                      >
                        Status
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.history.map((historyRow) => (
                      <TableRow key={historyRow.nftname}>
                        <TableCell component="th" scope="row">
                          {historyRow.ep}
                        </TableCell>
                        <TableCell
                          // width={"163px"}
                          style={{
                            color: "#0F68FF",
                            fontSize: "14px",
                            fontStyle: "normal",
                            fontWeight: "400",
                            lineHeight: "22.4px",
                            textAlign: "start",
                            paddingLeft: "16px",
                          }}
                        >
                          {historyRow.nftname}
                        </TableCell>
                        <TableCell
                          size="medium"
                          // width={"310px"}
                          style={{
                            color: "#0F68FF",
                            fontSize: "14px",
                            fontStyle: "normal",
                            fontWeight: "400",
                            lineHeight: "22.4px",
                            textAlign: "start",
                          }}
                        >
                          {historyRow.mintdate}
                        </TableCell>
                        <TableCell
                          // width={"88px"}
                          style={{
                            color: "#0F68FF",
                            fontSize: "14px",
                            fontStyle: "normal",
                            fontWeight: "400",
                            lineHeight: "22.4px",
                            textAlign: "start",
                          }}
                        >
                          {historyRow.price}
                        </TableCell>
                        <TableCell
                          // width={"174px"}
                          style={{
                            color: "#0F68FF",
                            fontSize: "14px",
                            fontStyle: "normal",
                            fontWeight: "400",
                            lineHeight: "22.4px",
                            textAlign: "start",
                          }}
                        >
                          {historyRow.buystatus}
                        </TableCell>
                        <TableCell
                          // width={"129px"}
                          style={{
                            color: "#0F68FF",
                            fontSize: "14px",
                            fontStyle: "normal",
                            fontWeight: "400",
                            lineHeight: "22.4px",
                            textAlign: "start",
                          }}
                        >
                          ${historyRow.value}
                        </TableCell>
                        <TableCell
                          // width={"112px"}
                          style={{
                            color: "#0F68FF",
                            fontSize: "14px",
                            fontStyle: "normal",
                            fontWeight: "400",
                            lineHeight: "22.4px",
                            textAlign: "start",
                          }}
                        >
                          ${historyRow.payout}
                        </TableCell>
                        <TableCell
                          style={{
                            color: "#0F68FF",
                            fontSize: "14px",
                            fontStyle: "normal",
                            fontWeight: "400",
                            lineHeight: "22.4px",
                            textAlign: "start",
                          }}
                        >
                          {historyRow.status}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse> */}
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          boxShadow: "none",
          minHeight: userRole == "user" ? "300px" : "500px",
          height: "300px",
        }}
      >
        <Table
          aria-label="collapsible table"
          size="medium"
          sx={{ borderRadius: "15px" }}
        >
          <TableHead sx={{ borderRadius: "15px" }}>
            <TableRow className="columns-contract">
              <TableCell
                className="column-head-contract"

                // width={"12%"}
                // style={{ minWidth: "12%", borderTopLeftRadius: "15px" }}
              >
                Date
              </TableCell>
              <TableCell
                className="column-head-contract"
                // width={"13%"}
                // style={{ minWidth: "13%" }}
              >
                Title
              </TableCell>
              <TableCell
                className="column-head-contract"
                // width={"10%"}
                // style={{ minWidth: "10%" }}
              >
                Organization
              </TableCell>
              <TableCell
                className="column-head-contract"
                // width={"10%"}
                // style={{ minWidth: "10%" }}
              >
                Status
              </TableCell>
              <TableCell
                className="column-head-contract"
                // width={"10%"}
                // style={{ minWidth: "10%" }}
              >
                Type
              </TableCell>
              <TableCell
                className="column-head-contract"
                // width={"8%"}
                // style={{ minWidth: "8%", borderTopRightRadius: "15px" }}
              ></TableCell>
            </TableRow>
          </TableHead>
          <TableBody
            sx={{
              borderLeft: "1px solid #ECECEC",
              borderRight: "1px solid #ECECEC",
              borderBottomLeftRadius: "15px",
              borderBottomRightRadius: "15px",
            }}
          >
            {FourProjectData?.projects &&
              FourProjectData?.projects?.map((row) => (
                <Row key={row.date} row={row} />
              ))}
            {/* {rows.map((row) => (
              <Row key={row.date} row={row} />
            ))} */}
          </TableBody>
        </Table>
      </TableContainer>

      {modalShowClient && (
        <AddClientOrg
          projectid={selectedAddClient}
          show={modalShowClient}
          onHide={() => setModalShowClient(false)}
        />
      )}
      {modalShowUpdate && (
        <UpdateProject
          projectid={selectedEdit}
          show={modalShowUpdate}
          onHide={() => setModalShowUpdate(false)}
        />
      )}
    </>
  );
}
