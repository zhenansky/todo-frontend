import React, { useEffect, useState } from "react";
import api from "../api";

const Items = ({ user, checklistId, onBack }) => {
  const [checklist, setChecklist] = useState({ name: "Checklist" });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItemName, setNewItemName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editItemName, setEditItemName] = useState("");

  useEffect(() => {
    fetchChecklistAndItems();
  }, [checklistId]);

  const fetchChecklistAndItems = async () => {
    try {
      const itemsRes = await api.getItems(user.token, checklistId);
      setItems(itemsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    try {
      const newItem = await api.createItem(
        user.token,
        checklistId,
        newItemName
      );
      setItems((prev) => [...prev, newItem.data]);
      setNewItemName("");
      setShowForm(false);
    } catch (error) {
      console.error("Error creating item:", error);
    }
  };

  const updateItemStatus = async (itemId, completed) => {
    if (!itemId) {
      console.error("Invalid itemId for updateItemStatus");
      return;
    }

    try {
      const res = await api.updateItemStatus(
        user.token,
        checklistId,
        itemId,
        completed
      );
      const updatedItem = res.data;
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === updatedItem.id ? updatedItem : item
        )
      );
    } catch (error) {
      console.error("Error updating item status:", error);
    }
  };

  const updateItemName = async (itemId, itemName) => {
    try {
      const res = await api.renameItem(
        user.token,
        checklistId,
        itemId,
        itemName
      );
      const updatedItem = res.data;
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === updatedItem.id ? updatedItem : item
        )
      );
      setEditingItem(null);
      setEditItemName("");
    } catch (error) {
      console.error("Error updating item name:", error);
    }
  };

  const deleteItem = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await api.deleteItem(user.token, checklistId, itemId);
      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const startEdit = (item) => {
    setEditingItem(item.id);
    setEditItemName(item.name);
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditItemName("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading items...</p>
        </div>
      </div>
    );
  }

  const completedItems = items.filter(
    (item) => item.itemCompletionStatus
  ).length;
  const totalItems = items.length;
  const progressPercentage =
    totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900 transition duration-200"
            >
              ← Back to Checklists
            </button>
          </div>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {checklist?.name}
              </h1>
              <p className="text-gray-600">
                {completedItems} of {totalItems} completed
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(progressPercentage)}%
              </div>
              <div className="w-24 bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </p>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center gap-2"
          >
            <span className="text-lg">+</span>
            Add Item
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Enter item name..."
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === "Enter" && createItem(e)}
              />
              <button
                onClick={createItem}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
              >
                Add
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

        {items.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">✅</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No items yet
            </h3>
            <p className="text-gray-600 mb-6">
              Add your first item to get started
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200"
            >
              Add Item
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-sm p-4 border hover:shadow-md transition duration-200"
              >
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={item.itemCompletionStatus}
                    onChange={(e) =>
                      updateItemStatus(item.id, e.target.checked)
                    }
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />

                  {editingItem === item.id ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={editItemName}
                        onChange={(e) => setEditItemName(e.target.value)}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          updateItemName(item.id, editItemName)
                        }
                      />
                      <button
                        onClick={() => updateItemName(item.id, editItemName)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition duration-200"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm transition duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <span
                        className={`flex-1 ${
                          item.itemCompletionStatus
                            ? "line-through text-gray-500"
                            : "text-gray-900"
                        }`}
                      >
                        {item.name}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(item)}
                          className="text-gray-400 hover:text-blue-500 transition duration-200"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition duration-200"
                        >
                          ✕
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Items;
