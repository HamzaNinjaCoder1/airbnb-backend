import express from "express";
import { createUser, checkemailexist, login, logout } from '../Controllers/userscontroller.js';
import { authMiddleware } from '../middleware/authmiddleware.js';
const usersRouter = express.Router();
usersRouter.post('/register', createUser);
usersRouter.post('/checkemailexist', checkemailexist);
usersRouter.post('/login', login);
usersRouter.post('/logout', logout);
usersRouter.get('/me', authMiddleware, (req, res)=>{
    res.status(200).json({message: "Login successful", user: req.user});
});
export default usersRouter;
