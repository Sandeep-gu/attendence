import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
function Login() {
  const [userDetail, setUserDetail] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("attendence"));
    if (data) {
      console.log(data);
      navigate(`/${data.admin === "0" ? "student" : "admin"}`);
    }
  }, []);
  const onChange = (e) => {
    e.preventDefault();
    setUserDetail((prevUserDetail) => ({
      ...prevUserDetail,
      [e.target.name]: e.target.value,
    }));
    console.log(userDetail);
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:5000/user/login",
        userDetail
      );
      if (data) {
        console.log(data);

        toast.success("Successfully logged in");
        localStorage.setItem("attendence", JSON.stringify(data.data));
        if (data.data.admin === "1") {
          navigate("/admin");
        } else {
          navigate("/student");
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  return (
    <div>
      <div className="fluid-container p-4 bg-primary text-white fs-3">
        Login
      </div>
      <div className="fluid-container d-flex justify-content-center align-items-center vh-100">
        <form
          className="container w-50 p-4 rounded-md shadow"
          onSubmit={handleOnSubmit}
        >
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="username"
              name="username"
              onChange={onChange}
            />
            <div id="emailHelp" className="form-text"></div>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Password
            </label>
            <input
              type="text"
              className="form-control"
              id="exampleInputPassword1"
              placeholder="password"
              name="password"
              onChange={onChange}
            />
          </div>

          <button type="submit" className="btn btn-primary bg-primary">
            Login
          </button>
          <Link to="/register" className="btn btn-primary bg-primary ms-md-3">
            Register
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
