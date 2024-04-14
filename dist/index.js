const express = require('express');
const app = express();

app.get('/', (req, res) => {
    const expressVersion = express.version;
    res.send(`hello arash from Express Version : ${expressVersion}`);
});

app.get('/aarash',(req,res)=>{
	res.send('welcome to route aarash');
});
