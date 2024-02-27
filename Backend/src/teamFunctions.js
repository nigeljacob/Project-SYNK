import { Team } from "./classes"
import {auth} from "./firebase"
import { read_OneValue_from_Database, read_from_Database_onChange, writeToDatabase } from "./firebaseCRUD"

export const createTeam = (teamCode,
    teamName,
    teamProfile,
    teamDescription,
    projectLength,
    projectType,
    gitConfig) => {

    let dateTime = getTimeDate()

    const newTeam = Team(teamCode,
        teamName,
        teamProfile,
        teamDescription,
        {"UID": auth.currentUser.uid, "name": auth.currentUser.displayName, "email": auth.currentUser.email},
        [{"UID": auth.currentUser.uid, "name": auth.currentUser.displayName, "email": auth.currentUser.email}],
        projectLength,
        projectType,
        gitConfig,
        [""],
        "Active",
        [""],
        dateTime[0]
        )

    return writeToDatabase("Teams/" + auth.currentUser.uid + "/" + teamCode, newTeam).then(() => {

        const onDataReceived = (teamCodes) => {
            if(teamCodes == null) {
                writeToDatabase("TeamCodes/" + teamCode, {"teamCode": teamCode, "teamLeader": auth.currentUser.uid})
            } 
        }
        
        read_OneValue_from_Database("TeamCodes/" + teamCode, onDataReceived);

    }).catch(() => {
        alert("unable to create Team");
    })
}

export const fetchTeams = (onDataReceived) => {

    read_from_Database_onChange("Teams/" + auth.currentUser.uid, onDataReceived)
}

export const getTeamCodes = () => {
    return read_OneValue_from_Database("TeamCodes")
}

const getTimeDate = () => {
    let newDate = new Date();

    let month = newDate.getMonth() + 1
  
    return [
      newDate.getDate() + "/" + month + "/" + newDate.getFullYear(),
      newDate.getHours() + ":" + newDate.getMinutes(),
    ];
  };