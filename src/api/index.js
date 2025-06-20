const API_BASE_URL = "http://94.74.86.174:8080/api";

const api = {
  // AUTH
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) throw new Error("Registration failed");
    return response.json();
  },

  login: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) throw new Error("Login failed");
    return response.json();
  },

  // CHECKLIST
  getChecklists: async (token) => {
    const response = await fetch(`${API_BASE_URL}/checklist`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error("Failed to fetch checklists");
    return await response.json(); // { data: [...] }
  },

  createChecklist: async (token, name) => {
    const response = await fetch(`${API_BASE_URL}/checklist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) throw new Error("Failed to create checklist");
    return await response.json(); // { data: {...} }
  },

  deleteChecklist: async (token, checklistId) => {
    const response = await fetch(`${API_BASE_URL}/checklist/${checklistId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to delete checklist");
    return response.json();
  },

  // ITEM
  getItems: async (token, checklistId) => {
    const response = await fetch(
      `${API_BASE_URL}/checklist/${checklistId}/item`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) throw new Error("Failed to fetch items");
    return await response.json(); // { data: [...] }
  },

  createItem: async (token, checklistId, itemName) => {
    const response = await fetch(
      `${API_BASE_URL}/checklist/${checklistId}/item`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ itemName }),
      }
    );
    if (!response.ok) throw new Error("Failed to create item");
    return await response.json(); // { data: {...} }
  },

  updateItemStatus: async (token, checklistId, itemId, status) => {
    const response = await fetch(
      `${API_BASE_URL}/checklist/${checklistId}/item/${itemId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ itemCompletionStatus: status }),
      }
    );
    if (!response.ok) throw new Error("Failed to update item status");
    return await response.json(); // { data: {...} }
  },

  renameItem: async (token, checklistId, itemId, itemName) => {
    const response = await fetch(
      `${API_BASE_URL}/checklist/${checklistId}/item/rename/${itemId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ itemName }),
      }
    );
    if (!response.ok) throw new Error("Failed to rename item");
    return await response.json(); // { data: {...} }
  },

  deleteItem: async (token, checklistId, itemId) => {
    const response = await fetch(
      `${API_BASE_URL}/checklist/${checklistId}/item/${itemId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) throw new Error("Failed to delete item");
    return response.json();
  },
};

export default api;
