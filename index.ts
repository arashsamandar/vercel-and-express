import express from 'express';
import mongodb from 'mongodb';

const app = express();
app.get('/',(req,res)=>{
	res.send("hello aarash samandar from Ts");
});

app.get('/aarash',(req,res)=>{
	res.send('hello from aarash route babe');
});

app.get('/newaddress',(req,res)=>{
	res.send('new address added to the Vercel arash sir');
});
