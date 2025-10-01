import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Header from "../../Components/Header/Header";
import RewardSuccess from "../../Components/Modals/RewardSuccess/RewardSuccess";
import {
  getReferralLink,
  getReferralRewards,
  getReferralList,
  redeemReferralPoints,
} from "../../services/redux/middleware/referral";
import "./ReferFriend.css";

const ReferFriend = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [invitedFriends, setInvitedFriends] = useState([]);
  const [referralLink, setReferralLink] = useState("");
  const [rewards, setRewards] = useState({
    totalReferrals: 0,
    pendingRewards: 0,
    redeemedRewards: 0,
    contractsEarned: 1,
    lockersEarned: 1,
  });
  const [loading, setLoading] = useState(true);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const invitedCount = invitedFriends.length || 0;
  const hasEarnedRewards = invitedCount >= 3;
  const canRedeem = hasEarnedRewards && rewards.pendingRewards > 0;

  const fallbackReferralLink = useMemo(() => {
    const userId = localStorage.getItem("_id");
    const baseUrl = window.location.origin;
    return `${baseUrl}/SignUp?ref=${userId ?? ""}`;
  }, []);

  useEffect(() => {
    const fetchReferralData = async () => {
      setLoading(true);
      try {
        const linkResult = await dispatch(getReferralLink()).unwrap();
        if (linkResult?.data?.referralLink) {
          setReferralLink(linkResult.data.referralLink);
        } else {
          setReferralLink(fallbackReferralLink);
        }

        const rewardsResult = await dispatch(getReferralRewards()).unwrap();
        if (rewardsResult?.data) {
          setRewards({
            totalReferrals: rewardsResult.data.totalReferrals || 0,
            pendingRewards: rewardsResult.data.pendingRewards || 0,
            redeemedRewards: rewardsResult.data.redeemedRewards || 0,
            contractsEarned: rewardsResult.data.contractsEarned || 1,
            lockersEarned: rewardsResult.data.lockersEarned || 1,
          });
        }

        const listResult = await dispatch(getReferralList()).unwrap();
        if (listResult?.data && Array.isArray(listResult.data)) {
          setInvitedFriends(listResult.data);
        }
      } catch (error) {
        console.error("Error fetching referral data:", error);
        toast.error(error?.message || "Failed to load referral data");
        setReferralLink(fallbackReferralLink);
      } finally {
        setLoading(false);
      }
    };

    fetchReferralData();
  }, [dispatch, fallbackReferralLink]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink || fallbackReferralLink);
      toast.success("Referral link copied to clipboard");
    } catch (e) {
      toast.info("Copied: " + (referralLink || fallbackReferralLink));
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join PocketFiler",
          url: referralLink || fallbackReferralLink,
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          console.log("Share error:", error);
        }
      }
    } else {
      handleCopy();
    }
  };

  const handleRedeem = async () => {
    if (!canRedeem) {
      if (invitedCount < 3) {
        toast.warning("You need at least 3 friends to redeem rewards");
      } else {
        toast.warning("No pending rewards available to redeem");
      }
      return;
    }

    setIsRedeeming(true);
    try {
      const result = await dispatch(redeemReferralPoints({})).unwrap();
      if (result?.status === 200 || result?.status === 201) {
        const rewardsResult = await dispatch(getReferralRewards()).unwrap();
        if (rewardsResult?.data) {
          setRewards({
            totalReferrals: rewardsResult.data.totalReferrals || 0,
            pendingRewards: rewardsResult.data.pendingRewards || 0,
            redeemedRewards: rewardsResult.data.redeemedRewards || 0,
            contractsEarned: rewardsResult.data.contractsEarned || 1,
            lockersEarned: rewardsResult.data.lockersEarned || 1,
          });
        }

        setShowSuccessModal(true);
      } else {
        toast.error("Failed to redeem rewards");
      }
    } catch (error) {
      console.error("Error redeeming rewards:", error);
      toast.error(error?.message || "Failed to redeem rewards");
    } finally {
      setIsRedeeming(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header
          headername={"Refer a friend"}
          showBack
          onBack={() => navigate(-1)}
        />
        <div className="refer__container">
          <div className="refer__card">
            <p className="refer__desc">Loading referral data...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header
        headername={"Refer a friend"}
        showBack
        onBack={() => navigate(-1)}
      />
      <div className="refer__container">
        <div className="refer__card">
          <h3 className="refer__title">Invite your friends to PocketFiler</h3>
          <p className="refer__desc ">
            When three friends sign up using your code, you'll receive 1
            contract and 1 encrypted locker. The more friends who join, the more
            rewards you earn.
          </p>

          <div className="refer__label">My referral link</div>
          <div className="refer__row">
            <div className="refer__left">
              <div className="refer__input refer__input--compact">
                <span className="refer__link">
                  {(referralLink || fallbackReferralLink)
                    .replace("https://", "")
                    .replace("http://", "")}
                </span>
                <div className="refer__actions">
                  <button
                    onClick={handleCopy}
                    aria-label="Copy link"
                    tabIndex={0}
                  >
                    <img src="/Images/Clients/copylink.svg" alt="copy" />
                  </button>
                  <button
                    onClick={handleShare}
                    aria-label="Share link"
                    tabIndex={0}
                  >
                    <img
                      src="/Images/Contract/share-06.svg"
                      alt="share"
                      className="share-icon"
                    />
                  </button>
                </div>
              </div>
            </div>
            {hasEarnedRewards && (
              <button
                className="refer__redeem"
                type="button"
                disabled={!canRedeem || isRedeeming}
                onClick={handleRedeem}
                aria-label="Redeem reward"
                tabIndex={0}
              >
                <span className="refer__redeem-title">
                  {isRedeeming ? "Redeeming..." : "Redeem Reward"}
                </span>
                <span className="refer__redeem-sub">
                  {rewards.contractsEarned} contract
                  {rewards.contractsEarned > 1 ? "s" : ""} &{" "}
                  {rewards.lockersEarned} encrypted locker
                  {rewards.lockersEarned > 1 ? "s" : ""}
                </span>
              </button>
            )}
          </div>

          <div className="refer__count">
            <span className="refer__count-title">Friends invited:</span>
            <span className="refer__count-values">
              <span className="refer__count-num">{invitedCount}</span>
              <span className="refer__count-slash">/</span>
              <span className="refer__count-total">3</span>
            </span>
          </div>
        </div>

        <div className="refer__list">
          <h3 className="refer__title">Invited friends</h3>
          {invitedFriends.length === 0 ? (
            <p className="refer__empty">No one joined yet…</p>
          ) : (
            <div className="invited__grid">
              {invitedFriends.map((friend, idx) => (
                <div key={idx} className="invited__item">
                  <div className="invited__avatar">
                    {friend?.name?.[0]?.toUpperCase() ??
                      friend?.email?.[0]?.toUpperCase() ??
                      "?"}
                  </div>
                  <div>
                    <div className="invited__name">
                      {friend?.name ?? "Friend"}
                    </div>
                    <div className="invited__email">
                      {friend?.email ?? "user@example.com"}
                    </div>
                    {friend?.referredDate && (
                      <div className="invited__date">
                        Joined:{" "}
                        {new Date(friend.referredDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <RewardSuccess
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        contractsEarned={rewards.contractsEarned}
        lockersEarned={rewards.lockersEarned}
      />
    </>
  );
};

export default ReferFriend;
