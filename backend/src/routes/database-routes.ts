import {Router} from "express";
import mongoose from "mongoose";

const mongoRouter = Router();

mongoRouter.get('/someurl',(req,res)=>{
    res.send('database routes');
});

mongoRouter.get('/getMongodb', async (req, res, next)=>{
    try{
        await mongoose.connect("mongodb+srv://arashinternet:aCowDLeEt3Gf4QWb@cluster0.t1xjibr.mongodb.net/example?retryWrites=true&w=majority&appName=Cluster0");
        res.json({
            message:'connection was a success',
        })
    }catch (error: any){
        next(error);
    }
});

export default mongoRouter;