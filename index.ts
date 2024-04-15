import express from 'express';
const app = express();
app.listen(3000,()=>console.log('application ready to use'));
app.get('/',(req,res)=>{
	res.send("hello aarash samandar from Ts");
});

app.get('/aarash',(req,res)=>{
	res.send('hello from aarash route babe');
});

app.get('/newaddress',(req,res)=>{
	res.send('new address added to the Vercel arash sir');
});

app.get('/check',(req,res)=>{
	res.send('Welcome to the Check Route');
});