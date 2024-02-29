import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function StudentDashboard() {
  const [check, setCheck] = useState(false);
  const [userData, setUserData] = useState({});
  const [isReport, setIsReport] = useState(false);
  const [report, setReport] = useState([]);
  const navigate = useNavigate();

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);
  const formattedTime = currentTime.toLocaleTimeString();

  function preback() {
    window.history.forward();
  }
  setTimeout(preback(), 0);
  window.onunload = function () {
    null;
  };
  useEffect(() => {
    checkSign();
  }, []);

  const checkSign = async () => {
    try {
      const data1 = localStorage.getItem("attendence");
      const students = JSON.parse(data1);
      if (!students) {
        navigate("/login");
      }
      setUserData(students);

      const { data } = await axios.get(
        "http://localhost:5000/student/checkout",
        {
          headers: {
            authorization: students.token,
          },
        }
      );
      console.log(data.success);
      setCheck(data.success);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignin = async () => {
    try {
      console.log(userData.token);
      const { data } = await axios.put(
        "http://localhost:5000/student/signin",
        {},
        {
          headers: {
            authorization: userData.token,
          },
        }
      );
      console.log(data);
      setCheck(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignout = async () => {
    try {
      console.log(userData.token);
      const { data } = await axios.put(
        "http://localhost:5000/student/signout",
        {},
        {
          headers: {
            authorization: userData.token,
          },
        }
      );
      console.log(data);
      setCheck(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("attendence");
    navigate("/login");
  };
  const handleReport = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/student/view-report",

        {
          headers: {
            authorization: userData.token,
          },
        }
      );
      console.log(data);
      console.log(data.report);
      setReport(data.report);
      setIsReport(!isReport);
      setCheck(true);
    } catch (error) {
      toast.error("No Data Found");
    }
  };

  function convertSecondsToTime(durationInSeconds) {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = durationInSeconds % 60;
    const total = `${hours ? hours + "h" : "00h"}:${
      minutes ? minutes + "m" : "00m"
    }:${seconds ? seconds.toFixed(0) + "s" : "00s"}`;
    return total;
  }
  return (
    <>
      <div>
        <div className="fluid-container d-flex justify-content-between h-30 w-100 bg-primary p-4 text-white fs-3">
          <p>Student Dashboard</p>
          <div className="d-flex">
            <p className="fs-3 me-4 text-white">{userData.name}</p>
            <button className="btn btn-secondary" onClick={handleLogout}>
              {" "}
              LogOut
            </button>
          </div>
        </div>
        <div className="container d-flex justify-content-center align-items-center vh-70 mt-3">
          {isReport ? (
            <div className="container card p-4 text-center">
              <h3 className="fw-semibold fs-1">Report</h3>
              {/* {report?.map((item) => (
                <div className="card p-4 text-center m-4" key={item._id}>
                  <div>Date: {new Date(item.date).toLocaleDateString()}</div>
                  <div>
                    SignIn: {new Date(item.signIn).toLocaleTimeString()}
                  </div>
                  <div>
                    SignOut : {new Date(item.signOut).toLocaleTimeString()}
                  </div>
                  <p>
                    Live Time:{" "}
                    <span className="text-success">
                      {formatTimeDifference(
                        new Date(item.signOut).getTime() -
                          new Date(item.signIn).getTime()
                      )}
                    </span>
                  </p>
                </div>
              ))} */}
              {report.map((item) => (
                <div
                  className="card d-flex flex-column justify-content-center align-items-center m-3 p-3 cursor-pointer"
                  key={item.date}
                >
                  <div className="bg-secondary rounded text-white px-5 py-2">
                    <div className="">
                      Date : {new Date(item.date).toLocaleDateString()}
                    </div>
                    <div>
                      Time Duration : {convertSecondsToTime(item.totalDuration)}
                    </div>
                  </div>
                  <div
                    className="overflow-auto w-100  d-flex justify-content-center flex-column align-items-center"
                    style={{ height: "300px" }}
                  >
                    {item.signInSignOutArray.map((data) => (
                      <>
                        <div
                          key={data.signIn}
                          className="border border-primary mt-5 p-2 rounded w-md-50 w-100"
                        >
                          <div className="d-flex justify-content-between">
                            <span className="fw-semibold">SignIn : </span>
                            <span className="align-self-end">
                              {new Date(data.signIn).toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span className="fw-semibold">SignOut : </span>
                            <span className="align-self-end">
                              {new Date(data.signOut).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </>
                    ))}
                  </div>
                </div>
              ))}
              <button
                className="btn btn-primary mt-3"
                onClick={() => setIsReport(!isReport)}
              >
                Previous Page
              </button>
            </div>
          ) : (
            <div className="container vh-50 card p-4 mt-5 text-center">
              <h3 className="mb-4 fs-2">Attendance Tracking</h3>
              <div>
                <span className="fw-semibold">Current Date : </span>
                {new Date().toLocaleDateString()}
              </div>
              <div>
                <span className="fw-semibold">Current Time : </span>{" "}
                {formattedTime}
              </div>
              <button
                className="btn btn-primary mt-3"
                onClick={check ? handleSignin : handleSignout}
              >
                {check ? "Sign In" : "Sign Out"}
              </button>
              <button className="btn btn-primary mt-3" onClick={handleReport}>
                View Report
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default StudentDashboard;
