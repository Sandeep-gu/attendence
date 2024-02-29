import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
function Report() {
  const [user, setUser] = useState([]);
  const [authUsers, setAuthUsers] = useState([]);
  const params = useParams();

  useEffect(() => {
    handleUsersData();
  }, []);

  function convertSecondsToTime(durationInSeconds) {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = durationInSeconds % 60;
    const total = `${hours ? hours + "h" : "00h"}:${
      minutes ? minutes + "m" : "00m"
    }:${seconds ? seconds.toFixed(0) + "s" : "00s"}`;
    return total;
  }

  const handleUsersData = async () => {
    try {
      const data1 = localStorage.getItem("attendence");
      const students = JSON.parse(data1);
      const { data } = await axios.get(
        `http://localhost:5000/student/admin-view-report/${params.id}`,
        {
          headers: {
            authorization: students.token,
          },
        }
      );
      console.log("users", data.report);
      if (data.report.length > 0) {
        setUser(data.report);
        setAuthUsers(data.user);
      } else {
        setUser();
      }
    } catch (error) {
      console.log(error);
      setUser();
    }
  };

  return (
    <div className="fluid-container vh-100">
      <div className="fluid-container d-flex justify-content-between p-4 bg-primary shadow">
        <h1 className="fs-1 text-white">User Reports</h1>
        <p className="fs-3 me-4 text-white">{authUsers.name}</p>
      </div>
      <div className="container">
        <div className="container card w-75 mt-3 p-3">
          {user ? (
            user.map((item, index) => (
              <div
                className="card d-flex flex-column justify-content-center align-items-center m-3 p-3 cursor-pointer"
                key={index}
              >
                <div className="bg-secondary rounded text-white mb-3 px-5 py-2">
                  <div className="">
                    Date : {new Date(item.date).toLocaleDateString()}
                  </div>
                  <div>
                    Time Duration : {convertSecondsToTime(item.totalDuration)}
                  </div>
                </div>
                <div
                  className="overflow-auto w-100 d-flex justify-content-center flex-column align-items-center"
                  style={{ height: "300px" }}
                >
                  {item.signInSignOutArray.map((data, index) => (
                    <>
                      <div
                        key={index}
                        className="border border-primary mb-3 p-2 mt-5 rounded w-md-50 w-100"
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
            ))
          ) : (
            <div className="d-flex justify-content-center align-items-center">
              <p>No Data Found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Report;
