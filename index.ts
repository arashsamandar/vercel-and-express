import express from 'express';
import mongodb from 'mongodb';

const app = express();
app.listen(3000,()=>console.log('application ready to use'));


app.get('/',(req,res)=>{
	res.send("hello aarash samandar from Ts");
});

app.get('/aarash',(req,res)=>{
	res.send('Adding Only Neccesary Routes Like AARASH Route');
});

app.get('/testing',(req,res)=>{
	res.json({name:"arash",family:"samandar"}).send();
})