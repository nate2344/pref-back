import voteRouter from "./Vote";

import { Router } from "express";

const router = Router();

const voteRoutes = voteRouter;

router.use("/vote", voteRoutes);

export default router;
