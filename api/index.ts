import app from '../server/index'; // assuming your Express app is exported
import serverless from 'serverless-http';

export const handler = serverless(app);
