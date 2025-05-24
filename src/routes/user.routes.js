import { Router } from "express";
import * as UserController from "../controllers/user.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get('/', authorize, UserController.getUsers);

userRouter.get('/:id', authorize, UserController.getUser);

userRouter.put('/:id', authorize, UserController.updateUser);

userRouter.delete('/:id', authorize, UserController.deleteUser);

export default userRouter;