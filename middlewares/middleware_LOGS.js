// middlewares/middleware_LOGS.js
import fs from 'fs';
import path from 'path';
import dayjs from 'dayjs';

// Especificar la ruta absoluta al archivo de log
const accessLogPath = 'D:/ELIZA/SISTEMAS/INGENIERIA/SEMESTRE III/PROG. WEB II/GestorCitasEPS/access_log.txt';

const loggerMiddleware = (req, res, next) => {
    // Obtener la fecha y hora actual
    const now = dayjs().format('DD-MM-YYYY HH:mm:ss');
    // Obtener el método HTTP, la ruta y los headers
    const method = req.method;
    const reqPath = req.path; // Cambiado a reqPath para evitar conflicto con path
    const headers = JSON.stringify(req.headers);
    
    // Formatear la línea del registro
    const logEntry = `${now} [${method}] [${reqPath}] ${headers}\n`;

    // Escribir en el archivo
    fs.appendFile(accessLogPath, logEntry, (err) => {
        if (err) {
            console.error('Error writing to access log:', err);
        }
    });

    // Llamar al siguiente middleware o ruta
    next();
};

export default loggerMiddleware;
