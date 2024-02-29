import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
function Dashboard() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("attendence");
    navigate("/login");
  };
  const handleDashboard = () => {
    const data = JSON.parse(localStorage.getItem("attendence"));
    if (!data) {
      navigate("/login");
    } else if (data.admin == "0") {
      navigate("/student");
    } else {
      navigate("/admin");
    }
  };
  useEffect(() => {
    handleDashboard();
  }, []);
  return (
    <div className="vh-100 fluid-container">
      <div className="d-flex w-100 bg-primary text-white p-4 justify-content-between">
        <div>Dashboard</div>
        <button className="btn btn-secondary" onClick={handleLogout}>
          logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
