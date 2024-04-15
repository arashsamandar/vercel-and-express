const express = require('express');
const app = express();

app.get('/',(req,res)=>{
	res.send('hello arash samandar');
});

app.get('/aarash',(req,res)=>{
	res.send('hello from aarash end point');
})