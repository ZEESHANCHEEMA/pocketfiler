import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import RemoveClient from "../../Modals/RemoveClient/RemoveClient";

function FourClients() {
  const [removeClient, setRemoveClient] = useState(false);
  const [removeAssociate, setRemoveAssociate] = useState();
  const [removeAssociateName, setRemoveAssociateName] = useState();
  const ClientDataMap = useSelector(
    (state) => state?.getAllClient?.allClient?.data
  );

  const filteredClients = ClientDataMap?.associates.filter((row) =>
    row?.user?.email?.toLowerCase()
  );
  return (
    <TableContainer sx={{ boxShadow: "none", minHeight: "400px" }}>
      <Table sx={{ overflowX: "auto" }} aria-label="simple table">
        <TableHead style={{ height: "51px" }}>
          <TableRow className="columns-name">
            <TableCell className="column-head" style={{ textAlign: "left" }}>
              Status
            </TableCell>
            <TableCell className="column-head" style={{ textAlign: "left" }}>
              Full name
            </TableCell>
            <TableCell className="column-head" style={{ textAlign: "left" }}>
              Email address
            </TableCell>
            <TableCell className="column-head" style={{ textAlign: "left" }}>
              Contact number
            </TableCell>

            <TableCell
              className="column-head"
              style={{ textAlign: "left" }}
            ></TableCell>
          </TableRow>
        </TableHead>
        {filteredClients?.length > 0 ? (
          <TableBody>
            {filteredClients?.slice(0, 4)?.map((row, index) => (
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
                  {row?.user?.fullname}
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
                  {row?.user?.phoneNo ? row?.user?.phoneNo : "-    -    -"}
                </TableCell>
                <TableCell component="th" scope="row">
                  <p
                    onClick={() => {
                      setRemoveClient(true);
                      setRemoveAssociate(row?.associate?.id);
                      setRemoveAssociateName(row?.user?.fullname);
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
      <RemoveClient
        show={removeClient}
        removeassociate={removeAssociate}
        removeassociatename={removeAssociateName}
        onHide={() => setRemoveClient(false)}
      />
    </TableContainer>
  );
}

export default FourClients;
