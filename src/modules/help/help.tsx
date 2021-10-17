import React from "react";
import "./help.scss";
import dashboard from "./images/dashboard-numbered.png";
import form from "./images/form.png";

const HelpContainer: React.FC = (): JSX.Element => {
  return (
    <div className="help-container">
      <nav className="nav-container">
        <p>Table of Contents</p>
        <hr />
        <li>
          <a href="#dashboard">Dashboard</a>
        </li>
        <li>
          <a href="#usage">Usage</a>
        </li>
        <li>
          <a href="#settings">Settings</a>
        </li>
      </nav>

      <div className="contents-container">
        <DashboardContent></DashboardContent>
        <UsageContent></UsageContent>
        <SettingsContent></SettingsContent>
      </div>
    </div>
  );
};

const DashboardContent: React.FC = (): JSX.Element => {
  return (
    <div>
      {/* Dashboard content */}
      <h1 id="dashboard">Dashboard</h1>

      <p>
        {" "}
        The Dashboard page is where the queueing system mechanism will be in
        active. This is where users will spent the most time on this
        application. The following sections below are provided in the hopes to
        aide in the functionalities and general view of the Dashboard page.
      </p>

      <h2>General view of the page:</h2>

      {/* Will change the screenshot once the styling has been finalised, this is a draft */}
      <img
        src={dashboard}
        alt="Diagram of dashboard with number annotations"
        className="image"
      />

      <ol className="dashnum-li">
        <li>
          <span>Queue</span>
        </li>
        <li>
          <span>
            Appointment – If selected, the border will change colour to red.
          </span>
        </li>
        <li>
          <span>Appointment Status</span>
        </li>
        <li>
          <span>Buttons – Manipulates the queues.</span>
        </li>
        <li>
          <span>Estimated wait times</span>
        </li>
      </ol>

      <h2>Functionalities:</h2>

      <h3>1. Queue</h3>
      <p>
        There are two queues displayed on the page. Both queues will contain a
        number of <b>Appointments</b> that holds information for the user to
        distinguish. Information displayed in the appointment are the name of
        the student, their student number, unit code, and its status. The{" "}
        <b>Appointment Status</b> has three states: IN QUEUE, TIME UP, and
        displaying the time remaining once it is in session.
      </p>
      <p>
        Also, at the bottom of each queue is an <b>Estimated Wait time</b>, to
        help the user give out an estimate for students if needed be.
      </p>

      <h3>2. Buttons</h3>
      <p>
        <b>NOTE:</b> Majority of these buttons will only work once an
        appointment has been selected.
      </p>
      <ul className="dash-ul">
        <li>
          <p>
            <b>Session</b> – Changes appointment status in a green colour with a
            timer displayed.
          </p>
        </li>
        <li>
          <p>
            <b>Queue</b> – Changes appointment status in a blue colour with
            words 'IN QUEUE'.
          </p>
        </li>
        <li>
          <p>
            <b>+1 or -1</b> – Adds or subtracts one minute of the timer for the
            appointment; if finished appointment status change to an orange
            colour with words 'TIME UP'.
          </p>
        </li>
        <li>
          <p>
            <b>Add Student</b> – Pops out a form to fill in the information
            needed from the student, and once completed it will be added in the
            respective queue (STUDYSmarter or Librarian).
          </p>
        </li>
        <li>
          <p>
            <b>Complete Appointment</b> – The appointment is removed from the
            queue as its session has finished, and adds its information in the
            database.
          </p>
        </li>
      </ul>

      <h3>3. Form</h3>
      <p>
        The form will popup once the <b>Add Student</b> button is clicked on.
        This is where the user can add Student details and their respective
        enquiries. After submission, an <b>Appointment</b> will be added in the
        queue with the respective details.
      </p>
      <img
        src={form}
        alt="Form for adding student details and to the queue."
        className="imageForm"
      />

      <ul className="dash-ul">
        <li>
          <p>
            <b>Name</b> – Student's name.
          </p>
        </li>
        <li>
          <p>
            <b>Student Number</b> – Must be 8 digits long.
          </p>
        </li>
        <li>
          <p>
            <b>Unit Code</b> – Must contain 4 letters, followed by 4 numbers.
            Example: cits3200.
          </p>
        </li>
        <li>
          <p>
            <b>Team</b> – Has 2 options by default, STUDYSmarter or Librarian.
            This can be changed in the Settings page.
          </p>
        </li>
        <li>
          <p>
            <b>Enquiry</b> – Couple of options but can be changed in the
            Settings page.
          </p>
        </li>
        <li>
          <p>
            <b>Notes</b> – Additional enquiries that are not specified in the
            Enquiry option. Maximum of 150 characters including space.
          </p>
        </li>
      </ul>

      {/* Demo short vid may be added in after styling are finalised */}

      <br />
    </div>
  );
};

const UsageContent: React.FC = (): JSX.Element => {
  return (
    <div>
      {/* Usage content */}
      <h1 id="usage">Usage</h1>

      <p>
        The usage page is where you are able to view the history of the service,
        and view the data stored on the machine.
      </p>

      <h2>General View of the page:</h2>
      <p>Insert image</p>

      <h2>Functionalities:</h2>

      <h3>1. Date Range Picker</h3>
      <p>Here you specify the range for which you would like to view data</p>
      <p>
        The date range is such that if you view data from 01/01/20 to 03/01/20,
        it will display data from any sessions that started between 12am
        01/01/20, and 11:59pm on 02/01/20.
      </p>
      <p>
        If you want to view sessions occurring on the 03/01/20, you need to have
        04/01/20 as the end date.
      </p>

      <h3>2. Data Columns</h3>
      <p>
        These columns display the data captured by the system. Clicking on the
        names of the columns allows you to sort the columns in ascending or
        descending order, as well as specify filters for the columns. Filtering
        by student number is useful to see the service's usage by a particular
        student.
      </p>
      <ul className="dash-ul">
        <li>
          <p>
            <b>Name</b> – The name of the student using the service.
          </p>
        </li>
        <li>
          <p>
            <b>Student Number</b> – The student number of the student using the
            service.
          </p>
        </li>
        <li>
          <p>
            <b>Unit Code</b> – The unit code relevant to the help session.
          </p>
        </li>
        <li>
          <p>
            <b>Team</b> – The team that the student is seeing.
          </p>
        </li>
        <li>
          <p>
            <b>Enquiry</b> - What category the enquiry type falls into.
          </p>
        </li>
        <li>
          <p>
            <b>Start</b> <b>Team</b> – The date and time at which the session
            started.
          </p>
        </li>
        <li>
          <p>
            <b>Length</b> <b>Team</b> – The length of the session (in minutes).
          </p>
        </li>
        <li>
          <p>
            <b>Wait Time</b> <b>Team</b> – The time (in minutes) between the
            student being added to the system, and being marked as "in session".
          </p>
        </li>
        <li>
          <p>
            <b>Notes</b> <b>Team</b> – Additional notes regarding the
            appointment.
          </p>
        </li>
      </ul>

      <h3>3. Data Navigation</h3>
      <p>
        By clicking the buttons are the bottom of the page, you can view
        multiple pages of data.
      </p>

      <br />
    </div>
  );
};

const SettingsContent: React.FC = (): JSX.Element => {
  return (
    <div>
      {/* Settings content */}
      <h1 id="settings">Settings</h1>

      <h2>General view of the page:</h2>

      <p>
        (Insert screenshot of the settings page with numbers for parts; ie like
        a diagram)
      </p>
      <p>Each numbers will be annotated</p>

      <h2>Functionalities:</h2>

      <p>- Changing form inputs</p>
      <p>
        - Visiualisation on the effects (could be screenshots and/or quick video
        demo)
      </p>
    </div>
  );
};

export default {
  routeProps: {
    path: "/help",
    component: HelpContainer,
  },
  name: "Help",
};
