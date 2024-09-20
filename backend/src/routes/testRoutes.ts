import express from "express";
import connectToMongoAtlas from "../database/mongodb_atlas";

const router = express.Router();

router.get('/checkmyerror', (req, res, next)=>{
   next(new Error('some error message i sent for you'));
});

router.get('/checkRoute', (req, res)=>{
    res.json({
        message: 'this is a test route arash',
    })
});

router.get('/getMongodb', (req, res, next)=>{
    try{
        connectToMongoAtlas();
    }catch (error: any){
        next(error);
    }
});

export default router;
