import express from 'express';

const app = express();
// app.listen(3000,()=>console.log('application ready to use'));

app.get('/api/helloarash',(req,res)=>{
	res.send('hello arash this one works ?? really ?? you are here :)');
});

app.get('/havij',(req,res)=>{
	res.send('hello samandar');
});

export default app;
