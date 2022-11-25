import logger from 'jet-logger';
import dotenv from "dotenv"
import EnvVars from '@src/declarations/major/EnvVars';
import server from './server';

dotenv.config()
// **** Start server **** //

const msg = ('Express server started on port: ' + EnvVars.port.toString());
server.listen(EnvVars.port, () => logger.info(msg));
