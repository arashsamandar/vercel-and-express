import {NextFunction, Request, Response} from "express";

let globalErrorHandling: (error: any, req: Request, res: Response, next: NextFunction) => void;
export default globalErrorHandling = (error: any, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({
        message: error.message,
        stack_trace: error.stack
    });
};

export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

