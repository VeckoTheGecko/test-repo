import { Button, TextField } from '@material-ui/core';
import Stack from '@mui/material/Stack';
import * as React from 'react';
import './usage.scss'
import { ipcRenderer } from 'electron';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import { useEffect, useState } from 'react';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { DataGrid } from '@mui/x-data-grid';
import { useAppContext } from "@/services/queue.service";
import { getApptsForHistoryView, removeAll } from '@/services/models/appointment_sequelized';
import { Appointment, Student } from '@/services/api_service';
import { getFormattedAppts } from '@/services/csv-export-script';

const columns = [
    { flex: 1, field: 'id', headerName: 'ID', hide: true},
    { flex: 1, field: 'name', headerName: ' Name' },
    { flex: 1, field: 'student_num', headerName: 'Number' },
    { flex: 1, field: 'unit_code', headerName: 'Unit Code' },
    { flex: 1, field: 'team', headerName: 'Team' },
    { flex: 1, field: 'enquiry_type', headerName: 'Enquiry' },
    { flex: 1, field: 'session_start', headerName: 'Start' },
    { flex: 1, field: 'session_len', headerName: 'Length' },
    { flex: 1, field: 'waittime', headerName: 'Wait Time' },
    { flex: 1, field: 'notes', headerName: 'Notes' }
];


const Usage = (): JSX.Element => {
    const { app_state, exportData } = useAppContext();
    const [ history, setHistory ] = useState([]);

    const handleClick = () => {
        // Resolves to a Promise<Object>
        ipcRenderer.invoke('show-save').then(file => {
            // Stating whether dialog operation was cancelled or not.
            console.log(file.canceled);
            if (!file.canceled) {

                console.log('Path:', file.filePath.toString());

                exportData(file.filePath.toString(), from, to);
            }
        }).catch(err => {
            console.log(err)
        });
    }
	const deleteDbClick = () => {
		// Resolves to a Promise<Object>
        ipcRenderer.invoke('show-delete').then(confirm => {
            // Stating whether dialog operation was cancelled or not.
            console.log(confirm);
            if (confirm) {
				removeAll(Appointment);
				console.log("Database removed!");
				fetchHistory();
            }
        }).catch(err => {
            console.log(err);
        });

	}

    const d1 = new Date();
    d1.setDate(d1.getDate() + 1);
    d1.setHours(0, 0, 0, 0);

    const [to, setTo] = useState<Date | null>(
        d1
    );

    const d2 = new Date();
    d2.setMonth(d2.getMonth() - 1);
    d2.setHours(0, 0, 0, 0);

    const [from, setFrom] = useState<Date | null>(
        d2
    );
    const [pageSize, setPageSize] = useState<number>(10);

    const fetchHistory = async () => {
        const query_to = new Date(to?.valueOf())
        query_to.setDate(query_to.getDate() + 1)
        const apptData = await getApptsForHistoryView(Appointment, Student, from, query_to);
        setHistory(getFormattedAppts(apptData).map((entries, index) => {return {...entries, id: index}}));

        console.log(apptData)
    }

    useEffect(() => {
        console.log("component mounted")
        fetchHistory()
        return () => {
            console.log("component unmounted")
        }
    }, [])

    useEffect(() => {
        fetchHistory()
    }, [to, from])

    return (
        <div className="usage-page">
            <div className="export-form">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Stack spacing={3} direction="row">
                        <DesktopDatePicker
                            label="From"
                            inputFormat="dd/MM/yyyy"
                            value={from}
                            onChange={setFrom}
                            renderInput={(params) => <TextField variant='outlined' {...params} />}
                        />
                        <DesktopDatePicker
                            label="To"
                            inputFormat="dd/MM/yyyy"
                            value={to}
                            onChange={setTo}
                            renderInput={(params) => <TextField variant='outlined' {...params} />}
                        />
						<Button variant='outlined' style={{"marginLeft": "auto"}} onClick={deleteDbClick}>Delete DB</Button>
                        <Button variant='outlined' style={{"marginLeft": "auto"}} onClick={handleClick}>Export Data</Button>
                    </Stack>
                </LocalizationProvider>
                <DataGrid
                    rows={history}
                    columns={columns}
                    pageSize={pageSize}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    rowsPerPageOptions={[5, 10, 15]}
                    checkboxSelection
                    disableSelectionOnClick
                />
            </div>
        </div>
    )
};

export default {
    routeProps: {
        path: '/usage',
        component: Usage
    },
    name: 'Usage',
}


export const testObjects = [
    {
        dataValues: {
            "id": 1,
            "unit_code": "CITS3200",
            "team": "STUDYSmarter",
            "enquiry_type": "AAAAAAAAAAAA",
            "notes": null,
            "session_start": "2021-09-19T06:10:16.648Z",
            "session_len": 11,
            "waittime": 5,
            "createdAt": "2021-09-19T06:10:16.655Z",
            "updatedAt": "2021-09-19T06:10:16.655Z",
            "student": {
                dataValues: {
                    "id": 1,
                    "name": "Jordan",
                    "student_num": 21715741,
                    "createdAt": "2021-09-19T06:10:16.689Z",
                    "updatedAt": "2021-09-19T06:10:16.689Z",
                    "appointmentId": 1
                }
            }
        }
    },
    {
        dataValues: {
            "id": 2,
            "unit_code": "CITS3200",
            "team": "STUDYSmarter",
            "enquiry_type": "AAAAAAA",
            "notes": null,
            "session_start": "2021-09-19T06:19:45.179Z",
            "session_len": 11,
            "waittime": 5,
            "createdAt": "2021-09-19T06:19:45.185Z",
            "updatedAt": "2021-09-19T06:19:45.185Z",
            "student": {
                dataValues: {
                    "id": 2,
                    "name": "Jorgen",
                    "student_num": 21715741,
                    "createdAt": "2021-09-19T06:19:45.216Z",
                    "updatedAt": "2021-09-19T06:19:45.216Z",
                    "appointmentId": 2
                }
            }
        }
    }
]
