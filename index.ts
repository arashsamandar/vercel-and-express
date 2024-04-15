import express from 'express';
import mongodb from 'mongodb';

const app = express();
app.listen(3000,()=>console.log('hello arash server is up'));

app.get('/',(req,res)=>{
	res.send("hello aarash samandar from Ts");
});

app.get('/aarash',(req,res)=>{
	res.send('hello from aarash route babe');
})
