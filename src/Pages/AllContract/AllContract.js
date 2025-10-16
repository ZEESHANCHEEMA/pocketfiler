import React, { useState, useEffect } from "react";
import "./AllContract.css";
import Button from "@mui/material/Button";
import { useMediaQuery } from "react-responsive";
import Dropdown from "react-bootstrap/Dropdown";
import AllContractTable from "../../Components/Tables/AllContracts/AllContractsTable";
import Header from "../../Components/Header/Header";
import AddContract from "../../Components/Modals/AddContract/AddContract";
import { useDispatch, useSelector } from "react-redux";
import { getAllContract } from "../../services/redux/middleware/getAllContract";
import ScreenLoader from "../../Components/loader/ScreenLoader";
import { LatestProjContract } from "../../services/redux/middleware/Project/project";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function AllContract() {
  const dispatch = useDispatch();

  const [loader, setLoader] = useState(false);
  const [UserID, setUserID] = useState("");
  const [opensearch, setOpenSearch] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [noContract, setShowNoContract] = useState(true);
  const [noproject, setShowNoProject] = useState(true);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [value, setValue] = useState(null); // Changed from new Date().getFullYear() to null
  const [searchQuery, setSearchQuery] = useState("");

  const [showDropdown, setShowDropdown] = useState(false); // State to manage the dropdown visibility
  const isMobile = useMediaQuery({
    query: "(max-width: 768px)",
  });
  const handleSearchInput = () => {
    setOpenSearch((prevOpensearch) => !prevOpensearch);
  };

  const ContractAllData = useSelector(
    (state) => state?.getAllContract?.allcontract
  );
  console.log("All Contract DATASS", ContractAllData);

  const userLoading = useSelector((state) => state?.getAllContract);

  useEffect(() => {
    const userid = localStorage.getItem("_id");
    console.log("user id ", userid);
    setUserID(userid);

    const data =
      searchQuery?.length > 0
        ? {
            id: userid,
            search: searchQuery,
            page: 1,
            // Only include year if it's selected (not null)
            ...(value && { year: value }),
          }
        : {
            id: userid,
            page: 1,
            // Only include year if it's selected (not null)
            ...(value && { year: value }),
          };

    dispatch(getAllContract(data));
    dispatch(LatestProjContract(userid));
  }, [value, searchQuery]);

  const LatestContract = useSelector(
    (state) => state?.getLatestProjCon?.myData?.data?.contract
  );
  console.log("MY LATEST CONTRACT ", LatestContract);

  async function Addcontract() {
    // if (LatestContract <= 0) {
    //   ErrorToast("No Contract Found");
    // } else {
    setModalShow(true);
    // }
  }

  const handleYearSelect = (selectedDate) => {
    setValue(selectedDate.getFullYear());
    setShowDropdown(false); // Close the dropdown when a date is selected
  };

  const handleClearYearFilter = () => {
    setValue(null);
    setShowDropdown(false);
  };

  return (
    <>
      <Header headername={"Contracts"} />
      {userLoading.loading && <ScreenLoader />}

      <div className="Dash-body">
        <div className="contract-contain pb-allcontract">
          <div className="contract-r1 pb-0 clients-toolbar">
            <p className="contract-head">Contracts</p>

            <div className="contract-rhs">
              {/* mobile floating search icon removed; input is always visible */}
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
                  placeholder="Search contracts..."
                  className="search-input-contract "
                  style={isMobile ? { paddingLeft: "48px" } : undefined}
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
                    <span>{value ?? "All Years"}</span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <div
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <button
                        onClick={handleClearYearFilter}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#007bff",
                          cursor: "pointer",
                          fontSize: "14px",
                          padding: "5px 10px",
                          borderRadius: "4px",
                          width: "100%",
                          textAlign: "left",
                        }}
                        onMouseOver={(e) =>
                          (e.target.style.backgroundColor = "#f8f9fa")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.backgroundColor = "transparent")
                        }
                      >
                        Clear Filter (Show All Years)
                      </button>
                    </div>
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
                  onClick={() => Addcontract()}
                >
                  Add Contract
                </Button>
                <AddContract
                  show={modalShow}
                  onHide={() => setModalShow(false)}
                  setModalShow={setModalShow}
                  showpreview={true}
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
                placeholder="Search contracts..."
                className="search-input-contract"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
          <p className="total-contracts-txt">
            Total {ContractAllData?.data?.totalCount}
            {ContractAllData?.data?.totalCount < 2 ? " contract" : " contracts"}
          </p>
          {ContractAllData?.data?.contracts?.length > 0 ? (
            <AllContractTable year={value} />
          ) : (
            <div className="empty__state-main">
              <div className="empty__state-contract">
                <img src="/Images/Contract/empty.svg" alt="/" />
                <p className="empty__state-head">No Contract Available</p>
                <p className="empty__state-p">
                  You have currently no contract at this moment
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
