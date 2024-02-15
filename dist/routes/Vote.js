"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Vote_1 = require("../controllers/Vote");
const database_1 = require("../config/database");
const utils_1 = require("../utils");
const multer_1 = __importDefault(require("multer"));
const voteRouter = (0, express_1.Router)();
const voteController = new Vote_1.VoteController();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
voteRouter.route("/").get((0, utils_1.handleErrors)(async (_, res) => {
    const votes = (await (0, database_1.executeQuery)("SELECT * FROM votes")).rows;
    (0, utils_1.parseResponse)(res, 200, votes);
}));
voteRouter.route("/").post(upload.single("image"), (0, utils_1.handleErrors)(async (req, res) => {
    console.log(req.file);
    console.log(req.body);
    const result = await voteController.vote(req.body, req.file);
    (0, utils_1.parseResponse)(res, 201, result);
}));
voteRouter.route("/create-table").get((0, utils_1.handleErrors)(async (_, res) => {
    const result = await voteController.createTable();
    (0, utils_1.parseResponse)(res, 201, result);
}));
exports.default = voteRouter;
