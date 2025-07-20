import Button from "@mui/material/Button";
import Modal from "react-bootstrap/Modal";
import * as React from "react";
import ContractEditor from "../ContractEditor/ContractEditor";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setContract } from "../../../services/redux/reducer/addcontract";
import { SuccessToast, ErrorToast } from "../../toast/Toast";
import Contract from "../Contract/Contract";
import { editcontract } from "../../../services/redux/middleware/contract";
import { viewcontract } from "../../../services/redux/middleware/contract";
import { getAllContract } from "../../../services/redux/middleware/getAllContract";
import { getContract } from "../../../services/redux/middleware/getContract";
import { editcontractSignDate } from "../../../services/redux/middleware/contract";

export default function EditContractNameType(props) {
  const dispatch = useDispatch();
  const [modalShow, setModalShow] = useState(false);
  const [modalPreview, setModalPreview] = useState(false);
  const [contractNames, setContractName] = useState("");
  const [contractType, setContractType] = useState("");
  const [UserID, setUserID] = useState("");

  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const userid = localStorage.getItem("_id");
    console.log("user id ", userid);
    setUserID(userid);
  }, [UserID]);

  const formValidation = () => {
    if (!contractNames) {
      ErrorToast("Please Enter Contract Name");
      return false;
    } else if (!contractType) {
      ErrorToast("Please Enter Contract Type ");
      return false;
    }
  };
  console.log(props, "this is the preview modal");

  async function handleContinue() {
    const res = formValidation();
    if (res === false) {
      return false;
    }
    setLoader(true);
    try {
      const data = {
        userId: UserID,
        id: props.ContractID,
        category: contractType,
        contractName: contractNames,
      };
      const dataall = {
        id: UserID,
        page: 1,
      };
      dispatch(editcontract(data)).then((res) => {
        if (res?.payload?.status === 200) {
          setLoader(false);
          console.log("Edit name and type  res", res?.payload?.data);
          dispatch(getAllContract(dataall));
          dispatch(viewcontract(props.ContractID));
          dispatch(getContract(UserID));
          SuccessToast("Edited Successfully");
          props?.editable(true);

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

  const ContractPreviousData = useSelector(
    (state) => state?.getviewcontract?.viewContract?.data
  );

  console.log("Contract Previous Data", ContractPreviousData);

  useEffect(() => {
    setContractName(ContractPreviousData?.contractName || "");
    setContractType(ContractPreviousData?.category || "");
  }, [ContractPreviousData]);
  return (
    <>
      <Modal
        {...props}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="add-contract-modal"
      >
        <Modal.Header
          style={{ padding: "70px", paddingBottom: "0px", paddingTop: "60px" }}
        >
          <Modal.Title
            id="contained-modal-title-vcenter"
            className="add-project__header add-contract-header"
          >
            <div className="add-contract-m-heading">
              <h6 className="mb-0 ">Edit contract</h6>
              <p>Fill the details below to create contract</p>
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
            <div className="add-contract__input">
              <label className="contract-name-head">Contract name</label>
              <input
                type="text"
                placeholder="Enter Contract name "
                onChange={(e) => setContractName(e.target.value)}
                value={contractNames}
              />
            </div>
            <div className="add-contract__input contract-top">
              <label className="contract-name-head">Type</label>
              <input
                type="text"
                placeholder="Enter Contract type"
                className="input-contract"
                onChange={(e) => setContractType(e.target.value)}
                value={contractType}
              />
            </div>

            <div className="add-contract__main-btn">
              <Button
                className="continue-add-btn "
                onClick={handleContinue}
                // onClick={() => setModalShow(true)}
              >
                Update
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <ContractEditor show={modalShow} onHide={() => setModalShow(false)} />
      {/* <Contract show={modalPreview} onHide={() => setModalPreview(false)} /> */}
    </>
  );
}
