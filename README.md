GestorCitasEPS

Descripción del Proyecto
GestorCitasEPS es una aplicación diseñada para gestionar citas médicas de pacientes en una EPS. El sistema permite crear, actualizar, eliminar y consultar citas, así como filtrarlas según su estado (Pendiente, Cancelada, Completada). Utiliza Node.js y Express para el backend, almacenando las citas en un archivo JSON.


Inicia el servidor:
bash
Copiar código
npm run dev
El servidor correrá en http://localhost:3000.

Rutas de la API

1. Obtener todas las citas
Ruta: GET /appointments
Descripción: Devuelve la lista completa de citas médicas registradas.

Ejemplo de solicitud:
bash
Copiar código
GET http://localhost:3000/appointments

Respuesta:
json
[
  {
    "id": "1",
    "nombre_paciente": "John Doe",
    "documento": "123456789",
    "especialidad": "Pediatría",
    "fecha": "2024-10-08",
    "hora": "10:00",
    "EPS": "Nueva EPS",
    "estado": "Completada"
  }
]

2. Obtener citas por estado
Ruta: GET /appointments/status/:status
Descripción: Filtra las citas según su estado (Pendiente, Cancelada, Completada).
Parámetro de ruta: status - El estado de la cita que se desea consultar.
Ejemplo de solicitud:
bash
Copiar código
GET http://localhost:3000/appointments/status/Pendiente
Respuesta:
json
[
  {
    "id": "2",
    "nombre_paciente": "Jane Doe",
    "documento": "987654321",
    "especialidad": "Cardiología",
    "fecha": "2024-10-10",
    "hora": "12:00",
    "EPS": "Sura",
    "estado": "Pendiente"
  }
]

3. Crear una nueva cita
Ruta: POST /appointments
Descripción: Crea una nueva cita en el sistema.
Cuerpo (body):
json
{
  "id": "9",
  "nombre_paciente": "Esteban Quintero",
  "documento": "1053000929",
  "especialidad": "Odontología",
  "fecha": "2024-10-10",
  "hora": "09:15",
  "EPS": "Salud Total",
  "estado": "Pendiente"
}
Ejemplo de solicitud:
bash
Copiar código
POST http://localhost:3000/appointments
Cuerpo de la solicitud
Respuesta:
json
{
  "message": "Cita creada con éxito",
  "appointment": {
    "id": "9",
    "nombre_paciente": "Esteban Quintero",
    "documento": "1053000929",
    "especialidad": "Odontología",
    "fecha": "2024-10-10",
    "hora": "09:15",
    "EPS": "Salud Total",
    "estado": "Pendiente"
  }
}

4. Actualizar una cita
Ruta: PUT /appointments/:id
Descripción: Actualiza los datos de una cita existente.
Parámetro de ruta: id - El ID de la cita que se desea actualizar.
Cuerpo (body):
json
{
  "nombre_paciente": "Esteban Quintero",
  "documento": "1053000929",
  "especialidad": "Odontología",
  "fecha": "2024-10-10",
  "hora": "09:15",
  "EPS": "Salud Total",
  "estado": "Completada"
}
Ejemplo de solicitud:
bash
PUT http://localhost:3000/appointments/9
Cuerpo de la solicitud
Respuesta:
json
{
  "message": "Cita actualizada con éxito",
  "appointment": {
    "id": "9",
    "nombre_paciente": "Esteban Quintero",
    "documento": "1053000929",
    "especialidad": "Odontología",
    "fecha": "2024-10-10",
    "hora": "09:15",
    "EPS": "Salud Total",
    "estado": "Completada"
  }
}

5. Eliminar una cita
Ruta: DELETE /appointments/:id
Descripción: Elimina una cita del sistema según su ID.
Parámetro de ruta: id - El ID de la cita que se desea eliminar.
Ejemplo de solicitud:
bash
DELETE http://localhost:3000/appointments/9
Respuesta:
json
{
  "message": "Cita eliminada con éxito"
}

6. Cancelar una cita
Ruta: PUT /appointments/:id/cancel
Descripción: Cambia el estado de una cita a "Cancelada".
Parámetro de ruta: id - el ID de la cita a cancelar.
Ejemplo de solicitud:
bash
Copiar código
PUT http://localhost:3000/appointments/9/cancel
Ejemplo de respuesta:
json
{
  "message": "Cita cancelada con éxito",
  "appointment": {
    "id": "9",
    "nombre_paciente": "Esteban Quintero",
    "documento": "1053000929",
    "especialidad": "Odontología",
    "fecha": "2024-10-10",
    "hora": "09:15",
    "EPS": "Salud Total",
    "estado": "Cancelada"
  }
}

7. Reagendar una cita
Ruta: PUT /appointments/:id/reschedule
Descripción: Permite cambiar la fecha y hora de una cita existente.
Parámetro de ruta: id - el ID de la cita a reagendar.
Body: Se envía en formato JSON con la nueva fecha y hora.
Ejemplo de solicitud:
bash
Copiar código
PUT http://localhost:3000/appointments/9/reschedule
Body:
json
Copiar código
{
    "fecha": "2024-10-23",
    "hora": "11:23"
}
Ejemplo de respuesta:
json
Copiar código
{
  "message": "Cita reagendada con éxito",
  "appointment": {
    "id": "9",
    "nombre_paciente": "Esteban Quintero",
    "documento": "1053000929",
    "especialidad": "Odontología",
    "fecha": "2024-10-23",
    "hora": "11:23",
    "EPS": "Salud Total",
    "estado": "Pendiente"
  }
}
