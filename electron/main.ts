import { app, BrowserWindow } from 'electron';
import isDev from 'electron-is-dev';
import Store from 'electron-store';
import { ipcMain, dialog } from 'electron';
import path from 'path';

const schema = {
  defaults: {
    app_state: {
      selected_id: undefined,
      queues: {
        studysmarter: [],
        librarian: [],
      }
    }
  },
}

const store = new Store(schema);
let win: BrowserWindow | null;

const createWindow = (): void => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      //enableRemoteModule: true,
      // preload: __dirname + '/preload.js'
    }
  });

  win.loadURL(isDev ? 'http://localhost:9000' : `file://${app.getAppPath()}/index.html`);

  win.webContents.openDevTools();

  ipcMain.on('QUEUE_UPDATED', (event, data) => {
    store.set('app_state', data);
  });

  ipcMain.handle('show-save', async (event, someArgument) => {
    const result = await dialog.showSaveDialog({
      title: 'Save As',
      defaultPath: path.join(app.getPath("downloads"), '/database.csv'),
      filters: [
          {
              name: 'csv',
              extensions: ['.csv']
          },
      ],
      properties: []
    })
    console.log(result)
    return result
  })

  ipcMain.handle('show-delete', async (event, someArgument) => {
	let options  = {
		   type: "warning",
		   title: "You are about to delete the database",
		   buttons: ["Delete Database", "Cancel"],
		   message: "Do you really want to delete the whole database?"
	}
    const result = await dialog.showMessageBox(options)
    console.log("result: ",result)
    return result
  })

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('INITIALIZE_QUEUE', store.get('app_state'));
    // win?.webContents.send('INITIALIZE_QUEUE', schema.defaults['app_state'])
  });

  win.on('closed', () => {
    win = null
  });
}

app.on('ready', createWindow);
app.allowRendererProcessReuse = true;
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});
app.on('activate', () => {
  if (win === null) {
    //createWindow()
  }
});
