const Student = require("../models/student");
const User = require("../models/user");
// const signInController = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     if (!userId) {
//       return res.status(400).json({ message: "Missing required parameters." });
//     }
//     let student = await Student.findOne({ userId });

//     if (!student) {
//       student = await Student.create({ userId, attendence: [] });
//     }
//     const today = new Date().setHours(0, 0, 0, 0);
//     const existingSignIn = student.attendence.find(
//       (Student) => new Date(Student.date).setHours(0, 0, 0, 0) === today
//     );
//     console.log(existingSignIn);
//     if (existingSignIn) {
//       return res.status(400).json({
//         message: "Student has already signed in for the current day.",
//       });
//     }

//     student.attendence.push({
//       date: new Date(),
//       signIn: new Date().getHours(),
//       signOut: null,
//     });
//     await student.save();
//     res.status(200).json({ message: "Student signed in successfully." });
//   } catch (error) {
//     res.status(500).send({ message: error.message });
//   }
// };
// const signInController = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     if (!userId) {
//       return res.status(400).json({ message: "Missing required parameters." });
//     }

//     let student = await Student.findOne({ userId });

//     if (!student) {
//       student = await Student.create({ userId, attendence: [] });
//     }

//     const today = new Date().setHours(0, 0, 0, 0);
//     const existingSignIn = student.attendence.find(
//       (attendance) => new Date(attendance.date).setHours(0, 0, 0, 0) === today
//     );

//     if (!existingSignIn) {
//       student.attendence.push({
//         date: new Date(),
//         signIn: new Date(),
//         signOut: null,
//       });
//       await student.save();
//       res.status(200).json({ message: "Student signed in successfully." });
//     } else if (existingSignIn && existingSignIn.signOut !== null) {
//       student.attendence.push({
//         date: new Date(),
//         signIn: new Date(),
//         signOut: null,
//       });
//       await student.save();
//       res.status(200).json({ message: "Student signed in successfully." });
//     } else {
//       return res.status(400).json({
//         message: "Student has already signed in for the current day.",
//       });
//     }
//   } catch (error) {
//     res.status(500).send({ message: error.message });
//   }
// };

// const signOutController = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const exist = await Student.findOne({ userId });

//     if (!exist) {
//       return res.status(404).send({ message: "Please signIn before signOut" });
//     }

//     const today = new Date();
//     const attendanceToday = exist.attendence.find(
//       (attendance) =>
//         new Date(attendance.date).setHours(0, 0, 0, 0) ===
//         today.setHours(0, 0, 0, 0)
//     );

//     if (attendanceToday && attendanceToday.signIn !== null) {
//       attendanceToday.signOut = today;
//       await exist.save(); // Save the changes to the database
//       return res.status(200).send({ message: "Successfully signed out" });
//     } else {
//       return res.status(404).send({ message: "Please signIn before Logout" });
//     }
//   } catch (error) {
//     res.status(500).send({ message: error.message });
//   }
// };

// signInController
const signInController = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ message: "Missing required parameters." });
    }

    let student = await Student.findOne({ userId });

    if (!student) {
      student = await Student.create({ userId, attendence: [] });
    }
    const today = new Date().setHours(0, 0, 0, 0);
    const currentHour = new Date().getHours();

    // Check if it's before 6 AM or after 6 PM
    if (currentHour < 6 || currentHour >= 19) {
      return res.status(400).json({
        message: "Sign-in is only allowed between 6 AM and 6 PM.",
      });
    }

    // Check if any previous sign-ins are not signed out
    const hasUnfinishedSignIn = student.attendence.some(
      (attendance) =>
        new Date(attendance.date).setHours(0, 0, 0, 0) === today &&
        attendance.signIn &&
        !attendance.signOut
    );

    if (!hasUnfinishedSignIn) {
      student.attendence.push({
        date: new Date(),
        signIn: new Date(),
        signOut: null,
      });
      await student.save();
      res.status(200).json({ message: "Student signed in successfully." });
    } else {
      return res.status(400).json({
        message:
          "Please sign out from the previous session before signing in again.",
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const signOutController = async (req, res) => {
  try {
    const userId = req.user.id;
    const exist = await Student.findOne({ userId });

    if (!exist) {
      return res.status(404).send({ message: "Please signIn before signOut" });
    }

    const today = new Date().setHours(0, 0, 0, 0);
    const lastSignIn = exist.attendence.slice(-1)[0];

    if (
      lastSignIn &&
      !lastSignIn.signOut &&
      new Date(lastSignIn.date).setHours(0, 0, 0, 0) === today
    ) {
      // If there is a last sign-in entry without a sign-out entry for today, sign out
      lastSignIn.signOut = new Date();
      await exist.save();
      return res.status(200).send({ message: "Successfully signed out" });
    } else {
      return res.status(404).send({ message: "Please signIn before Logout" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// const checkoutController = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     if (!userId) {
//       return res.status(400).json({ message: "Missing required parameters." });
//     }
//     let student = await Student.findOne({ userId });

//     if (!student) {
//       return res.status(404).send({ success: false, message: "not signin" });
//     }
//     res.status(200).send({ success: true, message: "signin successfully" });
//   } catch (error) {
//     res.status(500).send({ message: error.message });
//   }
// };

const checkoutController = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ message: "Missing required parameters." });
    }

    let student = await Student.findOne({ userId });

    if (!student) {
      return res.status(200).send({ success: true, message: "not signed in" });
    }
    const latestAttendance = student.attendence[student.attendence.length - 1];

    if (!latestAttendance || latestAttendance.signOut !== null) {
      return res.status(200).send({ success: true, message: "signed out" });
    } else {
      return res.status(200).send({ success: false, message: "signed in" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const viewReportController = async (req, res) => {
  try {
    // const report = await Student.find({ userId: req.user.id });
    const userId = req.user.id;
    const user = await Student.findOne({ userId }).populate("userId");
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const attendanceRecords = user.attendence || [];

    const groupedByDate = attendanceRecords.reduce((acc, record) => {
      const dateKey = new Date(record.date).toISOString().split("T")[0];

      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: dateKey,
          totalDuration: 0,
          signInSignOutArray: [],
        };
      }
      const signInTime = new Date(record.signIn).getTime();
      const signOutTime = record.signOut
        ? new Date(record.signOut).getTime()
        : signInTime;
      const durationInSeconds = (signOutTime - signInTime) / 1000;

      acc[dateKey].totalDuration += durationInSeconds;
      acc[dateKey].signInSignOutArray.push({
        signIn: record.signIn,
        signOut: record.signOut,
      });

      return acc;
    }, {});
    const report = Object.values(groupedByDate);

    console.log(report);
    if (!report) {
      return res.status(200).send({ message: "No Record Found" });
    }

    res.status(200).send({
      message: "Successfully Record Found",
      report,
      user: user.userId,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const viewReportAdminController = async (req, res) => {
  try {
    const userId = req.params.id;
    // const report = await Student.find({ userId: userId });
    // Replace with the actual user ID

    const user = await Student.findOne({ userId }).populate("userId");
    console.log(user);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const attendanceRecords = user.attendence || [];

    const groupedByDate = attendanceRecords.reduce((acc, record) => {
      const dateKey = new Date(record.date).toISOString().split("T")[0];

      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: dateKey,
          totalDuration: 0,
          signInSignOutArray: [],
        };
      }
      const signInTime = new Date(record.signIn).getTime();
      const signOutTime = record.signOut
        ? new Date(record.signOut).getTime()
        : signInTime;
      const durationInSeconds = (signOutTime - signInTime) / 1000;

      acc[dateKey].totalDuration += durationInSeconds;
      acc[dateKey].signInSignOutArray.push({
        signIn: record.signIn,
        signOut: record.signOut,
      });

      return acc;
    }, {});
    const report = Object.values(groupedByDate);

    console.log(report);
    if (!report) {
      return res.status(200).send({ message: "No Record Found" });
    }

    res.status(200).send({
      message: "Successfully Record Found",
      report,
      user: user.userId,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const allUsersController = async (req, res) => {
  try {
    const allUsers = await User.find().select("-password");
    if (!allUsers) {
      return res.status(404).send({ message: "user not found" });
    }
    res.status(200).send({ message: "all users found", allUsers });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
module.exports = {
  signInController,
  signOutController,
  checkoutController,
  viewReportController,
  viewReportAdminController,
  allUsersController,
};
