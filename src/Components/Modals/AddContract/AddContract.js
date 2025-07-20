import Button from "@mui/material/Button";
import Modal from "react-bootstrap/Modal";
import "./AddContract.css";
import * as React from "react";
import ContractEditor from "../ContractEditor/ContractEditor";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setContract } from "../../../services/redux/reducer/addcontract";
import { SuccessToast, ErrorToast } from "../../toast/Toast";
import Contract from "../Contract/Contract";
import { getContract } from "../../../services/redux/middleware/getContract";

export default function AddContract(props) {
  const dispatch = useDispatch();
  const [modalShow, setModalShow] = useState(false);
  const [modalPreview, setModalPreview] = useState(false);
  const [contractName, setContractName] = useState("");
  const [contractType, setContractType] = useState("");
  const [loader, setLoader] = useState(false);

  const [UserId, setUserId] = useState();

  useEffect(() => {
    const userid = localStorage.getItem("_id");
    console.log("user id ", userid);
    setUserId(userid);
    dispatch(getContract(userid));
  }, []);

  const formValidation = () => {
    if (!contractName) {
      ErrorToast("Please Enter Contract Name");
      return false;
    } else if (!contractType) {
      ErrorToast("Please Enter Contract Type ");
      return false;
    }
  };

  const handleContinue = () => {
    const res = formValidation();
    if (res === false) {
      return false;
    }
    setLoader(true);
    dispatch(setContract({ name: contractName, type: contractType }));
    dispatch(getContract(UserId));
    // SuccessToast("Contract Added Successfully");

    if (props?.showpreview) {
      setModalShow(true);
    } else {
      setModalPreview(true);
      setModalShow(false);
      props.onHide();
    }
    // props.onHide();
  };
  const contract = useSelector((state) => state?.addcontract);
  console.log("contract is", contract);

  const contractNames = useSelector(
    (state) => state?.addcontract?.contract?.name
  );
  console.log("My Contract Name is", contractNames);

  const contractTypes = useSelector(
    (state) => state?.addcontract?.contract?.type
  );
  console.log("My Contract Type is", contractTypes);

  useEffect(() => {
    setContractName(contractNames || "");
    setContractType(contractTypes || "");
  }, [contractTypes, contractNames]);

  console.log(props, "this is props in the hidedede", props);
  return (
    <>
      <Modal
        {...props}
        // size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
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
              <h6 className="mb-0 ">Add contract</h6>
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
                maxLength={40}
                onChange={(e) => setContractName(e.target.value)}
                value={contractName}
              />
            </div>
            <div className="add-contract__input contract-top">
              <label className="contract-name-head">Type</label>
              <input
                type="text"
                placeholder="Enter Contract type"
                className="input-contract"
                maxLength={20}
                onChange={(e) => setContractType(e.target.value)}
                value={contractType}
              />
            </div>

            <div className="add-contract__main-btn">
              <Button className="continue-add-btn " onClick={handleContinue}>
                Continue
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <ContractEditor
        show={modalShow}
        onHide={() => setModalShow(false)}
        setModalShow={props?.setModalShow}
      />
      <Contract
        show={modalPreview}
        onHide={() => setModalPreview(false)}
        onHideAdd={props?.onHideAdd}
      />
    </>
  );
}
