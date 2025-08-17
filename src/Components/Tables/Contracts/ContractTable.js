import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import React from "react";
import "./Contracts.css";
import Dropdown from "react-bootstrap/Dropdown";
import { useDispatch, useSelector } from "react-redux";
import { getContract } from "../../../services/redux/middleware/getContract";
import ShareContract from "../../Modals/ShareContract/ShareContract";
import EditContract from "../../Modals/EditContract/EditContract";

export default function ContractTable() {
  const dispatch = useDispatch();
  // const USERID = localStorage.getItem("_id");
  const [userId, setUserId] = useState();
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [selectedEditRowId, setSelectedEditRowId] = useState(null);
  const [selectedViewRowId, setSelectedViewRowId] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [modalShowEdit, setModalShowEdit] = useState(false);
  const [modalShowView, setModalShowView] = useState(false);
  const [currentContractId, setCurrentContractId] = useState(null);

  // Debug modal state changes
  useEffect(() => {
    console.log("🔍 ContractTable: modalShow changed to:", modalShow);
  }, [modalShow]);

  useEffect(() => {
    console.log("🔍 ContractTable: modalShowEdit changed to:", modalShowEdit);
  }, [modalShowEdit]);

  useEffect(() => {
    console.log("🔍 ContractTable: modalShowView changed to:", modalShowView);
  }, [modalShowView]);

  const ContractData = useSelector(
    (state) => state?.getContract?.contract?.data
  );

  const contractLoading = useSelector(
    (state) => state?.getContract?.loading
  );

  const contractError = useSelector(
    (state) => state?.getContract?.error
  );

  console.log("🔍 ContractTable: ContractData:", ContractData);
  console.log("🔍 ContractTable: contractLoading:", contractLoading);
  console.log("🔍 ContractTable: contractError:", contractError);

  const handleShareContractClick = (contractId) => {
    setSelectedRowId(contractId);
    setModalShow(true);
    console.log("Selected COntract Row is", selectedRowId);
  };

  const handleViewContractClick = (contractId) => {
    console.log("🔍 ContractTable: handleViewContractClick called with contractId:", contractId);
    console.log("🔍 ContractTable: Current selectedViewRowId before update:", selectedViewRowId);
    
    // Set the contract ID first
    setCurrentContractId(contractId);
    setSelectedViewRowId(contractId);
    
    // Use setTimeout to ensure state is updated before showing modal
    setTimeout(() => {
      setModalShowView(true);
      console.log("🔍 ContractTable: Set modalShowView to true after timeout");
      console.log("🔍 ContractTable: About to render EditContract modal with ContractID:", contractId);
    }, 0);
    
    console.log("🔍 ContractTable: Set currentContractId to:", contractId);
    console.log("🔍 ContractTable: Set selectedViewRowId to:", contractId);
  };

  useEffect(() => {
    const userid = localStorage.getItem("_id");
    console.log("user id ", userid);
    setUserId(userid);
    // setUserID(userid);
    dispatch(getContract(userid));
  }, []);

  // Debug useEffect to track state changes
  useEffect(() => {
    console.log("🔍 ContractTable: selectedViewRowId changed to:", selectedViewRowId);
  }, [selectedViewRowId]);

  useEffect(() => {
    console.log("🔍 ContractTable: modalShowView changed to:", modalShowView);
  }, [modalShowView]);

  useEffect(() => {
    console.log("🔍 ContractTable: currentContractId changed to:", currentContractId);
  }, [currentContractId]);

  const [contractowner, setContractOwner] = useState(false);
  function createData(date, contractname, category, view) {
    return {
      date,
      contractname,
      category,
      view,
      history: [
        {
          ep: "",
          nftname: "M4-24 20K",
          mintdate: "2020-01-05",
          price: "20,000",
          buystatus: "Trading",
          value: "25,000",
          payout: "500",
          status: "Pending",
        },
        {
          ep: "",
          nftname: "M4-24 20K",
          mintdate: "2020-01-05",
          price: "20,000",
          buystatus: "Sold",
          value: "25,000",
          payout: "500",
          status: "Pending",
        },
      ],
    };
  }
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
              // onClick={() => setOpen(!open)}
            >
              {userId == row.userId && (
                <>
                  <img
                    src="/Images/Dashboard/edit-icon.svg"
                    alt="edit"
                    onClick={() => handleViewContractClick(row._id)}
                  />

                  
                </>
            
              
              )}
            </IconButton>
            <IconButton
              aria-label="expand row"
              size="small"
              style={{ background: "transparent" , marginLeft:"20px"}}
              // onClick={() => setOpen(!open)}
            >
              {userId == row.userId ? (
                <>
                  {/* <img
                    src="/Images/Dashboard/edit-icon.svg"
                    alt="edit"
                    onClick={() => handleViewContractClick(row.id)}
                  /> */}

                  <div>
                    <Dropdown className="drop-contract-dot">
                      <Dropdown.Toggle
                        // id="dropdown-basic"
                        className="dropdown-dot"
                      >
                        ...
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item
                          
                          onClick={() => {
                            console.log("🔍 ContractTable: Row data for contract:", row);
                            console.log("🔍 ContractTable: Contract ID from row._id:", row._id);
                            handleViewContractClick(row._id);
                          }}
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
                         
                          onClick={() => handleShareContractClick(row._id)}
                          // onClick={() => setModalShow(true)}
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
                  <div onClick={() => handleViewContractClick(row._id)}>
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
        {/* <TableRow>
          <TableCell
            style={{
              paddingBottom: 0,
              paddingTop: 0,
              borderBottom: "none",
              padding: 0,
              fontFamily: "ClashGrotesk",
            }}
            colSpan={12}
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
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
            </Collapse>
          </TableCell>
        </TableRow> */}
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
  return (
    <>
      <TableContainer
        component={Paper}
        sx={{ boxShadow: "none", height: "300px", minHeight: "400px" }}
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
            {contractLoading ? (
              <TableRow>
                <TableCell colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>
                  <p>Loading contracts...</p>
                </TableCell>
              </TableRow>
            ) : contractError ? (
              <TableRow>
                <TableCell colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>
                  <p style={{ color: '#ff4444' }}>Error loading contracts: {contractError}</p>
                  <details style={{ marginTop: '10px', textAlign: 'left' }}>
                    <summary>Debug Info</summary>
                    <pre style={{ fontSize: '12px', color: '#666' }}>
                      {JSON.stringify({ contractError, ContractData }, null, 2)}
                    </pre>
                  </details>
                </TableCell>
              </TableRow>
            ) : !ContractData?.contracts || ContractData?.contracts?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>
                  <p>No contracts found.</p>
                  <details style={{ marginTop: '10px', textAlign: 'left' }}>
                    <summary>Debug Info</summary>
                    <pre style={{ fontSize: '12px', color: '#666' }}>
                      {JSON.stringify({ ContractData, hasContracts: !!ContractData?.contracts, contractCount: ContractData?.contracts?.length }, null, 2)}
                    </pre>
                  </details>
                </TableCell>
              </TableRow>
            ) : (
              ContractData?.contracts?.map((row) => (
                <Row key={row._id || row.id || row.date} row={row} />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {modalShow && (
        <ShareContract
          ContractID={selectedRowId}
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
      )}

      {modalShowView && currentContractId && (
        <>
          {console.log("🔍 ContractTable: Rendering EditContract modal with ContractID:", currentContractId)}
          <EditContract
            ContractID={currentContractId}
            show={modalShowView}
            onHide={() => {
              setModalShowView(false);
              setSelectedViewRowId(null);
              setCurrentContractId(null);
            }}
          />
        </>
      )}
    </>
  );
}
