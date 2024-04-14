const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send("hello baby baby boy aarash :)");
});

app.get('/aarash',(req,res)=>{
	res.send('welcome to route aarash');
});
