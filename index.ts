import express from 'express';

const app = express();
// app.use(express.static('public'));
app.listen(3000,()=>console.log('application ready to use'));

// app.get('/',(req,res)=>{
// 	res.sendFile('index.html',{root:__dirname + '\\public'})
// });

app.get('/helloarash',(req,res)=>{
	res.send('hello arash this one works ?? really ??');
})