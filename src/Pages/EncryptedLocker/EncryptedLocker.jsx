import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Folder01, Folder as Folders, FilterLines, DotsVertical } from "../../assets/svgs";
import AddLockerModalWeb from "../../Components/Modals/AddLockerModalWeb";
import "./EncryptedLocker.css";

function EncryptedLocker() {
  const navigate = useNavigate();
  const [showAddLockerModal, setShowAddLockerModal] = useState(false);
  const [lockers, setLockers] = useState(() => [
   ]);

  const gridLockers = useMemo(() => lockers, [lockers]);

  function handleCreateLocker({ name, associates }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newLocker = { id: String(Date.now()), name, associates, createdAt: new Date().toISOString() };
        setLockers((prev) => [...prev, newLocker]);
        resolve(newLocker);
      }, 500);
    });
  }

  return (
    <div className="el-container">
      <div className="el-header">
        <div className="el-header-title">Encrypted Locker</div>
      </div>

      <div className="el-content">
        {gridLockers.length === 0 ? (
          <div className="el-card py-20">
            <div className="el-empty">
              <div className="el-empty-icon"><Folders /></div>
              <div className="el-empty-title">No Lockers Created Yet</div>
              <div className="el-empty-desc">Start by creating your first locker to securely store, organize, and access your important files whenever you need them.</div>
              <button className="el-primary" onClick={() => setShowAddLockerModal(true)}>Create Locker</button>
            </div>
          </div>
        ) : (
          <div className="el-card">
            <div className="el-row el-row-between el-row-center">
              <div className="el-section-title">Your Lockers</div>
              <div className="el-actions">
                <button className="el-primary-sm" onClick={() => setShowAddLockerModal(true)}>Add Locker</button>
                <button className="el-icon-btn"><FilterLines /></button>
              </div>
            </div>
            <div className="el-grid">
              {gridLockers.map((item) => (
                <button key={item.id} className="el-tile" onClick={() => navigate(`/Locker/${encodeURIComponent(item.name)}`)}>
                  <Folder01 />
                  <div className="el-tile-texts">
                    <div className="el-tile-title">{item.name}</div>
                    <div className="el-tile-sub">In my locker</div>
                  </div>
                  <div className="el-dot"><DotsVertical /></div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <AddLockerModalWeb
        visible={showAddLockerModal}
        onClose={() => setShowAddLockerModal(false)}
        onCreateLocker={handleCreateLocker}
      />
    </div>
  );
}

export default EncryptedLocker;


