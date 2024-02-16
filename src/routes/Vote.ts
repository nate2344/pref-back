import { Router } from "express";
import { VoteController } from "../controllers/Vote";
import { handleErrors, parseResponse } from "../utils";

import multer from "multer";

const voteRouter = Router();
const voteController = new VoteController();
const storage = multer.memoryStorage();
const upload = multer({ storage });

voteRouter.route("/photo/:photoName").get(
  handleErrors(async (req, res) => {
    console.log(req.params.photoName);

    const result = await voteController.getPhoto(req.params.photoName);

    parseResponse(res, 201, result);
  })
);

voteRouter.route("/").get(
  handleErrors(async (_, res) => {
    const votes = await voteController.getAllVotes();

    parseResponse(res, 200, votes);
  })
);

voteRouter.route("/").post(
  upload.single("image"),
  handleErrors(async (req, res) => {
    console.log(req.file);
    console.log(req.body);

    const result = await voteController.vote(req.body, req.file);

    parseResponse(res, 201, result);
  })
);

voteRouter.route("/create-table").get(
  handleErrors(async (_, res) => {
    const result = await voteController.createTable();

    parseResponse(res, 201, result);
  })
);

export default voteRouter;
