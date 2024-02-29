const express = require("express");
const {
  signInController,
  signOutController,
  checkoutController,
  viewReportController,
  allUsersController,
  viewReportAdminController,
} = require("../controller/student.js");
const { authUserMiddleware } = require("../middleware/authUser");
const router = express.Router();

router.put("/signin", authUserMiddleware, signInController);
router.put("/signout", authUserMiddleware, signOutController);
router.get("/checkout", authUserMiddleware, checkoutController);
router.get("/view-report", authUserMiddleware, viewReportController);
router.get(
  "/admin-view-report/:id",
  authUserMiddleware,
  viewReportAdminController
);
router.get("/all-users", authUserMiddleware, allUsersController);
module.exports = router;
