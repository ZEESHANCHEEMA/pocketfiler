import { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import React from "react";
import "./AllContractTable.css";
import Dropdown from "react-bootstrap/Dropdown";
import { useMediaQuery } from "react-responsive";
import ShareContract from "../../Modals/ShareContract/ShareContract";
import { useDispatch, useSelector } from "react-redux";
import { getAllContract } from "../../../services/redux/middleware/getAllContract";
import EditContract from "../../Modals/EditContract/EditContract";

export default function AllContractTable({ year }) {
  const dispatch = useDispatch();

  const ContractAllData = useSelector(
    (state) => state?.getAllContract?.allcontract
  );
  console.log("contract all data in table", ContractAllData);

  const [currentPage, setCurrentPage] = useState(1);
  const [modalShow, setModalShow] = useState(false);
  const [modalShowView, setModalShowView] = useState(false);
  const [userId, setUserId] = useState();

  const isMobile = useMediaQuery({
    query: "(max-width: 768px)",
  });

  function Row(props) {
    const { row } = props;

    return (
      <React.Fragment>
        <TableRow
          sx={{ "& > *": { borderBottom: "unset" } }}
          onClick={() => handleViewContractClick(row.id)}
        >
          <TableCell
            component="th"
            scope="row"
            style={{
              fontFamily: "ClashGrotesk",

              color: " #606060",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: "500",
              lineHeight: "17.22px",
              textAlign: "start",
              borderLeft: "1px solid #ECECEC",
              borderBottomLeftRadius: "15px",
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
              fontFamily: "ClashGrotesk",
              paddingLeft: "20px",
              paddingTop: "33px",
              paddingBottom: "33px",
              textAlign: "start",
            }}
          >
            {row?.contractName}
          </TableCell>
          <TableCell
            style={{
              color: " #0a1126",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: "400",
              lineHeight: "17.22px",
              fontFamily: "ClashGrotesk",
              textAlign: "start",
              paddingLeft: "20px",
              paddingTop: "33px",
              paddingBottom: "33px",
            }}
          >
            {row?.category}
          </TableCell>

          <TableCell
            style={{
              textAlign: "right",
              paddingLeft: "20px",
              paddingTop: "33px",
              paddingBottom: "33px",
            }}
          >
            <IconButton
              aria-label="expand row"
              size="small"
              style={{ background: "transparent" }}
            >
              {userId == row.userId && (
                <>
                  <img
                    src="/Images/Dashboard/edit-icon.svg"
                    alt="edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewContractClick(row.id);
                    }}
                  />
                </>
              )}
            </IconButton>
            <IconButton
              aria-label="expand row"
              size="small"
              style={{ background: "transparent", marginLeft: "20px" }}
            >
              {userId == row.userId ? (
                <>
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
                          onClick={() => handleViewContractClick(row.id)}
                          style={{
                            borderBottom: "1px solid #ECECEC",
                          }}
                        >
                          <img
                            src="/Images/Contract/eye.svg"
                            alt="view contract"
                            className="eye-share-dropimg"
                          />
                          View contract
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => handleShareContractClick(row.id)}
                        >
                          <img
                            src="/Images/Contract/share-06.svg"
                            alt="share contract"
                            className="eye-share-dropimg"
                          />
                          Share contract
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </>
              ) : (
                <>
                  <div onClick={() => handleViewContractClick(row.id)}>
                    <VisibilityOutlinedIcon
                      sx={{
                        color: "#0a1126",
                      }}
                    />
                  </div>
                </>
              )}
            </IconButton>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  const ConvertDate = (originalDateStr) => {
    const originalDate = new Date(originalDateStr);
    const formattedDate = originalDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formattedDate;
  };

  const handleChangePagitation = (event, value) => {
    // Handle page change here
    const userid = localStorage.getItem("_id");

    const data = {
      id: userid,
      page: value ? value : 1,
      year: year,
    };
    dispatch(getAllContract(data));
    setCurrentPage(value);

    // You may want to fetch new data based on the new page value
  };

  const [selectedRowId, setSelectedRowId] = useState(null);
  const [selectedViewRowId, setSelectedViewRowId] = useState(null);

  const handleShareContractClick = (contractId) => {
    setSelectedRowId(contractId);
    setModalShow(true);
    console.log("Selected COntract Row is", selectedRowId);
  };

  const handleViewContractClick = (contractId) => {
    setSelectedViewRowId(contractId);
    setModalShowView(true);
    console.log("Selected View COntract Row is", selectedViewRowId);
  };

  useEffect(() => {
    const USERID = localStorage.getItem("_id");
    setUserId(USERID);
  }, []);

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{ boxShadow: "none", minHeight: "450px" }}
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
                width={"12%"}
                style={{ minWidth: "12%", borderTopLeftRadius: "15px" }}
              >
                Date
              </TableCell>
              <TableCell
                className="column-head-contract"
                width={"20%"}
                style={{ minWidth: "20%" }}
              >
                Contract name
              </TableCell>
              <TableCell
                className="column-head-contract"
                width={"10%"}
                style={{ minWidth: "10%" }}
              >
                Category
              </TableCell>

              <TableCell
                className="column-head-contract"
                width={"5%"}
                style={{ minWidth: "5%" }}
              ></TableCell>
            </TableRow>
          </TableHead>
          <TableBody
            sx={{
              // borderLeft: "1px solid #ECECEC",
              borderRight: "1px solid #ECECEC",
              borderBottomLeftRadius: "15px",
              borderBottomRightRadius: "15px",
            }}
          >
            {ContractAllData?.data?.contracts &&
              ContractAllData?.data?.contracts?.map((row, index) => (
                <Row
                  key={index}
                  row={row}
                  // onClick={() => handleContractRowClick(row.id)}
                />
              ))}
            {/* {rows.map((row) => (
              <Row key={row.date} row={row} />
            ))} */}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="page-table__pagenation">
        <Stack spacing={2}>
          <div className="custom-pagination-container">
            <Pagination
              count={ContractAllData?.data?.totalPages}
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

      {modalShow && (
        <ShareContract
          ContractID={selectedRowId}
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
      )}

      {modalShowView && (
        <EditContract
          ContractID={selectedViewRowId}
          show={modalShowView}
          onHide={() => setModalShowView(false)}
        />
      )}
    </>
  );
}
