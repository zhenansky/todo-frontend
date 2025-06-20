import React, { useEffect, useState } from "react";
import api from "../api";

const Checklists = ({ user, onLogout, onSelectChecklist }) => {
  const [checklists, setChecklists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newChecklistName, setNewChecklistName] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchChecklists();
  }, []);

  const fetchChecklists = async () => {
    try {
      const response = await api.getChecklists(user.token);
      setChecklists(response.data); // ✅ sesuai struktur API { data: [...] }
    } catch (error) {
      console.error("Error fetching checklists:", error);
    } finally {
      setLoading(false);
    }
  };

  const createChecklist = async (e) => {
    e.preventDefault();
    if (!newChecklistName.trim()) return;

    try {
      const newChecklist = await api.createChecklist(
        user.token,
        newChecklistName
      );
      setChecklists((prev) => [...prev, newChecklist.data]);
      setNewChecklistName("");
      setShowForm(false);
    } catch (error) {
      console.error("Error creating checklist:", error);
    }
  };

  const deleteChecklist = async (id) => {
    if (!window.confirm("Are you sure you want to delete this checklist?"))
      return;

    try {
      await api.deleteChecklist(user.token, id);
      setChecklists((prev) => prev.filter((checklist) => checklist.id !== id));
    } catch (error) {
      console.error("Error deleting checklist:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading checklists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">My Checklists</h1>
          <button
            onClick={onLogout}
            className="text-gray-600 hover:text-gray-900 font-medium transition duration-200"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <p className="text-gray-600">
            {checklists.length}{" "}
            {checklists.length === 1 ? "checklist" : "checklists"}
          </p>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center gap-2"
          >
            <span className="text-lg">+</span>
            New Checklist
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Enter checklist name..."
                value={newChecklistName}
                onChange={(e) => setNewChecklistName(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === "Enter" && createChecklist(e)}
              />
              <button
                onClick={createChecklist}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
              >
                Create
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {checklists.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No checklists yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first checklist to get started
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200"
            >
              Create Checklist
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {checklists.map((checklist) => (
              <div
                key={checklist.id}
                className="bg-white rounded-lg shadow-sm p-6 border hover:shadow-md transition duration-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex-1">
                    {checklist.name}
                  </h3>
                  <button
                    onClick={() => deleteChecklist(checklist.id)}
                    className="text-gray-400 hover:text-red-500 transition duration-200"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Created {new Date(checklist.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => onSelectChecklist(checklist.id)}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-2 px-4 rounded-lg transition duration-200"
                  >
                    Open
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Checklists;
