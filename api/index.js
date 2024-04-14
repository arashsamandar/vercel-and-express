const express = require('express');
const app = express();

app.listen(3000,()=>console.log('hello arash'));
app.get('/',(req,res)=>{
	res.send('hello arash samandar');
});
