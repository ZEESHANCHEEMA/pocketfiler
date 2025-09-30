import { createAsyncThunk } from "@reduxjs/toolkit";
// Note: reducer actions are used by views; thunks return normalized data
import api from "../../apiInterceptor";
import { API_URL } from "../../client";

// GET /locker — list lockers for current user
export const getLockers = createAsyncThunk("locker/list", async () => {
  try {
    const res = await api.get(`${API_URL}/locker`);
    // eslint-disable-next-line no-console
    console.log("[locker] getLockers:SUCCESS", {
      status: res?.status,
      data: res?.data,
    });
    const list = res?.data?.lockers || res?.data?.data || res?.data || [];
    // Map to normalized shape
    const normalized = Array.isArray(list)
      ? list.map((l) => ({
          id: l.id || l._id,
          name: l.name,
          associates: l.associates,
          createdAt: l.createdAt,
        }))
      : [];
    return { status: res?.status, data: { lockers: normalized } };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log("[locker] getLockers:ERROR", {
      status: error?.response?.status || 500,
      data: error?.response?.data,
    });
    return {
      status: error?.response?.status || 500,
      data: error?.response?.data,
    };
  }
});

// POST /locker — create a new locker
export const createLocker = createAsyncThunk(
  "locker/create",
  async ({ name, associates = [] }) => {
    try {
      const res = await api.post(`${API_URL}/locker`, {
        name,
        associates,
      });
      // eslint-disable-next-line no-console
      console.log("[locker] createLocker:SUCCESS", {
        status: res?.status,
        data: res?.data,
      });
      const l = res?.data?.locker || res?.data;
      const created = {
        id: l.id || l._id,
        name: l.name,
        associates: l.associates,
        createdAt: l.createdAt,
      };
      return { status: res?.status, data: { locker: created } };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("[locker] createLocker:ERROR", {
        status: error?.response?.status || 500,
        data: error?.response?.data,
      });
      return {
        status: error?.response?.status || 500,
        data: error?.response?.data,
      };
    }
  }
);

// PUT /locker/item/{itemId}/share — Share or unshare a folder or file with users
export const updateLockerItemShare = createAsyncThunk(
  "locker/updateItemShare",
  async ({ itemId, add = [], remove = [] }) => {
    try {
      const res = await api.put(`${API_URL}/locker/item/${itemId}/share`, {
        add,
        remove,
      });
      // eslint-disable-next-line no-console
      console.log("[locker] updateLockerItemShare:SUCCESS", {
        status: res?.status,
        data: res?.data,
        itemId,
      });
      return { status: res?.status, data: res?.data, itemId };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("[locker] updateLockerItemShare:ERROR", {
        status: error?.response?.status || 500,
        data: error?.response?.data,
        itemId,
      });
      return {
        status: error?.response?.status || 500,
        data: error?.response?.data,
        itemId,
      };
    }
  }
);

// PUT /locker/{lockerId} — rename locker
export const renameLocker = createAsyncThunk(
  "locker/rename",
  async ({ lockerId, name }) => {
    try {
      const res = await api.put(`${API_URL}/locker/${lockerId}`, { name });
      // eslint-disable-next-line no-console
      console.log("[locker] renameLocker:SUCCESS", {
        status: res?.status,
        data: res?.data,
      });
      const l = res?.data || {};
      const updated = { id: lockerId, name: l.name || name };
      return { status: res?.status, data: updated, lockerId };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("[locker] renameLocker:ERROR", {
        status: error?.response?.status || 500,
        data: error?.response?.data,
        lockerId,
      });
      return {
        status: error?.response?.status || 500,
        data: error?.response?.data,
        lockerId,
      };
    }
  }
);

// DELETE /locker/{lockerId} — delete locker
export const deleteLocker = createAsyncThunk("locker/delete", async (arg) => {
  const lockerId =
    typeof arg === "string" || typeof arg === "number" ? arg : arg?.lockerId;
  const skipAuthRedirect = typeof arg === "object" && arg?.skipAuthRedirect;
  try {
    const res = await api.delete(`${API_URL}/locker/${lockerId}`, {
      headers: skipAuthRedirect ? { "x-skip-auth-redirect": "1" } : undefined,
      skipAuthRedirect,
    });
    // eslint-disable-next-line no-console
    console.log("[locker] deleteLocker:SUCCESS", {
      status: res?.status,
      data: res?.data,
      lockerId,
    });
    return { status: res?.status, lockerId };
  } catch (error) {
    const status = error?.response?.status || 500;
    const message = error?.response?.data?.error || error?.message;
    // eslint-disable-next-line no-console
    console.log("[locker] deleteLocker:ERROR", { status, message, lockerId });
    return { status, message, lockerId };
  }
});

// GET /locker/{lockerId}/items — list items (folders/files)
// NEW: GET /locker/{lockerId}/items
export const getLockerItems = createAsyncThunk(
  "locker/getItems",
  async ({ lockerId, parentId }) => {
    try {
      const params = parentId ? { params: { parentId } } : {};
      const res = await api.get(`${API_URL}/locker/${lockerId}/items`, params);
      // eslint-disable-next-line no-console
      console.log("[locker] listLockerItems:SUCCESS", {
        status: res?.status,
        data: res?.data,
      });
      const raw = res?.data?.items || res?.data?.data || res?.data || {};
      const folders =
        (raw.folders || raw?.folders || raw?.data || raw || []).filter?.(
          (i) => i?.type === "folder"
        ) ||
        raw.folders ||
        [];
      const files =
        (raw.files || raw?.files || raw?.data || raw || []).filter?.(
          (i) => i?.type === "file"
        ) ||
        raw.files ||
        [];
      return { status: res?.status, data: { folders, files }, lockerId };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("[locker] listLockerItems:ERROR", {
        status: error?.response?.status || 500,
        data: error?.response?.data,
        lockerId,
      });
      return {
        status: error?.response?.status || 500,
        data: error?.response?.data,
        lockerId,
      };
    }
  }
);

// POST /locker/{lockerId}/folder — create folder (optional parentId)
// NEW: POST /locker/{lockerId}/folders
export const createFolder = createAsyncThunk(
  "locker/createFolder",
  async ({ lockerId, name, parentId }) => {
    try {
      // NOTE: backend expects singular 'folder'
      const res = await api.post(`${API_URL}/locker/${lockerId}/folder`, {
        name,
        parentId,
      });
      // eslint-disable-next-line no-console
      console.log("[locker] createLockerFolder:SUCCESS", {
        status: res?.status,
        data: res?.data,
      });
      const f = res?.data?.folder || res?.data;
      const folder = {
        id: f?.id || f?._id,
        name: f?.name,
        parentId: f?.parentId,
        createdAt: f?.createdAt,
      };
      return { status: res?.status, data: { folder }, lockerId };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("[locker] createLockerFolder:ERROR", {
        status: error?.response?.status || 500,
        data: error?.response?.data,
        lockerId,
      });
      return {
        status: error?.response?.status || 500,
        data: error?.response?.data,
        lockerId,
      };
    }
  }
);

// POST /locker/{lockerId}/upload — upload file (optionally into folder parentId)
export const uploadLockerFiles = createAsyncThunk(
  "locker/uploadFiles",
  async ({ lockerId, files, parentId }) => {
    try {
      const formData = new FormData();
      const list = Array.isArray(files) ? files : [files];
      // Backend expects repeated field name 'file' for each upload
      list.forEach((f) => formData.append("file", f, f?.name || "upload.bin"));
      if (parentId) formData.append("parentId", parentId);
      // eslint-disable-next-line no-console
      console.log("[locker] upload payload", {
        lockerId,
        parentId,
        count: list.length,
      });
      const res = await api.post(
        `${API_URL}/locker/${lockerId}/upload`,
        formData,
        {
          // Let axios set the proper multipart boundary header automatically
          timeout: 60000, // uploads can take longer than default 10s
        }
      );
      // eslint-disable-next-line no-console
      console.log("[locker] uploadLockerFiles:SUCCESS", {
        status: res?.status,
        data: res?.data,
      });
      // Normalize various backend shapes
      const raw =
        res?.data?.files || res?.data?.data || res?.data?.file || res?.data;
      const uploaded = Array.isArray(raw) ? raw : raw ? [raw] : [];
      return { status: res?.status, data: { files: uploaded }, lockerId };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("[locker] uploadLockerFiles:ERROR", {
        status: error?.response?.status || 500,
        data: error?.response?.data,
        lockerId,
      });
      return {
        status: error?.response?.status || 500,
        data: error?.response?.data,
        lockerId,
      };
    }
  }
);

// PUT /locker/{lockerId}/associates
export const upsertLockerAssociates = createAsyncThunk(
  "locker/upsertAssociates",
  async ({ lockerId, associates, add, remove }) => {
    try {
      // Backward compatible payload: either {associates:[...]} or {add:[], remove:[]}
      const payload = {};
      if (Array.isArray(associates)) payload.associates = associates;
      if (Array.isArray(add)) payload.add = add;
      if (Array.isArray(remove)) payload.remove = remove;
      const res = await api.put(
        `${API_URL}/locker/${lockerId}/associates`,
        payload
      );
      // Debug log: successful response
      // eslint-disable-next-line no-console
      console.log("[locker] upsertLockerAssociates:SUCCESS", {
        status: res?.status,
        data: res?.data,
        lockerId,
      });
      return {
        status: res?.status,
        data: res?.data,
        lockerId,
      };
    } catch (error) {
      // Debug log: error response
      // eslint-disable-next-line no-console
      console.log("[locker] upsertLockerAssociates:ERROR", {
        status: error?.response?.status || 500,
        data: error?.response?.data,
        lockerId,
      });
      return {
        status: error?.response?.status || 500,
        data: error?.response?.data,
        lockerId,
      };
    }
  }
);

// DELETE /locker/item/{itemId} — delete a folder or file by item id
export const deleteLockerItem = createAsyncThunk(
  "locker/deleteItem",
  async ({ itemId, type, lockerId }) => {
    try {
      // Try primary endpoint
      let res;
      try {
        res = await api.delete(`${API_URL}/locker/item/${itemId}`);
      } catch (e) {
        const notFound = e?.response?.status === 404;
        if (notFound) {
          // Try type-specific or plural fallback endpoints
          const candidates = [];
          if (lockerId)
            candidates.push(`${API_URL}/locker/${lockerId}/item/${itemId}`);
          if (type === "file")
            candidates.push(`${API_URL}/locker/file/${itemId}`);
          if (type === "folder")
            candidates.push(`${API_URL}/locker/folder/${itemId}`);
          // Query-string variants some backends use
          if (type === "file")
            candidates.push(`${API_URL}/locker/item/${itemId}?type=file`);
          if (type === "folder")
            candidates.push(`${API_URL}/locker/item/${itemId}?type=folder`);
          if (lockerId)
            candidates.push(`${API_URL}/locker/${lockerId}/items/${itemId}`);
          candidates.push(`${API_URL}/locker/items/${itemId}`);
          // Iterate until one succeeds
          for (let i = 0; i < candidates.length; i += 1) {
            try {
              // eslint-disable-next-line no-await-in-loop
              const url = candidates[i];
              // eslint-disable-next-line no-console
              console.log("[locker] deleteLockerItem:RETRY", { url });
              res = await api.delete(url);
              break;
            } catch (err) {
              // Continue trying next candidate on 404
              if (err?.response?.status !== 404) throw err;
            }
          }
          if (!res) throw e; // rethrow original if none succeeded
        } else {
          throw e;
        }
      }
      // eslint-disable-next-line no-console
      console.log("[locker] deleteLockerItem:SUCCESS", {
        status: res?.status,
        data: res?.data,
        itemId,
      });
      return { status: res?.status, itemId };
    } catch (error) {
      const status = error?.response?.status || 500;
      const message = error?.response?.data?.error || error?.message;
      // eslint-disable-next-line no-console
      console.log("[locker] deleteLockerItem:ERROR", {
        status,
        message,
        itemId,
      });
      return { status, message, itemId };
    }
  }
);

// GET /locker/item/{itemId}/download — get a file (or folder archive) download URL
export const getLockerItemDownloadUrl = createAsyncThunk(
  "locker/downloadItem",
  async ({ itemId }) => {
    try {
      const res = await api.get(`${API_URL}/locker/item/${itemId}/download`, {
        headers: { "x-skip-auth-redirect": "1" },
        skipAuthRedirect: true,
      });
      // eslint-disable-next-line no-console
      console.log("[locker] getLockerItemDownloadUrl:SUCCESS", {
        status: res?.status,
        data: res?.data,
        itemId,
      });
      const url =
        res?.data?.url ||
        res?.data?.downloadUrl ||
        res?.data?.data?.url ||
        res?.data?.data?.downloadUrl ||
        (typeof res?.data === "string" ? res?.data : undefined);
      return { status: res?.status, url, itemId };
    } catch (error) {
      const status = error?.response?.status || 500;
      const message = error?.response?.data?.error || error?.message;
      // eslint-disable-next-line no-console
      console.log("[locker] getLockerItemDownloadUrl:ERROR", {
        status,
        message,
        itemId,
      });
      return { status, message, itemId };
    }
  }
);

// GET /locker/{lockerId}/download — list all files in locker with URLs
export const getLockerDownload = createAsyncThunk(
  "locker/downloadLocker",
  async ({ lockerId }) => {
    try {
      const res = await api.get(`${API_URL}/locker/${lockerId}/download`, {
        headers: { "x-skip-auth-redirect": "1" },
        skipAuthRedirect: true,
      });
      // eslint-disable-next-line no-console
      console.log("[locker] getLockerDownload:SUCCESS", {
        status: res?.status,
        data: res?.data,
        lockerId,
      });
      const urls =
        res?.data?.urls ||
        res?.data?.files ||
        res?.data?.data?.urls ||
        res?.data?.data?.files ||
        [];
      return { status: res?.status, urls, lockerId };
    } catch (error) {
      const status = error?.response?.status || 500;
      const message = error?.response?.data?.error || error?.message;
      // eslint-disable-next-line no-console
      console.log("[locker] getLockerDownload:ERROR", {
        status,
        message,
        lockerId,
      });
      return { status, message, lockerId };
    }
  }
);

// GET /locker/{lockerId}/history — locker activity timeline (owner only)
export const getLockerHistory = createAsyncThunk(
  "locker/getHistory",
  async ({ lockerId }) => {
    try {
      const res = await api.get(`${API_URL}/locker/${lockerId}/history`, {
        headers: { "x-skip-auth-redirect": "1" },
        skipAuthRedirect: true,
      });
      // eslint-disable-next-line no-console
      console.log("[locker] getLockerHistory:SUCCESS", {
        status: res?.status,
        data: res?.data,
        lockerId,
      });
      const items = res?.data?.history || res?.data?.data || res?.data || [];
      return { status: res?.status, items, lockerId };
    } catch (error) {
      const status = error?.response?.status || 500;
      const message = error?.response?.data?.error || error?.message;
      // eslint-disable-next-line no-console
      console.log("[locker] getLockerHistory:ERROR", {
        status,
        message,
        lockerId,
      });
      return { status, message, lockerId };
    }
  }
);

// GET /locker/{lockerId}/people — list owner and associates
export const getLockerPeople = createAsyncThunk(
  "locker/getPeople",
  async ({ lockerId }) => {
    try {
      const res = await api.get(`${API_URL}/locker/${lockerId}/people`);
      // eslint-disable-next-line no-console
      console.log("[locker] getLockerPeople:SUCCESS", {
        status: res?.status,
        data: res?.data,
        lockerId,
      });
      return { status: res?.status, data: res?.data, lockerId };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("[locker] getLockerPeople:ERROR", {
        status: error?.response?.status || 500,
        data: error?.response?.data,
        lockerId,
      });
      return {
        status: error?.response?.status || 500,
        data: error?.response?.data,
        lockerId,
      };
    }
  }
);

// POST /locker/{lockerId}/transfer-ownership — transfer owner role
export const transferLockerOwnership = createAsyncThunk(
  "locker/transferOwnership",
  async ({ lockerId, payload }) => {
    try {
      const res = await api.post(
        `${API_URL}/locker/${lockerId}/transfer-ownership`,
        payload || {}
      );
      // eslint-disable-next-line no-console
      console.log("[locker] transferOwnership:SUCCESS", {
        status: res?.status,
        data: res?.data,
        lockerId,
      });
      return { status: res?.status, data: res?.data, lockerId };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("[locker] transferOwnership:ERROR", {
        status: error?.response?.status || 500,
        data: error?.response?.data,
        lockerId,
      });
      return {
        status: error?.response?.status || 500,
        data: error?.response?.data,
        lockerId,
      };
    }
  }
);

// PUT /locker/{lockerId}/access — update locker access (restricted or public)
export const updateLockerAccess = createAsyncThunk(
  "locker/updateAccess",
  async ({ lockerId, accessType }) => {
    try {
      const res = await api.put(`${API_URL}/locker/${lockerId}/access`, {
        access: accessType,
      });
      // eslint-disable-next-line no-console
      console.log("[locker] updateLockerAccess:SUCCESS", {
        status: res?.status,
        data: res?.data,
        lockerId,
        accessType,
      });
      return { status: res?.status, data: res?.data, lockerId, accessType };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("[locker] updateLockerAccess:ERROR", {
        status: error?.response?.status || 500,
        data: error?.response?.data,
        lockerId,
        accessType,
      });
      return {
        status: error?.response?.status || 500,
        data: error?.response?.data,
        lockerId,
        accessType,
      };
    }
  }
);
