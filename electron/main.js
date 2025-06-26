const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let flaskProcess;

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    icon: path.join(__dirname, 'chatbot.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadURL('http://localhost:5000');
}

app.whenReady().then(() => {
  const pythonPath = 'python'; // or use 'python3' if needed
  const scriptPath = path.join(__dirname, 'app.py');

  // ✅ Start Flask using spawn
  flaskProcess = spawn(pythonPath, [scriptPath], { shell: true });

  flaskProcess.stdout.on('data', data => {
    console.log(`Flask stdout: ${data}`);
  });

  flaskProcess.stderr.on('data', data => {
    console.error(`Flask stderr: ${data}`);
  });

  flaskProcess.on('close', code => {
    console.log(`Flask exited with code ${code}`);
  });

  // Wait a bit before loading the window
  setTimeout(() => {
    createWindow();
  }, 1500);
});

app.on('window-all-closed', () => {
  if (flaskProcess) flaskProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});
