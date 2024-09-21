import mongoose from 'mongoose';
import connectingToMongodb from '../database/mongodb-atlas';

export const waitForDbConnection = (maxRetries = 3, retryInterval = 3500): Promise<void> => {
    return new Promise((resolve, reject) => {
        let retries = 0;

        const checkConnection = async () => {
            if (mongoose.connection.readyState === 1) {
                resolve();
            } else if (retries >= maxRetries) {
                reject(new Error('Max retries reached. Database connection failed.'));
            } else {
                await connectingToMongodb();
                retries++;
                setTimeout(checkConnection, retryInterval);
            }
        };
        checkConnection();
    });
};