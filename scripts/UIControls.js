function minimizeWindow() {
    ipcRenderer.send("minimize-window");
}

function maximizeWindow() {
    ipcRenderer.send("maximize-window");
}

function closeWindow() {
    ipcRenderer.send("close-main-window");
}

let iconRotation = 0;
function updateList() {
    document.getElementById('update-icon').style.transform = `rotate(${iconRotation + 180}deg)`
    iconRotation = iconRotation + 180
    clearEvents();
    ipcRenderer.send('choose-save', `${saveFilesPath}/${activeFile}`);
}

function checkOff(e) {
    if (!e.parentNode.classList.contains('checked-off')) {
        e.parentNode.classList.add('checked-off')
        e.parentNode.style.color = RGBToHex(e.parentNode.style.color) + '44';
        e.children[0].style.opacity = 1;
    } else {
        e.parentNode.classList.remove('checked-off');
        e.parentNode.style.color = e.parentNode.style.color.replace(', 0.267', '');
        e.children[0].style.opacity = 0;
    }

    function RGBToHex(rgb) {
        // Choose correct separator
        let sep = rgb.indexOf(",") > -1 ? "," : " ";
        // Turn "rgb(r,g,b)" into [r,g,b]
        rgb = rgb.substr(4).split(")")[0].split(sep);

        let r = (+rgb[0]).toString(16),
            g = (+rgb[1]).toString(16),
            b = (+rgb[2]).toString(16);

        if (r.length == 1)
            r = "0" + r;
        if (g.length == 1)
            g = "0" + g;
        if (b.length == 1)
            b = "0" + b;

        return "#" + r + g + b;
    }
}

let colorCoated = false;

function colorCoat() {
    let checkbox = document.getElementById('color-checkbox');
    if (checkbox.checked) {
        colorCoated = true;
    } else {
        colorCoated = false;
    }
    clearEvents();
    findEvents(worldMode);
}

function wikiLink(e) {
    let item = e.innerHTML;
    item = item.replace(/\s/g, '+')
    console.log(item)
    shell.openExternal('https://remnantfromtheashes.wiki.fextralife.com/' + item)
}

function changeWorldMode(mode) {
    let campaignActive = document.getElementById('campaign-mode');
    let adventureActive = document.getElementById('adventure-mode');
    if (mode == 'adventure' && worldMode != 'adventure') {
        campaignActive.classList.remove('mode-select_active');
        adventureActive.classList.add('mode-select_active');
        worldMode = 'adventure';
        clearEvents();
        ipcRenderer.send('choose-save', `${saveFilesPath}/${activeFile}`);
    } else if (mode == 'campaign' && worldMode != 'campaign') {
        adventureActive.classList.remove('mode-select_active');
        campaignActive.classList.add('mode-select_active');
        worldMode = 'campaign';
        clearEvents();
        ipcRenderer.send('choose-save', `${saveFilesPath}/${activeFile}`);
    }
}

function clearEvents() {
    allEvents = [];
    let dataWrapper = document.getElementById('data-wrapper');
    let dataEvents = dataWrapper.children;
    while (dataEvents.length > 1) {
        dataWrapper.lastChild.remove();
    }
}

function createEventTile(payload) {
    if (allEvents.indexOf(payload.EventName) == -1 || payload.EventName == 'TraitBook') {
        allEvents.push(payload.EventName);

        let eventTilePrime = document.getElementById("placeholder");
        let newTile = eventTilePrime.cloneNode(true);
        newTile.id = payload.EventName;

        let tileLocation = document.createTextNode(payload.Zone + ' > ' + payload.SubLocation.split(/(?=[A-Z])/)
            .join(
                ' '));
        let tileEventType = document.createTextNode(payload.EventType);
        let tileEventName = document.createTextNode(payload.EventName.split(/(?=[A-Z])/).join(' '));
        newTile.children[1].appendChild(tileLocation);
        newTile.children[2].appendChild(tileEventType);
        newTile.children[3].appendChild(tileEventName);

        if (colorCoated) {
            switch (payload.EventType) {
                case 'Item Drop':
                    newTile.style.color = '#256ab9';
                    console.log('working')
                    break;
                case 'World Boss':
                    newTile.style.color = '#b60c00';
                    break;
                case 'Siege':
                    newTile.style.color = '#F0F01A';
                    break;
                case 'Miniboss':
                    newTile.style.color = '#ffa500';
                    break;
                case 'Point of Interest':
                    newTile.style.color = '#008000';
                    break;
                default:
                    newTile.style.color = '#ffffff';
                    break;
            }
        } else {
            newTile.style.color = '#ebebeb'
        }

        document.getElementById('data-wrapper').appendChild(newTile);
    }
}