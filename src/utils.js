import {dirname} from 'path';
import { fileURLToPath } from 'url';

//Para trabajar rutas absolutas
export const __dirname = dirname(fileURLToPath(import.meta.url));

export {__dirname}