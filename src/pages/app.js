import React, { useEffect, useState } from "react";
import Login from "../components/Login";
import Checklists from "../components/Checklists";
import Items from "../components/Items";

const App = () => {
  const [currentView, setCurrentView] = useState("login");
  const [user, setUser] = useState(null);
  const [selectedChecklistId, setSelectedChecklistId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ token });
      setCurrentView("checklists");
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    setUser({ token });
    setCurrentView("checklists");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setCurrentView("login");
    setSelectedChecklistId(null);
  };

  const goToItems = (checklistId) => {
    setSelectedChecklistId(checklistId);
    setCurrentView("items");
  };

  const goToChecklists = () => {
    setSelectedChecklistId(null);
    setCurrentView("checklists");
  };

  if (currentView === "login") return <Login onLogin={login} />;
  if (currentView === "checklists")
    return (
      <Checklists user={user} onLogout={logout} onSelectChecklist={goToItems} />
    );
  if (currentView === "items")
    return (
      <Items
        user={user}
        checklistId={selectedChecklistId}
        onBack={goToChecklists}
      />
    );

  return null;
};

export default App;
