import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../../Components/Header/Header";
import "./ReferFriend.css";

const ReferFriend = () => {
  const navigate = useNavigate();
  const [invitedFriends] = useState([]); // replace with API data when available
  const invitedCount = invitedFriends.length || 0;
  const referralLink = useMemo(() => {
    const userId = localStorage.getItem("_id");
    const baseUrl = window.location.origin;
    return `${baseUrl}/SignUp?ref=${userId ?? ""}`;
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      toast.success("Referral link copied to clipboard");
    } catch (e) {
      toast.info("Copied: " + referralLink);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: "Join PocketFiler", url: referralLink });
    } else {
      handleCopy();
    }
  };

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
            When three friends sign up using your code, you’ll receive 1
            contract and 1 encrypted locker. The more friends who join, the more
            rewards you earn.
          </p>

          <div className="refer__label">My referral link</div>
          <div className="refer__row">
            <div className="refer__left">
              <div className="refer__input refer__input--compact">
                <span className="refer__link">
                  {referralLink.replace("https://", "").replace("http://", "")}
                </span>
                <div className="refer__actions">
                  <button onClick={handleCopy} aria-label="Copy link">
                    <img src="/Images/Clients/copylink.svg" alt="copy" />
                  </button>
                  <button onClick={handleShare} aria-label="Share link">
                    <img src="/Images/Projects/share-06.svg" alt="share" />
                  </button>
                </div>
              </div>
            </div>
            <button
              className="refer__redeem"
              type="button"
              disabled={invitedCount < 3}
            >
              <span className="refer__redeem-title">Redeem Reward</span>
              <span className="refer__redeem-sub">
                1 contract & 1 encrypted locker
              </span>
            </button>
          </div>

          <div className="refer__count">
            <span className="refer__count-title">Friends invited:</span>
            <span className="refer__count-values">
              <span className="refer__count-num">{invitedCount}</span>
              <span className="refer__count-slash">/</span>
              <span className="refer__count-total">6</span>
            </span>
          </div>
        </div>

        <div className="refer__list">
          <h3 className="refer__title">Invited friends</h3>
          {invitedFriends.length === 0 ? (
            <p className="refer__empty">No one joined yet…</p>
          ) : (
            <div className="invited__grid">
              {invitedFriends.map((f, idx) => (
                <div key={idx} className="invited__item">
                  <div className="invited__avatar">{f?.name?.[0] ?? "?"}</div>
                  <div>
                    <div className="invited__name">{f?.name ?? "Friend"}</div>
                    <div className="invited__email">
                      {f?.email ?? "user@example.com"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ReferFriend;
