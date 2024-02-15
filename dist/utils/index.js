"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMessage = exports.parseResponse = exports.handleErrors = void 0;
const handleErrors = (handler) => async (req, res, next) => {
    try {
        await handler(req, res, next);
    }
    catch (error) {
        res
            .status(500)
            .json({ errors: { message: "Ocorreu um erro no servidor" } });
    }
};
exports.handleErrors = handleErrors;
function parseResponse(res, status, result) {
    if (result.errors) {
        res.status(400).json(result);
    }
    else {
        res.status(status).json(result);
    }
}
exports.parseResponse = parseResponse;
function errorMessage(message) {
    return { errors: { message } };
}
exports.errorMessage = errorMessage;
