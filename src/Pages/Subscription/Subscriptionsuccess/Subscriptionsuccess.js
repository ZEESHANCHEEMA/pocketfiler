import React, { useState, useEffect } from "react";
import Sidebar from "../../../Components/Sidebar/Sidebar";

import Header from "../../../Components/Header/Header";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ScreenLoader from "../../../Components/loader/ScreenLoader";
import SubscriptionSuccess from "../../../Components/Cards/SubscriptionSuccess/SubscriptionSuccess";
import "./subsuccess.css";
export default function Subscriptionsuccess() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loader, setLoader] = useState(false);

  return (
    <>
      {/* <Header headername={"Dashboard"} /> */}
      {/* {loader && <ScreenLoader />} */}

      <div className="sub-main">
       
          <SubscriptionSuccess />
      
      </div>
    </>
  );
}
