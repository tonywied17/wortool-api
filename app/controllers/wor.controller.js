const db = require("../models");
const Recap = db.recap;

exports.findAll = (req, res) => {
    Recap.findAll()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {

            res.status(500).send({
                message: err.message || "Some error occurred while retrieving recaps.",
            });
        });
};

exports.storeRecap = (req, res) => {
    let jsonData = req.body;
    console.log(jsonData);

    /* 
    
    TODO: Store as EPOCH time and convert to locale string on the front end

    const startTime = new Date(jsonData.MatchInformation.StartTime * 1000).toLocaleString('en-US', {
        timeZone: 'America/New_York',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });
      
      const endTime = new Date(jsonData.MatchInformation.EndTime * 1000).toLocaleString('en-US', {
        timeZone: 'America/New_York',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });
      */

    const getWinnerString = (winner) => {
        switch (winner) {
            case 0:
                return "DRAW";
            case 1:
                return "USA";
            case 2:
                return "CSA";
            default:
                return "Unknown Result";
        }
    };

    const recapData = {
        serverName: jsonData.ServerInformation.ServerName,
        players: jsonData.Participants.Players,
        map: jsonData.MatchInformation.Map,
        gameMode: jsonData.MatchInformation.GameMode,
        area: jsonData.MatchInformation.Area,
        winner: getWinnerString(jsonData.MatchInformation.Winner),
        duration: jsonData.MatchInformation.Duration,
        startTime: jsonData.MatchInformation.StartTime,
        endTime: jsonData.MatchInformation.EndTime,
        usaInFormation: jsonData.Casualties.USA.InFormation,
        usaSkirmishing: jsonData.Casualties.USA.Skirmishing,
        usaOutOfLine: jsonData.Casualties.USA.OutOfLine,
        csaInFormation: jsonData.Casualties.CSA.InFormation,
        csaSkirmishing: jsonData.Casualties.CSA.Skirmishing,
        csaOutOfLine: jsonData.Casualties.CSA.OutOfLine,
    };

    Recap.create(recapData)
        .then((recap) => {
            console.log("Recap created:", recap);
        })
        .catch((error) => {
            console.error("Error creating recap:", error);
        });

    res.json(recapData);
};



