import Button from "@mui/material/Button";
import Modal from "react-bootstrap/Modal";
import "./ShareContract.css";
import * as React from "react";
import ContractEditor from "../ContractEditor/ContractEditor";
import { useState, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { useDispatch, useSelector } from "react-redux";
import { getUserAssociate } from "../../../services/redux/middleware/getUserAssociate";
import { sharecontract } from "../../../services/redux/middleware/contract";
import ScreenLoader from "../../../Components/loader/ScreenLoader";
import { useNavigate } from "react-router-dom";
import { SuccessToast, ErrorToast } from "../../toast/Toast";

export default function ShareContract(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modalShow, setModalShow] = useState(false);
  const [UserID, setUserID] = useState("");
  const [UserClickID, setUserClickID] = useState("");
  const [selectedClientId, setSelectedClientID] = useState("");
  const [loader, setLoader] = useState(false);
  const [email, setEmail] = useState("");

  const UserAssociates = useSelector(
    (state) => state?.getUserAssociates?.user_associates?.data
  );
  console.log("🔍 ShareContract: My Associates", UserAssociates);
  console.log("🔍 ShareContract: First associate structure:", UserAssociates?.[0]);

  const userLoading = useSelector((state) => state?.getUserAssociates);

  const handleSelectClient = (item) => {
    console.log("🔍 ShareContract: handleSelectClient called with item:", item);
    console.log("🔍 ShareContract: item structure:", {
      hasId: !!item?._id,
      hasEmail: !!item?.email,
      itemKeys: Object.keys(item || {})
    });
    
    setUserClickID(item);
    
    // Since we're passing item.user from the dropdown, access _id directly
    if (item?._id) {
      setSelectedClientID(item._id);
      console.log("🔍 ShareContract: Set selectedClientID to:", item._id);
    } else {
      console.error("🔍 ShareContract: Could not find _id in item:", item);
      setSelectedClientID("");
    }
  };

  useEffect(() => {
    const userid = localStorage.getItem("_id");
    console.log("user id ", userid);
    setUserID(userid);
    dispatch(getUserAssociate(userid));
  }, [UserID]);

  async function ShareContract() {
    try {
      if (!selectedClientId && !email) {
        ErrorToast("Please Add client with dropdown or with email");
        return;
      }
      if (selectedClientId && email) {
        ErrorToast("Please Select between two");
        return;
      }
      setLoader(true);

      const data = {
        contract_to_userId: selectedClientId,
        contractId: props.ContractID,
        userId: UserID,
        email: email,
      };

      dispatch(sharecontract(data)).then((res) => {
        if (res?.payload?.status === 200) {
          setLoader(false);
          console.log("Contract Share success", res?.payload?.data);
          SuccessToast("Contract Shared Successfully");

          // navigate("/Dashboard");
          props.onHide();
        } else {
          setLoader(false);
          ErrorToast(res?.payload?.message);
        }
      });
    } catch (error) {
      console.error("Error:", error);
    }
  }
  return (
    <>
      {loader && <ScreenLoader />}

      <Modal
        {...props}
        // size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="share-contract-modal"
      >
        <Modal.Header
          style={{ padding: "70px", paddingBottom: "0px", paddingTop: "60px" }}
        >
          <Modal.Title
            id="contained-modal-title-vcenter"
            className="add-project__header add-contract-header"
          >
            <div className="add-contract-m-heading">
              <h6 className="mb-0 ">Share contract </h6>
              <p>Choose a client below or share by email </p>
            </div>
            <div className="add-project__close add-contract-close">
              <img
                src="/Images/Projects/close.svg"
                alt="close-icon"
                onClick={props.onHide}
              />
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{ padding: "70px", paddingTop: "50px", paddingBottom: "60px" }}
        >
          <div className="add-project-body">
            <div className="add-contract__input ">
              <label className="contract-name-head">Add client</label>
              <div className="drop-main">
                <Dropdown className="drop-add-client-org">
                  <Dropdown.Toggle
                    // id="dropdown-basic"
                    className="dropdown-add-client-org"
                  >
                    {UserClickID ? UserClickID?.email : "Select Client"}
                    <img
                      className="dropdown__image-project"
                      src="/Images/HelpCenter/arrow.svg"
                      alt="arrow"
                    />
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {UserAssociates?.length > 0
                      ? UserAssociates?.map((item, index) => (
                          <Dropdown.Item
                            key={index}
                            // href={`#/action-${index + 1}`}

                            onClick={() => handleSelectClient(item?.user)}
                          >
                            {item?.user?.email}
                          </Dropdown.Item>
                        ))
                      : 
                      (<div>
                        <p className="no-client-txt">No Client Found</p>
                      </div>)}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
            <div className="Or-div-org">
              <p className="or-add-client">Or share by email</p>
              <hr className="custom-hr-org"></hr>
            </div>
            <div className="add-contract__input">
              <label className="contract-name-head">Email address</label>
              <input
                type="email"
                placeholder="Enter email "
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="add-contract__main-btn">
              <Button
                className="continue-add-btn "
                onClick={ShareContract}
                // onClick={() => setModalShow(true)}
              >
                Share contract
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <ContractEditor show={modalShow} onHide={() => setModalShow(false)} />
    </>
  );
}
