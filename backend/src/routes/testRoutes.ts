import express from "express";
import mongoose from "mongoose";

const router = express.Router();

router.get('/checkmyerror', (req, res, next)=>{
   next(new Error('some error message i sent for you'));
});

router.get('/checkRoute', (req, res)=>{
    res.json({
        message: 'this is a test route arash',
    })
});

router.get('/getMongodb', async (req, res, next)=>{
    try{
        await mongoose.connect("mongodb+srv://arashinternet:aCowDLeEt3Gf4QWb@cluster0.t1xjibr.mongodb.net/example?retryWrites=true&w=majority&appName=Cluster0");
        res.json({
            message:'connection was a success',
        })
    }catch (error: any){
        next(error);
    }
});

export default router;
