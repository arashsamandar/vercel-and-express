"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = void 0;
let globalErrorHandling;
exports.default = globalErrorHandling = (error, req, res, next) => {
    res.status(500).json({
        message: error.message,
        stack_trace: error.stack
    });
};
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
exports.asyncHandler = asyncHandler;
