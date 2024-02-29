import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [authUsers, setAuthUsers] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    handleUsersData();
  }, []);
  const paragraphStyles = {
    color: "#888",
    fontSize: "16px",
    transition: "color 0.3s",
    ":hover": {
      backgroundColor: "blue",
      color: "white",
    },
  };
  const handleUsersData = async () => {
    try {
      const data1 = localStorage.getItem("attendence");
      const students = JSON.parse(data1);

      if (!students) {
        navigate("/login");
      }
      setAuthUsers(students);
      console.log(students);
      const { data } = await axios.get(
        "http://localhost:5000/student/all-users",
        {
          headers: {
            authorization: students.token,
          },
        }
      );
      setUsers(data.allUsers);
    } catch (error) {
      console.log(error);
    }
  };
  const handleLogOut = () => {
    localStorage.removeItem("attendence");
    navigate("/login");
  };
  return (
    <div className="fluid-container vh-100">
      <div className="fluid-container d-flex justify-content-between p-4 bg-primary shadow">
        <h1 className="fs-1 text-white">Admin Dashboard</h1>
        <div className="d-flex">
          <p className="fs-3 me-4 text-white">{authUsers.name}</p>
          <button
            className="btn btn-primary bg-secondary"
            onClick={handleLogOut}
          >
            LogOut
          </button>
        </div>
      </div>
      <div className="container d-flex vh-100 justify-content-center align-items-center">
        <div className="card w-100 h-100 mt-3">
          {users?.map((item) => (
            <Link
              className="card m-3 p-3 fs-5 cursor-pointer"
              key={item._id}
              style={paragraphStyles}
              to={`/report/${item._id}`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
