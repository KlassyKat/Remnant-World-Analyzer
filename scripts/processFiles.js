let {
    ipcRenderer,
    shell
} = require('electron');
let fs = require('fs');

ipcRenderer.send('get-file-path');

let saveFilesPath;
let saveFiles = [];
let activeFile;
ipcRenderer.on('file-path', (e, payload) => {
    saveFilesPath = payload[0];
    saveFiles = payload[1];
    for (file of saveFiles) {
        if (String(file).includes('.sav') && !String(file).includes('profile')) {
            activeFile = file;
        }
    }
    getFiles();
});

let adventureText;
let campaignText;
let profileText;

function getFiles() {
    getAdventureText();
}

function getAdventureText() {
    fs.readFile(`${saveFilesPath}/${activeFile}`, 'utf-8', (err, data) => {
        adventureText = data;
    })
}