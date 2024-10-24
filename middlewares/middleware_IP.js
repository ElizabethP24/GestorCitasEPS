import dayjs from 'dayjs';

// Middleware para agregar la IP y la fecha de creación o actualización
const middleware_IP = (req, res, next) => {
   // Obtener la IP desde el encabezado 'x-forwarded-for' o la conexión remota
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

   // Si la IP es IPv6 localhost (::1), cambiarla a IPv4 localhost (127.0.0.1)
    const ipv4 = ip === '::1' ? '127.0.0.1' : ip;

   // Si la IP es IPv6, se extrae la parte IPv4 (si existe) o se deja tal cual
    req.body.ip = ipv4.includes(':') ? ipv4.split(':').pop() : ipv4;
    
    // Obtener la fecha y hora actual en formato HH:mm DD-MM-YYYY
    const currentDateTime = dayjs().format('HH:mm DD-MM-YYYY');

    // Si es una creación (POST), añade created_at, si es actualización (PUT), añade updated_at
    if (req.method === 'POST') {
        req.body.created_at = currentDateTime;
    } else if (req.method === 'PUT') {
        req.body.updated_at = currentDateTime;
    }

    next(); // Continua con el siguiente middleware o controlador
};

export default middleware_IP;
