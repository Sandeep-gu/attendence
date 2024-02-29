import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
function Register() {
  const [userDetail, setUserDetail] = useState({});
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
        "http://localhost:5000/user/register",
        userDetail
      );
      console.log(data.status);
      toast.success("successfully registered");
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };
  return (
    <div>
      <div className="fluid-container p-4 bg-primary text-white fs-3">
        Register
      </div>
      <div className="fluid-container d-flex justify-content-center align-items-center vh-100 p-4">
        <form
          className="container w-md-50 mt-4 p-4 rounded-md shadow"
          onSubmit={handleOnSubmit}
        >
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Name"
              name="name" // Add name attribute
              onChange={onChange}
            />

            <div id="emailHelp" className="form-text"></div>
          </div>
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
              name="username" // Add name attribute
              onChange={onChange}
            />

            <div id="emailHelp" className="form-text"></div>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Email
            </label>
            <input
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="email"
              name="email" // Add name attribute
              onChange={onChange}
            />

            <div id="emailHelp" className="form-text"></div>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Password
            </label>
            <input
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="password"
              name="password" // Add name attribute
              onChange={onChange}
            />

            <div id="emailHelp" className="form-text"></div>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Phone
            </label>
            <input
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="phone"
              name="phone" // Add name attribute
              onChange={onChange}
            />

            <div id="emailHelp" className="form-text"></div>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Admin
            </label>
            <input
              type="text"
              className="form-control"
              id="exampleInputPassword1"
              placeholder="admin"
              name="admin" // Add name attribute
              onChange={onChange}
            />
          </div>

          <button type="submit" className="btn btn-primary bg-primary">
            Register
          </button>
          <Link to="/login" className="btn btn-primary bg-primary ms-3">
            Login
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Register;
