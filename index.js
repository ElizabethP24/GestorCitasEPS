import express from "express";
import os from "os";
import { read, write } from "./src/utils/files.js"; // Mantén la utilidad de leer/escribir archivos
import Joi from "joi"; // Importa Joi para validar los datos de la cita
import PDFDocument from "pdfkit";
import path from "path";
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

let appointments = []; // Aquí se almacenan las citas

const appointmentsFilePath = path.join(__dirname, 'appointment.json');
const pdfDir = path.join(__dirname, 'pdfs');

// Asegúrate de que la carpeta pdfs existe
if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir); // Crea la carpeta si no existe
}

// Función para leer las citas del archivo JSON
function readAppointments() {
    try {
        const data = fs.readFileSync(appointmentsFilePath);
        return JSON.parse(data); // Devuelve el array de citas
    } catch (error) {
        console.error('Error al leer el archivo de citas:', error);
        return []; // Devuelve un array vacío en caso de error
    }
}

// Función para generar el PDF
function generatePDF() {
    const appointments = readAppointments(); // Lee las citas
    const doc = new PDFDocument();
    const filePath = path.join(pdfDir, 'appointments.pdf'); // Ruta donde se guardará el PDF

    // Configura la salida del PDF
    doc.pipe(fs.createWriteStream(filePath));

    // Título del PDF
    doc.fontSize(25).text('Citas', { align: 'center' });
    doc.moveDown();

    // Encabezados de la tabla
    doc.fontSize(12);
    doc.text('ID    Nombre Paciente          Documento      Especialidad   Fecha       Hora       EPS          Estado', {
        align: 'left',
        continued: true
    });

    // Dibuja una línea debajo de los encabezados
    doc.moveDown();
    doc.moveTo(50, doc.y)
        .lineTo(550, doc.y)
        .stroke();

    // Añade las citas a la tabla
    appointments.forEach(app => {
        const { id, nombre_paciente, documento, especialidad, fecha, hora, EPS, estado } = app;
        doc.text(`${id}    ${nombre_paciente}        ${documento}       ${especialidad}   ${fecha}   ${hora}   ${EPS}   ${estado}`);
    });

    // Finaliza el PDF
    doc.end();
}

// Middleware de log
app.use((req, res, next) => {
    console.log("Middleware");
    next();
});

// Esquema de validación de Joi
const appointmentSchema = Joi.object({
    id: Joi.number().integer().positive().required(), // Agrega esta línea para validar el ID
    nombre_paciente: Joi.string().required(),
    documento: Joi.string()
        .length(10)
        .pattern(/^[0-9]+$/)
        .required(), // Solo 10 dígitos
    especialidad: Joi.string().required(),
    fecha: Joi.date().greater("now").iso().required(), // Fecha superior a hoy
    hora: Joi.string()
    .pattern(/^([01][0-9]|2[0-3]):([0-5][0-9])$/)
    .required(), // Validar formato 24 horas
    EPS: Joi.string().required(),
    estado: Joi.string().valid("Pendiente", "Cancelada", "Completada").required(),
    confirmacion_cita: Joi.boolean().required(), // Agregada validación para confirmacion_cita
});

// Middleware para validar la actualización de citas
const validateAppointmentUpdate = (req, res, next) => {
    const { error } = appointmentSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

// Ruta para obtener todas las citas (appointments)
app.get("/appointments", (req, res) => {
    console.log("os.cpus()", os.cpus());
    const appointments = read(); // Lee las citas en lugar de tareas
    console.log("appointments", appointments);
    res.setHeader("Content-type", "application/json");
    res.end(JSON.stringify(appointments));
});

// Ruta para crear una nueva cita (appointment)
app.post(
    "/appointments",
    (req, res, next) => {
        console.log("Middleware POST");
        // Validar los datos de la cita usando Joi
        const { error } = appointmentSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message }); // Respuesta de error
        }
        next();
    },
    (req, res) => {
        const appointments = read(); // Lee las citas actuales
        const appointment = {
            ...req.body,
            id: appointments.length + 1, // Asigna un nuevo ID
        };
        appointments.push(appointment);
        write(appointments); // Escribe la nueva cita
         // Genera el PDF actualizado después de crear/modificar una cita
        generatePDF();
        res.status(201).json(appointments);
    }

);

// Ruta para obtener una cita específica por ID
app.get("/appointments/:id", (req, res) => {
    const appointments = read();
    const appointment = appointments.find(
        (app) => app.id === parseInt(req.params.id)
    );
    if (appointment) {
        res.json(appointment);
    } else {
        res.status(404).end();
    }
});

// Ruta para actualizar una cita (appointment)
app.put("/appointments/:id", validateAppointmentUpdate, (req, res) => {
    const appointments = read();
    let appointment = appointments.find(
        (app) => app.id === parseInt(req.params.id)
    );

    if (appointment) {
        const updatedAppointment = {
            ...appointment,
            ...req.body, // Actualiza los campos de la cita con los nuevos datos
        };

        const index = appointments.findIndex(
            (app) => app.id === parseInt(req.params.id)
        );
        appointments[index] = updatedAppointment;
        write(appointments); // Guarda los cambios
        res.json(updatedAppointment);
         // Genera el PDF actualizado después de crear/modificar una cita
        generatePDF();
    } else {
        res.status(404).end();
    }
});

// Ruta para eliminar una cita (appointment)
app.delete("/appointments/:id", (req, res) => {
    const appointments = read();
    const appointment = appointments.find(
        (app) => app.id === parseInt(req.params.id)
    );

    if (appointment) {
        appointments.splice(
            appointments.findIndex((app) => app.id === parseInt(req.params.id)),
            1
        );
        write(appointments);
        res.json(appointments);
         // Genera el PDF actualizado después de crear/modificar una cita
        generatePDF();
    } else {
        res.status(404).end();
    }
});

// Ruta para obtener citas por fecha específica
app.get("/appointments/date/:fecha", (req, res) => {
    const appointments = read(); // Leer todas las citas
    const appointment = appointments.filter(
        (app) => app.fecha === req.params.fecha
    ); // Filtrar por fecha

    if (appointment.length > 0) {
        res.json(appointment); // Devolver las citas encontradas
    } else {
        res.status(404).json({ message: "No hay citas para la fecha indicada" }); // Si no se encuentran citas
    }
});

//Ruta para obtener citas por documento del paciente
app.get("/appointments/patient/:documento", (req, res) => {
    const appointments = read();
    const document = req.params.documento;
    const patientAppointments = appointments.filter(
        (app) => app.documento === document
    );

    if (patientAppointments.length > 0) {
        res.json(patientAppointments);
    } else {
        res.status(404).json({ message: "No hay citas para este documento" });
    }
});

//Ruta para actualizar estado de una cita
app.put("/appointments/:id/status", (req, res) => {
    const appointments = read(); // Leer todas las citas
    let appointment = appointments.find(
        (app) => app.id === parseInt(req.params.id)
    );

    if (appointment) {
        // Verificar si el nuevo estado es diferente al actual
        if (appointment.estado === req.body.estado) {
            res.json({
                message:
                    "No se realizaron cambios, el estado ya es " + appointment.estado,
            });
            return;
        }

        // Si son diferentes, actualiza el estado
        appointment = { ...appointment, estado: req.body.estado || "pendiente" };
        const index = appointments.findIndex(
            (app) => app.id === parseInt(req.params.id)
        );
        appointments[index] = appointment;
        write(appointments); // Guardar los cambios
        res.json(appointment); // Retornar la cita actualizada
        generatePDF();
    } else {
        res.status(404).json({ message: "Cita no encontrada" });
    }
});

//Ruta para filtrar por especialidad
app.get("/appointments/specialty/:especialidad", (req, res) => {
    const appointments = read();
    const specialty = req.params.especialidad;
    const specialtyAppointments = appointments.filter(
        (app) => app.especialidad === specialty
    );

    if (specialtyAppointments.length > 0) {
        res.json(specialtyAppointments);
    } else {
        res
            .status(404)
            .json({ message: `No hay citas para la especialidad: ${specialty}` });
    }
});
// Ruta para filtrar citas por EPS
app.get("/appointments/eps/:eps", (req, res) => {
    const appointments = read(); // Leer todas las citas
    const eps = req.params.eps; // Obtener el valor de la EPS de los parámetros

    console.log("EPS buscada:", eps); // Mostrar la EPS que se está buscando
    console.log("Citas:", appointments); // Mostrar todas las citas

    const filteredAppointments = appointments.filter(
        (app) => app.EPS.toLowerCase() === eps.toLowerCase()
    );

    if (filteredAppointments.length > 0) {
        res.json(filteredAppointments); // Devolver las citas filtradas
    } else {
        res.status(404).json({ message: "No hay citas para la EPS indicada" }); // Si no hay citas para esa EPS
    }
});

// Ruta para filtrar por estado
app.get("/appointments/status/:estado", (req, res) => {
    const appointments = read(); // Asumiendo que `read` es la función que obtiene todas las citas
    const estado = req.params.estado;

    // Filtrar las citas por estado
    const filteredAppointments = appointments.filter(
        (app) => app.estado === estado
    );

    // Verificar si hay citas que coinciden con el estado
    if (filteredAppointments.length > 0) {
        res.json(filteredAppointments);
    } else {
        res.status(404).json({ message: `No hay citas con el estado: ${estado}` });
    }
});

//Ruta para reagendar cita
app.put(
    "/appointments/:id/reschedule",
    (req, res, next) => {
        // Validar los datos de la cita
        const { error } = Joi.object({
            fecha: Joi.date().greater("now").iso().required(),
            hora: Joi.string()
                .pattern(/^([01][0-9]|2[0-3]):([0-5][0-9])$/)
                .required(), // Validar formato 24 horas00000000000000000000000000000000000000000
        }).validate(req.body);

        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        next();
    },
    (req, res) => {
        const appointments = read(); // Leer las citas
        let appointment = appointments.find(
            (app) => app.id === parseInt(req.params.id)
        );

        if (appointment) {
            console.log("Antes de actualizar:", appointment);

            appointment = {
                ...appointment,
                fecha: req.body.fecha || appointment.fecha, // Usar la nueva fecha o mantener la actual
                hora: req.body.hora || appointment.hora, // Usar la nueva hora o mantener la actual
            };

            console.log("Después de actualizar:", appointment);

            const index = appointments.findIndex(
                (app) => app.id === parseInt(req.params.id)
            );
            appointments[index] = appointment;

            console.log("Lista actualizada de citas:", appointments);

            write(appointments); // Escribir los cambios en el archivo
            res.json(appointment); // Devolver la cita actualizada
            generatePDF();
        } else {
            res.status(404).json({ message: "Cita no encontrada" });
        }
    }
);

//Ruta para cancelar Cita
app.put("/appointments/:id/cancel", (req, res) => {
    const appointments = read();
    let appointment = appointments.find(
        (app) => app.id === parseInt(req.params.id)
    );

    if (appointment) {
        if (appointment.estado === "Cancelada") {
            res
                .status(400)
                .json({
                    message: "La cita ya está cancelada. No se generaron cambios.",
                });
        } else {
            appointment = { ...appointment, estado: "Cancelada" };
            const index = appointments.findIndex(
                (app) => app.id === parseInt(req.params.id)
            );
            appointments[index] = appointment;
            write(appointments);
            res.json(appointment);
            generatePDF();
        }
    } else {
        res.status(404).json({ message: "Cita no encontrada" });
    }
});

// Arrancar el servidor
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
