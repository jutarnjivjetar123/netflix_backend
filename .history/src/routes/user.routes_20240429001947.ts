import express from "express";
import UserRepository from "repository/user.repository";

const userRoute = express.Router();
userRoute.use(express.json());


export default userRoute;
