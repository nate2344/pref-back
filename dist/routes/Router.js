"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vote_1 = __importDefault(require("./Vote"));
const express_1 = require("express");
const router = (0, express_1.Router)();
const voteRoutes = Vote_1.default;
router.use("/vote", voteRoutes);
exports.default = router;
