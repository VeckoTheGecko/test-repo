import { Sequelize } from "sequelize";

import { StudentModel } from "./models/student_sequelized";
import { AppointmentModel } from "./models/appointment_sequelized";


const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database/database.sqlite3'
});

const Student = StudentModel(sequelize, Sequelize);


const Appointment = AppointmentModel(sequelize, Sequelize);
Appointment.hasOne(Student, {
	onDelete: 'cascade'

}); //Adds a 'studentID'(a foreign key) to the appointment table
							 //https://sequelize.org/master/manual/assocs.html


sequelize.sync().	//creates the database and its tables
then(() => {
	console.log('Tables were created..')
});

class ApiService {

    constructor() {
        console.log("constructing api service")
        console.log(sequelize.getDialect())
    }

}

export { ApiService, Student, Appointment};
