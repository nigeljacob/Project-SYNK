import { Team } from "./classes";
import { auth } from "./firebase";
import {
  read_OneValue_from_Database,
  read_from_Database_onChange,
  updateDatabase,
  writeToDatabase,
  readOnceFromDatabase
} from "./firebaseCRUD";

export const createTeam = (
  teamCode,
  teamName,
  teamProfile,
  teamDescription,
  projectLength,
  projectType,
  gitConfig
) => {
  let dateTime = getTimeDate();

  const newTeam = Team(
    teamCode,
    teamName,
    teamProfile,
    teamDescription,
    {
      UID: auth.currentUser.uid,
      name: auth.currentUser.displayName,
      email: auth.currentUser.email,
    },
    [
      {
        UID: auth.currentUser.uid,
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
      },
    ],
    projectLength,
    projectType,
    gitConfig,
    [""],
    "Active",
    [""],
    dateTime[0]
  );

  return writeToDatabase(
    "Teams/" + auth.currentUser.uid + "/" + teamCode,
    newTeam
  )
    .then(() => {
      const onDataReceived = (teamCodes) => {
        if (teamCodes == null) {
          writeToDatabase("TeamCodes/" + teamCode, {
            teamCode: teamCode,
            teamLeader: auth.currentUser.uid,
          });
        }
      };

      readOnceFromDatabase("TeamCodes/" + teamCode, onDataReceived);
    })
    .catch(() => {
      alert("unable to create Team");
    });
};

export const fetchTeams = (onDataReceived) => {
  read_from_Database_onChange("Teams/" + auth.currentUser.uid, onDataReceived);
};

export const fetchPendingInvites = (onDataReceived, teamCode) => {
  read_OneValue_from_Database(
    "Teams/" + auth.currentUser.uid + "/" + teamCode + "/teamPendingInvites",
    onDataReceived
  );
};

export const joinTeam = (teamCode, onRequestSent) => {
  const onDataReceived = (data) => {
    if (data === null) {
      alert("Team does not exist");
    } else {
        
      const onListReceived = (dataList) => {
        if (dataList.includes("")) {
          dataList.splice(0);
        }

        dataList.push({
          UID: auth.currentUser.uid,
          email: auth.currentUser.email,
          name: auth.currentUser.displayName,
        });

        updateDatabase("Teams/" + data.teamLeader + "/" + teamCode, {"teamPendingInvites": dataList}).catch(() => {
            onRequestSent(false)
            return
        })


        const onTeamReceived = (team) => {
          team.teamPendingInvites = dataList;

          writeToDatabase(
            "Teams/" + auth.currentUser.uid + "/" + team.teamCode,
            team
          ).then(() => {
            onRequestSent(true)
          });
        };

        readOnceFromDatabase(
          "Teams/" + data.teamLeader + "/" + teamCode,
          onTeamReceived
        );

      };

      readOnceFromDatabase(
        "Teams/" + data.teamLeader + "/" + teamCode + "/teamPendingInvites",
        onListReceived
      );
    }
  };
  readOnceFromDatabase("TeamCodes/" + teamCode, onDataReceived);
};

export const getTeamCodes = () => {
  return read_OneValue_from_Database("TeamCodes");
};

const getTimeDate = () => {
  let newDate = new Date();

  let month = newDate.getMonth() + 1;

  return [
    newDate.getDate() + "/" + month + "/" + newDate.getFullYear(),
    newDate.getHours() + ":" + newDate.getMinutes(),
  ];
};
