import { Router } from "express";
import * as AuthControllers from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/sign-up", AuthControllers.signUp);

authRouter.post("/sign-in", AuthControllers.signIn);

authRouter.post("/sign-out", AuthControllers.signOut);

authRouter.post("/refresh-token", AuthControllers.refreshAccessToken);

export default authRouter;