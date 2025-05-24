import { Router } from "express";
import * as UserController from "../controllers/user.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get('/', authorize, UserController.getUsers);

userRouter.get('/:id', authorize, UserController.getUser);

userRouter.post('/', (req, res) => {
    res.send({
        title: "CREATE a new user"
    })
});


userRouter.put('/:id', (req, res) => {
    res.send({
        title: "UPDATE a user"
    })
});

userRouter.delete('/:id', (req, res) => {
    res.send({
        title: "DELETE a user"
    })
});


export default userRouter;