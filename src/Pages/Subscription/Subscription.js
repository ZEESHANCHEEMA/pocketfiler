import React, { useState, useEffect } from "react";
import "./Subscription.css";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Header from "../../Components/Header/Header";
import { RxDotFilled } from "react-icons/rx";
import { useMediaQuery } from "react-responsive";
import { useDispatch, useSelector } from "react-redux";
import { addSubscription } from "../../services/redux/middleware/Project/project";
import ScreenLoader from "../../Components/loader/ScreenLoader";
import { SuccessToast, ErrorToast } from "../../Components/toast/Toast";
import { duration } from "@mui/material";
import { getSubscription } from "../../services/redux/middleware/Project/project";

const Subscription = () => {
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [UserID, setUserId] = useState();
  const [isYearly, setIsYearly] = useState(false);

  const SubscriptionOwned = useSelector(
    (state) => state?.getSubscription?.allsubscription?.data?.subscriptionType
  );
  console.log("My Subscription is", SubscriptionOwned);
  // const SubscriptionOwned = "pro";
  useEffect(() => {
    const userid = localStorage.getItem("_id");
    setUserId(userid);
    console.log("user id ", userid);
    dispatch(getSubscription(userid));
  }, []);

  const slides = [
    <div className="Subscription__card1">
      <div className="Subscription__card1-head">
        <img src="/Images/Subscription/lovely.svg" alt="/" />
        <h4>Free</h4>
      </div>
      <p className="Subscription__card1-head-p">Perfect plan to get started</p>
      <div className="Subscription__card1-head-amount">
        <h4>$0</h4>
        <p>/month</p>
      </div>
      <p className="Subscription__card1-head-amount-p">
        A free plan grants you access to some cool features of Spend.In.
      </p>
      <div className="Subscription__card1-body">
        <div className="Subscription__card1-body-txt">
          <img src="/Images/Subscription/tick-circle.svg" alt="/" />
          <p>Sync across device</p>
        </div>
        <div className="Subscription__card1-body-txt">
          <img src="/Images/Subscription/tick-circle.svg" alt="/" />
          <p>5 workspace</p>
        </div>
        <div className="Subscription__card1-body-txt">
          <img src="/Images/Subscription/tick-circle.svg" alt="/" />
          <p>Collaborate with 5 Clients</p>
        </div>
        <div className="Subscription__card1-body-txt">
          <img src="/Images/Subscription/cross-circle.svg" alt="/" />
          <p className="Subscription__card1-body-txt1">Sharing permission</p>
        </div>
        <div className="Subscription__card1-body-txt">
          <img src="/Images/Subscription/cross-circle.svg" alt="/" />
          <p className="Subscription__card1-body-txt1">Admin tools</p>
        </div>
        <div className="Subscription__card1-body-txt">
          <img src="/Images/Subscription/cross-circle.svg" alt="/" />
          <p className="Subscription__card1-body-txt1">100+ integrations</p>
        </div>
      </div>
      <button
        className="Subscription__card1-body-btn"
        onClick={(e) => handleSubscriptionMobile(0, "free")}
      >
        Current plan
      </button>
    </div>,
    <div className="Subscription__card1">
      <div className="Subscription__card1-header">
        <div className="Subscription__card1-head">
          <img src="/Images/Subscription/crown.svg" alt="/" />
          <h4>Pro</h4>
        </div>
        <div className="Subscription__card1-header-txt">
          <p>Popular</p>
        </div>
      </div>
      <p className="Subscription__card1-head-p">
        Perfect plan for professionals!
      </p>
      <div className="Subscription__card1-head-amount">
        <h4>$12</h4>
        <p>/month</p>
      </div>
      <p className="Subscription__card1-head-amount-p">
        For professional only! Start arranging your expenses with our best
        templates.
      </p>
      <div className="Subscription__card1-body">
        <div className="Subscription__card1-body-txt">
          <img src="/Images/Subscription/tick-circle.svg" alt="/" />
          <p>Everything in Free Plan</p>
        </div>
        <div className="Subscription__card1-body-txt">
          <img src="/Images/Subscription/tick-circle.svg" alt="/" />
          <p>Unlimited workspace</p>
        </div>
        <div className="Subscription__card1-body-txt">
          <img src="/Images/Subscription/tick-circle.svg" alt="/" />
          <p>Collaborative workspace</p>
        </div>
        <div className="Subscription__card1-body-txt">
          <img src="/Images/Subscription/tick-circle.svg" alt="/" />
          <p>Sharing permission</p>
        </div>
        <div className="Subscription__card1-body-txt">
          <img src="/Images/Subscription/tick-circle.svg" alt="/" />
          <p>Admin tools</p>
        </div>
        <div className="Subscription__card1-body-txt">
          <img src="/Images/Subscription/tick-circle.svg" alt="/" />
          <p>100+ integrations</p>
        </div>
      </div>
      <button
        className="Subscription__card1-body-btn"
        onClick={(e) => handleSubscriptionMobile(12, "pro")}
      >
        Get started
      </button>
    </div>,
    <div className="Subscription__card1">
      <div className="Subscription__card1-head">
        <img src="/Images/Subscription/ultimate.svg" alt="/" />
        <h4>Ultimate</h4>
      </div>
      <p className="Subscription__card1-head-p">
        Best suits for great company!
      </p>
      <div className="Subscription__card1-head-amount">
        <h4>$3</h4>
        <p>/month</p>
      </div>
      <p className="Subscription__card1-head-amount-p">
        If you a finance manager at big company, this plan is a perfect match.
      </p>
      <div className="Subscription__card1-body">
        <div className="Subscription__card1-body-txt">
          <img src="/Images/Subscription/tick-circle.svg" alt="/" />
          <p>Everything in Pro Plan</p>
        </div>
        <div className="Subscription__card1-body-txt">
          <img src="/Images/Subscription/tick-circle.svg" alt="/" />
          <p>Daily performance reports</p>
        </div>
        <div className="Subscription__card1-body-txt">
          <img src="/Images/Subscription/tick-circle.svg" alt="/" />
          <p>Dedicated assistant</p>
        </div>
        <div className="Subscription__card1-body-txt">
          <img src="/Images/Subscription/tick-circle.svg" alt="/" />
          <p>Artificial intelligence</p>
        </div>
        <div className="Subscription__card1-body-txt">
          <img src="/Images/Subscription/tick-circle.svg" alt="/" />
          <p>Marketing tools & automations</p>
        </div>
        <div className="Subscription__card1-body-txt">
          <img src="/Images/Subscription/tick-circle.svg" alt="/" />
          <p>Advanced security</p>
        </div>
      </div>
      <button
        className="Subscription__card1-body-btn"
        onClick={(e) => handleSubscriptionMobile(33, "ultimate")}
      >
        Get Started
      </button>
    </div>,
  ];

  const handleSubscriptionWeb = async (subscription, amount) => {
    setLoader(true);
    // setSelectedSubscription(subscription);

    try {
      const data = {
        price: amount,
        userId: UserID,
        duration: isYearly ? "yearly" : "monthly",
        subscriptionType: subscription.name,
      };
      console.log(subscription);

      dispatch(addSubscription(data)).then((res) => {
        if (res?.payload?.status === 200) {
          setLoader(false);
          const subscriptionUrl = res?.payload?.data;
          console.log("Subscription owned", subscriptionUrl);

          SuccessToast("Subscription Started Successfully");
          window.open(subscriptionUrl, "_blank");
          dispatch(getSubscription(UserID));

          // navigate("/Dashboard")
        } else if (res?.payload?.status === 201) {
          setLoader(false);
          SuccessToast("Subscription Started Successfully");
        } else {
          setLoader(false);
          ErrorToast(res?.payload?.message);
        }
      });
    } catch (error) {
      setLoader(false);
      console.error("Error:", error);
    }
  };

  const handleSubscriptionMobile = async (amount, type) => {
    setLoader(true);
    // setSelectedSubscription(subscription);

    try {
      const data = {
        price: amount,
        userId: UserID,
        duration: isYearly ? "yearly" : "monthly",
        subscriptionType: type,
      };

      dispatch(addSubscription(data)).then((res) => {
        if (res?.payload?.status === 200) {
          setLoader(false);
          const subscriptionUrl = res?.payload?.data;
          console.log("Subscription owned", subscriptionUrl);

          SuccessToast("Subscription Subscribed Successfully");
          window.open(subscriptionUrl, "_blank");

          // navigate("/Dashboard")
        } else if (res?.payload?.status === 201) {
          setLoader(false);
          SuccessToast("Subscription Subscribed Successfully");
        } else {
          setLoader(false);
          ErrorToast(res?.payload?.message);
        }
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const Slides = [
    {
      name: "free",
      descriptiontop: "Perfect plan to get started",
      amount: "0",
      image: "/Images/Subscription/lovely.svg",
      rank: "",
      description:
        "A free plan grants you access to some cool features of Spend.In.",
      features: [
        "Sync across device",
        "5 workspace",
        "Collaborate with 5 Clients",
        "Sharing permission",
        "Admin tools",
        "100+ integrations",
      ],
    },
    {
      name: "pro",
      descriptiontop: "Perfect plan for professionals!",
      amount: "39",
      image: "/Images/Subscription/crown.svg",
      rank: "Popular",
      description:
        "For professional only! Start arranging your expenses with our best templates.",
      features: [
        "Everything in Free Plan",
        "Unlimited workspace",
        "Collaborative workspace",
        "Sharing permission",
        "Admin tools",
        "100+ integrations",
      ],
    },
    {
      name: "ultimate",
      descriptiontop: "Best suits for great company!",
      amount: "390",
      image: "/Images/Subscription/ultimate.svg",
      rank: "",
      description:
        "If you a finance manager at big company, this plan is a perfect match.",
      features: [
        "Everything in Pro Plan",
        "Daily performance reports",
        "Dedicated assistant",
        "Artificial intelligence",
        "Marketing tools & automations",
        "Advanced security",
      ],
    },
  ];

  const [selectedSubscription, setSelectedSubscription] = useState(slides[0]);

  const handleSubscriptionSelect = (subscription) => {
    setSelectedSubscription(subscription);
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };
  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  const isMobile = useMediaQuery({
    query: "(max-width: 768px)",
  });

  const handleToggle = () => {
    setIsYearly(!isYearly);
  };
  console.log(isYearly);
  return (
    <>
      <Header headername={"Subscription"} />
      <>
        {loader && <ScreenLoader />}
        <div className="Subscription__top-div">
          {/* <div className="Subscription__top-div_switch">
            <p>Monthly</p>
            <label className="switch">
              <input
                type="checkbox"
                checked={isYearly}
                onChange={handleToggle}
              />
              <span className="slider"></span>
            </label>
            <p>Yearly</p>
          </div> */}
          <div className="Subscription__top-div_img">
            <p>Save 65%</p>
            <img src="/Images/Subscription/arrow.svg" alt="/" />
          </div>
        </div>

        <div className={!isMobile ? "Subscription__cards" : "d-none"}>
          {Slides.map((subscription, index) => (
            <div className="Subscription__card1" key={index}>
              <div className="Subscription__card1-header">
                <div className="Subscription__card1-head">
                  <img src={subscription.image} alt="/" />
                  <h4 style={{ textTransform: "capitalize" }}>
                    {subscription.name}
                  </h4>
                </div>
                {subscription.rank !== "" && (
                  <div className={"Subscription__card1-header-txt"}>
                    <p>{subscription.rank}</p>
                  </div>
                )}
              </div>

              <p className="Subscription__card1-head-p">
                {subscription.descriptiontop}
              </p>
              <div className="Subscription__card1-head-amount">
                <h4>${subscription.amount}</h4>
                <p>/month</p>
              </div>
              <p className="Subscription__card1-head-amount-p">
                {subscription.description}
              </p>
              <p className=" Subscription__card1-body">
                {subscription.features.map((feature, index) => (
                  <div key={index} className="Subscription__card1-body-txt">
                    {subscription.name === "free" &&
                    index >= subscription.features.length - 3 ? (
                      <img
                        src="/Images/Subscription/cross-circle.svg"
                        alt="/"
                      />
                    ) : (
                      <img src="/Images/Subscription/tick-circle.svg" alt="/" />
                    )}
                    <p>{feature}</p>
                  </div>
                ))}
              </p>
              <button
                // className="Subscription__card1-body-btn"
                className={` ${
                  SubscriptionOwned === subscription.name
                    ? "active-btn"
                    : "Subscription__card1-body-btn"
                }`}
                // onClick={() =>
                //   handleSubscription(subscription, subscription.amount)

                // }
                // disabled={SubscriptionOwned === subscription.name}
                onClick={() =>
                  handleSubscriptionWeb(subscription, subscription.amount)
                }
                disabled={SubscriptionOwned === subscription.name}
              >
                {SubscriptionOwned === subscription.name
                  ? "Current plan"
                  : "Get Started"}
              </button>
            </div>
          ))}
        </div>

        <div className={isMobile ? "Subscription__cards-mobile" : "d-none"}>
          {slides[currentIndex]}
        </div>
        <div className={isMobile ? "subscription__slider" : "d-none"}>
          {slides.map((slide, slideIndex) => (
            <div
              className=""
              key={slideIndex}
              onClick={() => goToSlide(slideIndex)}
            >
              <RxDotFilled size={40} className="subscription__slider" />
            </div>
          ))}
        </div>
      </>
    </>
  );
};

export default Subscription;
