import express from 'express';

const app = express();
app.listen(3000,()=>console.log('application ready to use'));

app.get('/api/helloarash',(req,res)=>{
	res.send('hello arash this one works ?? really ??');
});

app.get('/helloarash',(req,res)=>{
	res.send('hello arash this one works ?? really ??');
});