import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Folder01, LinkIcon, SettingsIcon } from "../../assets/svgs";
import AddLockerModalWeb from "../../Components/Modals/AddLockerModalWeb";
import SettingsModalWeb from "../../Components/Modals/SettingsModalWeb";
import "./LockerScreen.css";

function LockerScreen() {
  const navigate = useNavigate();
  const { lockerName } = useParams();
  const decodedLockerName = decodeURIComponent(lockerName || "Locker");

  const [folders, setFolders] = useState(() => [
    { id: "test1", name: "Test Folder 1", createdAt: new Date().toISOString() },
  ]);
  const [files, setFiles] = useState([]);
  const [showAddFolderModal, setShowAddFolderModal] = useState(false);
  const [showShareLockerModal, setShowShareLockerModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  function handleCreateFolder({ name }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newFolder = { id: String(Date.now()), name, createdAt: new Date().toISOString() };
        setFolders((prev) => [...prev, newFolder]);
        resolve(newFolder);
      }, 500);
    });
  }

  function handleShareLocker({ associates }) {
    return new Promise((resolve) => setTimeout(() => resolve(associates), 400));
  }

  const isEmpty = useMemo(() => folders.length === 0 && files.length === 0, [folders, files]);

  return (
    <div className="ls-container">
      <div className="ls-header">
        <button className="ls-back" onClick={() => navigate(-1)} aria-label="Back">←</button>
        <div className="ls-header-title">{decodedLockerName}</div>
      </div>

      <div className="ls-actions">
        <button className="ls-primary-sm">Add Associate</button>
        <button className="ls-icon-btn" onClick={() => setShowShareLockerModal(true)}><LinkIcon width={20} height={20} /></button>
        <button className="ls-icon-btn" onClick={() => setShowSettingsModal(true)}><SettingsIcon width={20} height={20} /></button>
      </div>

      <div className="ls-scroll">
        {isEmpty ? (
          <div className="ls-card ls-empty-card">
            <div className="ls-empty-stack">
              <div className="ls-empty-icon">📁<span className="ls-empty-badge">+</span></div>
              <div className="ls-empty-title">No Files Uploaded Yet</div>
              <div className="ls-empty-desc">Upload your first file to securely store and manage it in this locker.</div>
              <div className="ls-row-gap">
                <button className="ls-primary">Upload File</button>
                <button className="ls-outline" onClick={() => setShowAddFolderModal(true)}>Create Folder</button>
              </div>
              <div className="ls-foot-note">Up to 5MB only (no larger)</div>
            </div>
          </div>
        ) : (
          <>
            <div className="ls-card">
              <div className="ls-row-between ls-row-center">
                <div className="ls-section-title">Folders</div>
                <button className="ls-outline" onClick={() => setShowAddFolderModal(true)}>Create Folder</button>
              </div>
              {folders.length === 0 ? (
                <div className="ls-empty-list">No folders created yet</div>
              ) : (
                <div className="ls-grid">
                  {folders.map((item) => (
                    <div key={item.id} className="ls-tile">
                      <Folder01 />
                      <div className="ls-tile-texts">
                        <div className="ls-tile-title">{item.name}</div>
                        <div className="ls-tile-sub">In my locker</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="ls-card">
              <div className="ls-row-between ls-row-center">
                <div className="ls-section-title">Files</div>
                <button className="ls-outline">Upload File</button>
              </div>
              {files.length === 0 ? (
                <div className="ls-empty-list">No files uploaded yet</div>
              ) : (
                <div className="ls-grid">
                  {files.map((item) => (
                    <div key={item.id} className="ls-tile">
                      <Folder01 />
                      <div className="ls-tile-texts">
                        <div className="ls-tile-title">{item.name}</div>
                        <div className="ls-tile-sub">In my locker</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <AddLockerModalWeb
        visible={showAddFolderModal}
        onClose={() => setShowAddFolderModal(false)}
        onCreateLocker={handleCreateFolder}
        modalType="folder"
        lockerName={decodedLockerName}
        onShareLocker={handleShareLocker}
      />

      <AddLockerModalWeb
        visible={showShareLockerModal}
        onClose={() => setShowShareLockerModal(false)}
        onCreateLocker={handleCreateFolder}
        modalType="share"
        lockerName={decodedLockerName}
        onShareLocker={handleShareLocker}
      />

      <SettingsModalWeb
        visible={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        lockerName={decodedLockerName}
      />
    </div>
  );
}

export default LockerScreen;


