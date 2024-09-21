import {waitForDbConnection} from "../utils/check-database-connection";

const mongodbAtlasMiddleware = async (req: any, res: any, next: any) => {
    await waitForDbConnection();
    next();
};

export default mongodbAtlasMiddleware;