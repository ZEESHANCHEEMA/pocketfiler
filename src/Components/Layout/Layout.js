import React, { useEffect } from "react";
import eventEmitter from "../../utils/Firebase/eventEmitter";
import { Outlet, useNavigate, useNavigation } from "react-router-dom";
import { CloseFullscreen } from "@mui/icons-material";

function Layout() {
  const navigate = useNavigate();
  useEffect(() => {
    const listener = (data) => {
      console.log(data, "datadatadatadatadata");

      acceptCall(data);
    };

    eventEmitter.addListener("navigateToScreen", listener);

    return () => {
      eventEmitter.removeListener("navigateToScreen", listener);
    };
  }, []);

  const acceptCall = ({
    call_type,
    callId,
    channel_name,
    channel_token,
    userId,
  }) => {
    console.log("✅ Call Accepted:", {
      call_type,
      callId,
      channel_name,
      channel_token,
      userId,
    });
    const tokenDetails = {
      channel_name: channel_name,
      channel_token: channel_token,
    };
    const userid = localStorage.getItem("_id");

    const datavideo = {
      userId: userid,
      activityMsg: "Video-Call",
      msgUrl: tokenDetails,
    };

    if (call_type == "video_call") {
      console.log("getDatagetDatagetDatagetDatagetData");
      navigate(`/ProjectActivities/VideoCall/${channel_name}`, {
        state: {
          callData: datavideo,
        },
      });
    } else {
      const dataAudio = {
        userId: userid,
        activityMsg: "Audio-Call",
        msgUrl: tokenDetails,
      };
      navigate(`/ProjectActivities/AudioCall/${channel_name}`, {
        state: {
          callData: dataAudio,
          // projectId: projectid,
        },
      });
    }
  };
  return <Outlet />;
}

export default Layout;
