import React from "react";
import { ipcRenderer } from "electron";


import { Student, Appointment} from "./api_service";
import {
	AppointmentModel,
	getAllAppts,
	addAppointment,
	removeAll,
	getApptsForHistoryView,
} from "./models/appointment_sequelized";

import {
	exportStudentsCSV,
	getFormattedAppts,
	exportDataWithPath, } from "./csv-export-script.ts";


// Importing helper function
import {calcWaitTimeStrings, locate_selected_appointment} from "@/shared/utils"

const [
  ADD_QUEUE_ITEM,
  SELECT_APPOINTMENT,
  REMOVE_QUEUE_ITEM,
  UPDATE_QUEUE_ITEM_STATUS,
  UPDATE_QUEUE_ITEM_WAIT_TIME,
  EXPORT_DATA,
] = [
  "ADD_QUEUE_ITEM",
  "SELECT_APPOINTMENT",
  "REMOVE_QUEUE_ITEM",
  "UPDATE_QUEUE_ITEM_STATUS",
  "UPDATE_QUEUE_ITEM_WAIT_TIME",
  "EXPORT_DATA",
];

// Add actions that you want to perform on the global context here
// Not sure if it's best to alter the state in the re
const appReducer = (state: ApplicationState, action: any) => {
  // A function that takes in the current application state, and modifies it based on an action
  // which provides the type of action as well as the payload (variables used to customize the action)

  switch (action.type) {
    case ADD_QUEUE_ITEM: {
      // Stores reference to the target queue.
      const payload: FormOutput = action.payload;
      const queue =
        payload.team == "STUDYSmarter"
          ? state.queues.studysmarter
          : state.queues.librarian;

      const time_added = new Date().getTime(); // ie. the time the appointment was added will act as unique_id too
      // Extracting the appointment data from the form (stored in the payload)
      const inputObj: AppointmentState = {
        unique_id: time_added,
        capture_data: {
          team: payload.team,
          enquiry_type: payload.enquiry_type,
          unit_code: payload.unit_code,
          notes: payload.notes,
          student: {
            name: payload.name,
            student_num: payload.student_num,
          },
        },
        time_data: {
          added_to_queue: time_added,
        },
        display_data: {
          status: "in-queue",
          text: 'IN QUEUE'
        },
      };

      // This checks that a student with the same student number doesn't already exist in the queue.
      // Should we do this or just let them deal with their own human errors i.e., button the remove student from queue?
      // If we are going to allow more than one queue item with the same student number then we need some other way of
      // uniquely identifying the queue item - like an AppointmentID generator, which can be passed to the reducers
      // to help the identify which element of the queue needs to be changed.
      const index = queue.findIndex((element: AppointmentState) => {
        return element.capture_data.student.student_num == payload.student_num;
      });
      if (index == -1) {
        queue.push(inputObj);
        // Sends the updated state to the main process to update the electron-store
        ipcRenderer.send("QUEUE_UPDATED", state);
      }
      return {...state, queue};
    }

    case SELECT_APPOINTMENT: {
      // OLD CODE
      // state.selected_id = action.payload;
      // ipcRenderer.send("QUEUE_UPDATED", state);
      // return state

      // NEW CODE
      const new_state = { ...state, selected_id: action.payload == state.selected_id ? undefined : action.payload };
      ipcRenderer.send("QUEUE_UPDATED", new_state);
      return {...new_state};
    }

    case REMOVE_QUEUE_ITEM: {
      // TODO: Remove the item from the appropriate queue, send update to main process to update the electron-store.
      // BEFORE TODO: Add ability to select queue item and dispatch as payload to this reducer.

      const appointment_location = locate_selected_appointment(state.queues, state.selected_id)

      if (appointment_location){
        const new_state = state;
        const key = appointment_location.queue_key as keyof QueuesState;
        const target_index = appointment_location.index

        //adds appointment to db
        const appointment: AppointmentState = state.queues[key][target_index];
        let temp = appointment.capture_data;

        //wait time, in minutes, eg 0.25 = quarter of a minute - 15 seconds
        temp.waittime = (appointment.time_data.marked_as_in_session - appointment.time_data.added_to_queue) / 1000 / 60;
        console.log('wait time:',temp.waittime);

        //session length, in minutes, eg 0.25 = quarter of a minute - 15 seconds
        temp.session_len = (new Date().getTime() - appointment.time_data.marked_as_in_session) / 1000 / 60;
        console.log('Session len:',temp.session_len);

        temp.session_start = new Date(appointment.time_data.marked_as_in_session);
        console.log('Session start:',temp.session_start);

        addAppointment(Appointment, Student, temp);

        new_state.queues[key].splice(target_index, 1);
        ipcRenderer.send('QUEUE_UPDATED', state)
        return {...new_state}
      }else{
        return state
      }
    }

    case UPDATE_QUEUE_ITEM_STATUS: {
      const appointment_location = locate_selected_appointment(state.queues, state.selected_id)
      console.log(action.payload)

      if (appointment_location){
        const new_state = state;
        const key = appointment_location.queue_key as keyof QueuesState;
        const target_index = appointment_location.index
        const appointment = new_state.queues[key][target_index];

        switch(action.payload) {
          case 'in-queue' : {
            appointment.display_data = {...appointment.display_data, status: action.payload, text: 'IN QUEUE'};
            appointment.time_data = {...appointment.time_data, marked_as_in_session: undefined};// Reseting so they weren't ever "in session"
            break;
          }
          case 'in-session' : {
            const time = new Date().getTime();
            appointment.time_data.marked_as_in_session = time;
            const target = time + 15 * 60 * 1000;
            appointment.display_data = {...appointment.display_data, status: action.payload, text: '15:00', target};
            break;
          }
          case 'time-up' : {
            appointment.display_data = {...appointment.display_data, status: action.payload, text: 'TIME UP'}
            break;
          }
        }
        ipcRenderer.send('QUEUE_UPDATED', state)
        return {...new_state}
      }else{
        return state
      }
    }
	case EXPORT_DATA: {
      // TODO

      //exports db as csv to manually check if student was added
      let apptData;
      const appointmentData = async (apptData) => {
        apptData = await getApptsForHistoryView(Appointment,Student, action.earliest, action.latest);
        console.log('Earliest: ', action.earliest);
        console.log('Latest: ', action.latest);

        console.log('APPOINTMENT DATA', apptData);

        const apptList = getFormattedAppts(apptData);
        console.log('appt list: ', apptList);

        const exp = exportDataWithPath(action.path, apptList);
      }
      appointmentData(apptData);
      
      // ipcRenderer.send('DATA EXPORTED', state)
      return state;
    }

    case UPDATE_QUEUE_ITEM_WAIT_TIME: {
      // Find location of selected appointment
      const appointment_location = locate_selected_appointment(state.queues, state.selected_id)
      console.log(appointment_location)

      if (appointment_location){
        const new_state = state;
        const key = appointment_location.queue_key as keyof QueuesState;
        const target_index = appointment_location.index
        const appointment = new_state.queues[key][target_index];

        const target = appointment.display_data.target + (action.payload * 60 * 1000);
        const current = new Date().getTime();
        console.log("old target", new Date(appointment.display_data.target));
        console.log("new target", new Date(target))

        if(appointment.display_data.status == 'in-session') {
          if(target <= current) {
            appointment.display_data = {text: 'TIME UP', status: 'time-up', target: current}
          } else if(target >= current + 60*60*1000) {
            const { mins, secs } = calcWaitTimeStrings(current + 60*60*1000);
            appointment.display_data = {status: "in-session", text: `${mins}:${secs}`, target: current + 60*60*1000}
          } else {
            const { mins, secs } = calcWaitTimeStrings(target);
            appointment.display_data = {status: "in-session", text: `${mins}:${secs}`, target: target}
          }
        } else if(appointment.display_data.status == 'time-up') {
          if(action.payload == 1) {

            const { mins, secs } = calcWaitTimeStrings(current + 60*1000);
            appointment.display_data = {status: "in-session", text: `${mins}:${secs}`, target: current + 60*1000}
          }
        }

        console.log(action.payload)
        console.log(new_state)
        ipcRenderer.send('QUEUE_UPDATED', state)
        return {...new_state}
      }else{
        return state
      }
    }

    default:
      throw new Error(`Action is not supported: ${action.type}`);
  }
};

const AppContext = React.createContext([]);
// Create a custom queueProvider for the context
export const AppProvider = (props: any): JSX.Element => {
  // Initialises the app based on the initial state passed through props
  const [state, dispatch] = React.useReducer(appReducer, props.initial_state);
  const value = React.useMemo(() => ({ state, dispatch }), [state]);

  return <AppContext.Provider value={value} {...props} />;
};

// Custom hook usequeueContext
export const useAppContext = () => {
  const context = React.useContext(AppContext);

  if (!context) {
    throw new Error("useQueueContext must be used inside a QueueProvider");
  }

  const { state, dispatch } = context as any;

  const addQueueItem = (payload: FormOutput) => {
    dispatch({ type: ADD_QUEUE_ITEM, payload });
  };

  const selectAppointment = (payload: number) => {
    dispatch({ type: SELECT_APPOINTMENT, payload });
  };

  const removeQueueItem = () => {
    dispatch({ type: REMOVE_QUEUE_ITEM });
  };
  //Export
  const exportData = (path, earliest, latest) => {
    dispatch({ type: EXPORT_DATA, path, earliest, latest});
  };

  const updateQueueItemStatus = (payload: Status) => {
    dispatch({ type: UPDATE_QUEUE_ITEM_STATUS, payload });
  };

  const updateQueueItemWaitTime = (payload: number) => {
    dispatch({ type: UPDATE_QUEUE_ITEM_WAIT_TIME, payload });
  };

  const app_state = state;

  return {
    app_state,
    selectAppointment,
    addQueueItem,
    removeQueueItem,
    updateQueueItemStatus,
    updateQueueItemWaitTime,
    exportData,
  };
};
