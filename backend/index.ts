import express from 'express';
import router from './src/routes/testRoutes';

const app = express();
app.use('/api/tests/', router);

app.get('/api/testApplication', (req, res)=>{
	res.send('Application Is Working Gracefully Arash');
});

app.listen(3000,()=>console.log('application ready to use'));