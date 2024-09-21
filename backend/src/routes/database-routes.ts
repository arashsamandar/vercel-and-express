import express, {Request, Response, NextFunction} from "express";
import mongoose from "mongoose";
import {asyncHandler} from "../utils/error-handling";
import mongodbAtlasMiddleware from "../middlewares/mongodb-atlas.middleware";
const mongoRouter = express.Router();

mongoRouter.get('/someurl',(req,res)=>{
    res.send('database routes');
});

mongoRouter.get('/getMongodb', mongodbAtlasMiddleware, asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await mongoose.connect("mongodb+srv://arashinternet:aCowDLeEt3Gf4QWb@cluster0.t1xjibr.mongodb.net/example?retryWrites=true&w=majority&appName=Cluster0");
    res.json({
        message: 'connection was a success',
    });
}));

export default mongoRouter;