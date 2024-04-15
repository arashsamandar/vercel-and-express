import express from 'express';
const app = express();
app.listen(3000,()=>console.log('hello arash server is up'));
app.get('/',(req,res)=>{
	res.send("hello aarash samandar from Ts");
});
