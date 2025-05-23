import { Router } from "express";
import { refreshAccessToken, signIn, signOut, signUp } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/sign-up", signUp);

authRouter.post("/sign-in", signIn);

authRouter.post("/sign-out", signOut);

authRouter.post("/refresh-token", refreshAccessToken);

export default authRouter;