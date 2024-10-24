import express from "express";
import { routerAppointments } from './routes/index.js';

const app = express();
app.use(express.json());


// Middleware de log
app.use((req, res, next) => {
    console.log("Middleware");
    next();
});

routerAppointments(app)

// Arrancar el servidor
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
