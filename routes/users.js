var express = require('express');
const userRouter = express.Router();
const userController = require("../controllers/users");
const {verifyAccessToken} = require("../middlewares/auth");
/* User signing up. */
userRouter.post("/sign-up", userController.signUp);
/* User login. */

userRouter.post("/login", userController.login);


/* User logout. */
userRouter.post("/logout", verifyAccessToken, userController.logout);


/* Get a specific user. */
userRouter.get("/:id", verifyAccessToken, userController.specificUser);

/* Place all users. */
userRouter.post("/bet/:id", verifyAccessToken, userController.bet);








module.exports = userRouter;
