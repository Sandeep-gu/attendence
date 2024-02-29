const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoute = require("./router/user.js");
const studentRoute = require("./router/student.js");
const Student = require("./models/student.js");
const User = require("./models/user.js");
const cron = require("node-cron");

/* CONFIGURATION */

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

/*ROUTES */

app.use("/user", userRoute);
app.use("/student", studentRoute);
/* MONGOOSE SETUP */

const PORT = process.env.PORT || 8080;

//used cron for automatically update data at 7pm
cron.schedule("0 19 * * *", async () => {
  try {
    const currentDayOfWeek = new Date().getDay();

    if (currentDayOfWeek === 0 || currentDayOfWeek === 6) {
      console.log(
        "Cron Job: It's a weekend (Saturday or Sunday). No automatic sign-in or sign-out."
      );
      return;
    }
    const users = await User.find({});
    await Promise.all(
      users.map(async (user) => {
        const student = await Student.findOne({
          userId: user._id,
          "attendence.date": new Date().setHours(0, 0, 0, 0),
        });

        if (student) {
          const latestAttendance =
            student.attendence[student.attendence.length - 1];

          if (latestAttendance.signIn && !latestAttendance.signOut) {
            latestAttendance.signOut = new Date();
            await student.save();
            console.log(
              `Cron Job: User ${user.username} signed out automatically.`
            );
          }
        } else {
          const newStudent = new Student({
            userId: user._id,
            attendence: [{ date: new Date(), signIn: null, signOut: null }],
          });
          await newStudent.save();
          console.log(
            `Cron Job: User ${user.username} marked absent automatically.`
          );
        }
      })
    );

    console.log("Cron Job: Attendance updated automatically.");
  } catch (error) {
    console.error("Cron Job Error:", error.message);
  }
});

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`${error} did not connect`);
  });
