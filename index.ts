import express from 'express';
const app = express();
app.listen(3000,()=>console.log('hello arash server is up'));
app.get('/',(req,res)=>{
	const expressVersiono = express.version;
	res.send(`hello arash from : ${expressVersiono}`);
});
