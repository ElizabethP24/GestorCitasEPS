import express from 'express';
import { appointmentFileRouter } from '../routes/appointment.file.router.js';

const router = express.Router();

export function routerAppointments(app) {
    app.use('/api', router);
    router.use("/file/appointments", appointmentFileRouter);
}