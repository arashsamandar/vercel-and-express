import express from "express";

const router = express.Router();

router.get('/checkRoute', (req, res)=>{
   res.json({
       "message": "this is a test route",
   });
});

export default router;
