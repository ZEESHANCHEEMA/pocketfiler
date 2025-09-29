import React from "react";
import AddLockerModalWeb from "./AddLockerModalWeb";

function AddAssociateModalWeb({
  visible,
  onClose,
  lockerName,
  onShare,
  associateOptions,
}) {
  return (
    <AddLockerModalWeb
      visible={visible}
      onClose={onClose}
      modalType="share"
      lockerName={lockerName}
      onShareLocker={onShare}
      associateOptions={associateOptions}
    />
  );
}

export default AddAssociateModalWeb;
