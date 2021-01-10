let {
    ipcRenderer,
    shell
} = require('electron');

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
    ipcRenderer.send('choose-save', `${saveFilesPath}/${activeFile}`);
}
ipcRenderer.on('file-update', (e, payload) => {
    setData(payload);
});

function setData(data) {
    let text = data.replace(/[^a-zA-z0-9/.]/g, '');
    console.log(text);
    adventureText = data.split('\n');
    campaignText = data.split("/Game/Campaign_Main/Quest_Campaign_Ward13.Quest_Campaign_Ward13")[0];
    campaignText = campaignText.split("/Game/Campaign_Main/Quest_Campaign_City.Quest_Campaign_City")[1].replace(/Game/g,'\n');
    campaignText = campaignText.split('\n');

    let tempList = [];
    for(event of adventureText) {
        if(String(event).includes('Adventure')) {
            tempList.push(event.replace(/[^a-zA-z0-9/.]/g, ''));
        }
    }
    adventureText = tempList[1];
    adventureText = adventureText.replace(/Game/g, '\n');
    adventureText = adventureText.split('\n');

    findEvents();
}
