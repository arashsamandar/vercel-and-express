import express, { Request, Response, NextFunction } from 'express';
import router from './src/routes/testRoutes';

const app = express();

app.use(express.json());
app.use('/api/tests/', router);
app.get('/api/testApplication', (req, res)=>{
	res.send('Application Is Working Gracefully Arash');
});

app.use((error: any, req: Request, res: Response, next: NextFunction)=>{
	res.status(500).json({
		message: error.message,
		stack_trace: error.stack
	});
})

app.listen(3000,()=>console.log('application ready to use'));