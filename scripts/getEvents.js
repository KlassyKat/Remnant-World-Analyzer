let allEvents = [];
let worldMode = "adventure";
let {
    sublocations,
    mainLocations,
    eventNames
} = require('./scripts/remnant.format.js');

function findEvents() {
    let data;
    console.log(campaignText.join('\n'))
    if (worldMode == 'adventure') {
        data = adventureText;
    } else {
        data = campaignText;
    }

    let zones = {};
    zones["Earth"] = {};
    zones["Rhom"] = {};
    zones["Corsus"] = {};
    zones["Yaesha"] = {};
    zones["Resium"] = {};

    let currentMainLocation;
    if (worldMode == "adventure") {
        //May need reworked
        currentMainLocation = data[3].split('/')[1].split('_')[1];
    } else {
        currentMainLocation = "Fairview"
    }

    let currentSublocation = "";

    for (i in data) {
        let zone;
        let eventType;
        let eventName;
        let lastEventName;
        let isSmallDungeon = true;

        let textLine = data[i];

        //translate world/region names to readable text
        let textString = String(textLine);
        if (textString.includes("World_City")) {
            zone = "Earth"
        }
        if (textString.includes("World_Wasteland")) {
            zone = "Rhom"
        }
        if (textString.includes("World_Swamp")) {
            zone = "Corsus"
        }
        if (textString.includes("World_Jungle")) {
            zone = "Yaesha"
        }
        if (textString.includes("World_Snow")) {
            zone = "Resium"
        }

        lastEventname = eventName;

        //look for side dungeons
        if (textString.includes("SmallD")) {
            eventType = "Side Dungeon"
            eventName = textLine.split("/")[3].split("_")[2]
            currentSublocation = sublocations[eventName]
            if (currentSublocation == undefined) {
                currentSublocation = "Not added yet"
            }
            eventNames[eventName] ? eventName = eventNames[eventName] : eventName = eventName;
            inSmallDungeon = true
        }

        //look for overworld POI's
        if (textLine.search("OverworldPOI") != -1) {
            eventType = "Point of Interest"
            eventName = textLine.split("/")[3].split("_")[2]
            currentSublocation = currentMainLocation
            if (worldMode == "#adventure") {
                currentSublocation = ''
            }
            if (currentSublocation == undefined) {
                currentSublocation = "Not added yet"
            }
            eventNames[eventName] ? eventName = eventNames[eventName] : eventName = eventName;
            inSmallDungeon = true
        }

        //Look for quest bosses
        if (textLine.search("Quest_Boss") != -1) {
            eventType = "World Boss"
            eventName = textLine.split("/")[3].split("_")[2]
            currentSublocation = sublocations[eventName];
            eventNames[eventName] ? eventName = eventNames[eventName] : eventName = eventName;
            if (currentSublocation == undefined) {
                currentSublocation = "Not added yet"
            }
        }

        //look for sieges
        if (textLine.search("Siege") != -1) {
            eventType = "Siege"
            eventName = textLine.split("/")[3].split("_")[2]
            currentSublocation = sublocations[eventName]
            eventNames[eventName] ? eventName = eventNames[eventName] : eventName = eventName;
            if (currentSublocation == undefined) {
                currentSublocation = "Not added yet"
            }
        }

        //look for minibosses
        if (textLine.search("Mini") != -1) {
            eventType = "Miniboss"
            eventName = textLine.split("/")[3].split("_")[2]
            currentSublocation = sublocations[eventName];
            eventNames[eventName] ? eventName = eventNames[eventName] : eventName = eventName;
            if (currentSublocation == undefined) {
                currentSublocation = "Not added yet"
            }
        }

        //look for Item drops
        if (textLine.search("Quest_Event") != -1) {
            eventType = "Item Drop"
            eventName = textLine.split("/")[3].split("_")[2]

            // edge case for out of order items
            //! Uhh do i need this?
            // if (textLine.split("/")[1].split("_")[1] != data[i - 1].split("/")[1].split("_")[1]) {
            //     currentSublocation = '';
            // }
        }

        if (textLine.search("Overworld_Zone") != -1) {
            currentMainLocation = textLine.split("/")[3].split("_")[1] + " " + textLine.split("/")[3].split("_")[
                2] + " " + textLine.split("/")[3].split("_")[3]
            currentMainLocation = mainLocations[currentMainLocation]
        }

        //Renames the bosses
        if (eventName != lastEventname) {
            // Replacements
            eventNames[eventName] ? eventName = eventNames[eventName] : eventName = eventName;
            //This populates the table for data to be pulled
            if (zone != undefined && eventType != undefined && eventName != undefined) {
                let event = {
                    MainLocation: currentMainLocation,
                    SubLocation: currentSublocation,
                    Zone: zone,
                    EventType: eventType,
                    EventName: eventName
                }
                createEventTile(event);
            }
        }
    }
}