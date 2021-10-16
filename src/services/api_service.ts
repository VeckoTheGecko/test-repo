import sqlite from 'sqlite3';
import { Sequelize } from "sequelize";

import { StudentModel } from "./models/student_sequelized";
import { AppointmentModel } from "./models/appointment_sequelized";
const path = require('path');


const sequelize = new Sequelize({
    dialect: 'sqlite',
    dialectModule: sqlite,
    storage: path.resolve(__dirname, 'database.sqlite3')
});

const Student = StudentModel(sequelize, Sequelize);

const Appointment = AppointmentModel(sequelize, Sequelize);
Appointment.hasOne(Student, {
	onDelete: 'cascade'
}); 
//Adds a 'studentID'(a foreign key) to the appointment table
//https://sequelize.org/master/manual/assocs.html

//creates the database and its tables
sequelize.sync().then(() => {
	console.log('Tables were created..')
});

export { Student, Appointment};
