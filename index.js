import express from 'express';
import os from 'os';
import { read, write } from './src/utils/files.js'; // Mantén la utilidad de leer/escribir archivos

const app = express();
app.use(express.json());

// Middleware de log
app.use((req, res, next) => {
    console.log('Middleware');
    next();
});

// Ruta para obtener todas las citas (appointments)
app.get('/appointments', (req, res) => {
    console.log('os.cpus()', os.cpus());
    const appointments = read(); // Lee las citas en lugar de tareas
    console.log('appointments', appointments);
    res.setHeader('Content-type', 'application/json');
    res.end(JSON.stringify(appointments));
});

// Ruta para crear una nueva cita (appointment)
app.post('/appointments', (req, res, next) => {
    console.log('Middleware POST');
    next();
}, (req, res) => {
    const appointments = read(); // Lee las citas actuales
    const appointment = {
        ...req.body,
        id: appointments.length + 1 // Asigna un nuevo ID
    };
    appointments.push(appointment);
    write(appointments); // Escribe la nueva cita
    res.status(201).json(appointments);
});

// Ruta para obtener una cita específica por ID
app.get('/appointments/:id', (req, res) => {
    const appointments = read();
    const appointment = appointments.find(app => app.id === parseInt(req.params.id));
    if (appointment) {
        res.json(appointment);
    } else {
        res.status(404).end();
    }
});

// Ruta para actualizar una cita (appointment)
app.put('/appointments/:id', (req, res) => {
    const appointments = read();
    let appointment = appointments.find(app => app.id === parseInt(req.params.id));

    if (appointment) {
        const updatedAppointment = {
            ...appointment,
            ...req.body // Actualiza los campos de la cita con los nuevos datos
        };

        const index = appointments.findIndex(app => app.id === parseInt(req.params.id));
        appointments[index] = updatedAppointment;
        write(appointments); // Guarda los cambios
        res.json(updatedAppointment);
    } else {
        res.status(404).end();
    }
});

// Ruta para eliminar una cita (appointment)
app.delete('/appointments/:id', (req, res) => {
    const appointments = read();
    const appointment = appointments.find(app => app.id === parseInt(req.params.id));

    if (appointment) {
        appointments.splice(appointments.findIndex(app => app.id === parseInt(req.params.id)), 1);
        write(appointments);
        res.json(appointments);
    } else {
        res.status(404).end();
    }
});

// Ruta para obtener citas por fecha específica
app.get('/appointments/date/:fecha', (req, res) => {
    const appointments = read();  // Leer todas las citas
    const appointment = appointments.filter(app => app.fecha === req.params.fecha); // Filtrar por fecha

    if (appointment.length > 0) {
        res.json(appointment);  // Devolver las citas encontradas
    } else {
        res.status(404).json({ message: 'No hay citas para la fecha indicada' });  // Si no se encuentran citas
    }
});

//Ruta para obtener citas por documento del paciente 
app.get('/appointments/patient/:documento', (req, res) => {
    const appointments = read();
    const document = req.params.documento;
    const patientAppointments = appointments.filter(app => app.documento === document);

    if (patientAppointments.length > 0) {
        res.json(patientAppointments);
    } else {
        res.status(404).json({ message: 'No hay citas para este documento' });
    }
});

//Ruta para actualizar estado de una cita
app.put('/appointments/:id/status', (req, res) => {
    const appointments = read(); // Leer todas las citas
    let appointment = appointments.find(app => app.id === parseInt(req.params.id));

    if (appointment) {
        // Verificar si el nuevo estado es diferente al actual
        if (appointment.estado === req.body.estado) {
            res.json({ message: 'No se realizaron cambios, el estado ya es ' + appointment.estado });
            return;
        }
        
        // Si son diferentes, actualiza el estado
        appointment = { ...appointment, estado: req.body.estado || 'pendiente' };
        const index = appointments.findIndex(app => app.id === parseInt(req.params.id));
        appointments[index] = appointment;
        write(appointments); // Guardar los cambios
        res.json(appointment); // Retornar la cita actualizada
    } else {
        res.status(404).json({ message: 'Cita no encontrada' });
    }
});

//Ruta para filtrar por especialidad
app.get('/appointments/specialty/:especialidad', (req, res) => {
    const appointments = read();
    const specialty = req.params.especialidad;
    const specialtyAppointments = appointments.filter(app => app.especialidad === specialty);

    if (specialtyAppointments.length > 0) {
        res.json(specialtyAppointments);
    } else {
        res.status(404).json({ message: `No hay citas para la especialidad: ${specialty}` });
    }
});

//Ruta para filtrar por estado
app.get('/appointments/status/:estado', (req, res) => {
    const appointments = read();
    const status = req.params.estado;
    const statusAppointments = appointments.filter(app => app.estado === status);

    if (statusAppointments.length > 0) {
        res.json(statusAppointments);
    } else {
        res.status(404).json({ message: `No hay citas en este estado: ${status}` });
    }
});

// Ruta para filtrar citas por EPS
app.get('/appointments/eps/:eps', (req, res) => {
    const appointments = read(); // Leer todas las citas
    const eps = req.params.eps; // Obtener el valor de la EPS de los parámetros

    console.log('EPS buscada:', eps);  // Mostrar la EPS que se está buscando
    console.log('Citas:', appointments);  // Mostrar todas las citas

    const filteredAppointments = appointments.filter(app => app.EPS.toLowerCase() === eps.toLowerCase());
    
    if (filteredAppointments.length > 0) {
        res.json(filteredAppointments);  // Devolver las citas filtradas
    } else {
        res.status(404).json({ message: 'No hay citas para la EPS indicada' });  // Si no hay citas para esa EPS
    }
});

//Ruta para reagendar cita
app.put('/appointments/:id/reschedule', (req, res) => {
    const appointments = read(); // Leer las citas
    let appointment = appointments.find(app => app.id === parseInt(req.params.id));

    if (appointment) {
        console.log('Antes de actualizar:', appointment);

        appointment = {
            ...appointment,
            fecha: req.body.fecha || appointment.fecha, // Usar la nueva fecha o mantener la actual
            hora: req.body.hora || appointment.hora // Usar la nueva hora o mantener la actual
        };

        console.log('Después de actualizar:', appointment);

        const index = appointments.findIndex(app => app.id === parseInt(req.params.id));
        appointments[index] = appointment;

        console.log('Lista actualizada de citas:', appointments);

        write(appointments); // Escribir los cambios en el archivo
        res.json(appointment); // Devolver la cita actualizada
    } else {
        res.status(404).json({ message: 'Cita no encontrada' });
    }
});

//Ruta para cancelar Cita 
app.put('/appointments/:id/cancel', (req, res) => {
    const appointments = read();
    let appointment = appointments.find(app => app.id === parseInt(req.params.id));

    if (appointment) {
        if (appointment.estado === 'Cancelada') {
            res.status(400).json({ message: 'La cita ya está cancelada. No se generaron cambios.' });
        } else {
            appointment = { ...appointment, estado: 'Cancelada' };
            const index = appointments.findIndex(app => app.id === parseInt(req.params.id));
            appointments[index] = appointment;
            write(appointments);
            res.json(appointment);
        }
    } else {
        res.status(404).json({ message: 'Cita no encontrada' });
    }
});

// Arrancar el servidor
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
