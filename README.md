### GestorCitasEPS

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
8. Filtros 
 - Filtro por la fecha de la cita 
  Ejemplo de solicitud:
  bash
  http://localhost:3000/appointments/date/2024-23-10
  Ejemplo de respuesta:
  json
  {
        "id": 1,
        "nombre_paciente": "Juan Pérez",
        "documento": "123456789",
        "especialidad": "Cardiología",
        "fecha": "2024-23-10",
        "hora": "10:45",
        "EPS": "Nueva EPS",
        "estado": "pendiente"
    }
  
   - Filtro por la especialidad
  Ejemplo de solicitud:
  bash
  http://localhost:3000/appointments/specialty/Neurología
  Ejemplo de respuesta:
  json  
  {
        "id": 4,
        "nombre_paciente": "Luisa Martínez",
        "documento": "987123654",
        "especialidad": "Neurología",
        "fecha": "2024-10-13",
        "hora": "09:00",
        "EPS": "Sanitas",
        "estado": "Pendiente"
    }
   -Filtro por la EPS
  Ejemplo de solicitud:
  bash
  http://localhost:3000/appointments/eps/SURA
  Ejemplo de respuesta:
  json  
 {
        "id": 2,
        "nombre_paciente": "Ana Gómez",
        "documento": "987654321",
        "especialidad": "Dermatología",
        "fecha": "2024-10-11",
        "hora": "11:00",
        "EPS": "Sura",
        "estado": "Pendiente"
    }

    -Filtro por el estado
     Ejemplo de solicitud:
  bash
  http://localhost:3000/appointments/status/Cancelada
  Ejemplo de respuesta:
  json  
  {
        "id": 3,
        "nombre_paciente": "Carlos Rodríguez",
        "documento": "123789456",
        "especialidad": "Pediatría",
        "fecha": "2024-10-12",
        "hora": "14:00",
        "EPS": "Compensar",
        "estado": "Cancelada"
    }

    ## Validación de Datos y Generación de PDF

Este proyecto utiliza la biblioteca [Joi](https://joi.dev/) para la validación de datos. Joi permite definir esquemas de validación para asegurarse de que los datos ingresados cumplen con los requisitos especificados antes de ser procesados.

### Validación de Citas

Las citas se validan utilizando un esquema definido en Joi, lo que garantiza que todos los campos requeridos estén presentes y en el formato correcto. Esto ayuda a evitar errores y garantiza la integridad de los datos.

### Generación de PDF

Además, este proyecto genera un PDF con las citas almacenadas. La generación del PDF se realiza utilizando la biblioteca [PDFKit](https://pdfkit.org/), que permite crear documentos PDF fácilmente. Las citas se leen desde un archivo `appointments.json`, y el PDF se genera dinámicamente en base a los datos contenidos en este archivo.

El PDF resultante se guarda en la carpeta `pdfs`, y se nombra como `appointments.pdf`. Esto facilita la gestión de las citas, permitiendo su visualización y descarga en formato PDF.