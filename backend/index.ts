const startTime = Date.now();

import express from 'express';
const app = express();

app.listen(3000,()=>console.log('application ready to use'));

app.get('/api/helloarash', (req, res)=>{
	let responseStartTime = Date.now();
	res.json({
		totalTime:Date.now()-startTime,
		responseTime:Date.now()-responseStartTime,
	});
});

app.get('/api/helloarash2', (req, res)=>{
	res.send('hello arash this one works On Two 2');
});

app.get('/api/testApplication', (req, res)=>{
	res.send('Application Is Working Gracefully Arash');
});
