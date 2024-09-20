import mongoose from 'mongoose';

export const waitForDbConnection = (maxRetries = 3, retryInterval = 1000): Promise<void> => {
    return new Promise((resolve, reject) => {
        let retries = 0;

        const checkConnection = () => {
            if (mongoose.connection.readyState === 1) {
                resolve();
            } else if (retries >= maxRetries) {
                reject(new Error('Max retries reached. Database connection failed.'));
            } else {
                retries++;
                setTimeout(checkConnection, retryInterval);
            }
        };

        checkConnection();
    });
};