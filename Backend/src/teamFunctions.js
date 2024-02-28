import { Team } from "./classes";
import { auth } from "./firebase";
import {
  readOnceFromDatabase,
  read_OneValue_from_Database,
  read_from_Database_onChange,
  updateDatabase,
  writeToDatabase,
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
        status: "Active"
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
      sendNotification("Team doesn't exist", "The code you entered seems to be invalid", "danger", auth.currentUser.uid)
    } else {
      const onListReceived = (dataList) => {
        if (dataList.includes("")) {
          dataList.splice(0);
        }

        if(dataList.some((item) => item.UID === auth.currentUser.uid)){
          onRequestSent("alreadySent");
          return
        }

        dataList.push({
          UID: auth.currentUser.uid,
          email: auth.currentUser.email,
          name: auth.currentUser.displayName,
        });

        const onTeamReceived = (team) => {

          if(team.teamMemberList.some((item) => item.UID === auth.currentUser.uid)){
            onRequestSent("alreadyJoined");
            return
          }

          team.teamPendingInvites = dataList;

          updateDatabase("Teams/" + data.teamLeader + "/" + teamCode, {
            teamPendingInvites: dataList,
          }).catch(() => {
            onRequestSent("error");
            return;
          });

          writeToDatabase(
            "Teams/" + auth.currentUser.uid + "/" + team.teamCode,
            team
          ).then(() => {
            sendNotification("New Join Request @ " + team.teamName, auth.currentUser.displayName + " has requested to join the team", "info", data.teamLeader)
            onRequestSent("success");
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

export const acceptMembers = (member, teamID, index) => {
  const onTeamReceived = (team) => {
    if (team.teamMemberList.includes("")) {
      team.teamMemberList.splice(0);
    }

    let newTeamMember = {UID: member.UID, name: member.name, email: member.email, status: "Active"}

    team.teamMemberList.push(newTeamMember);
    
    team.teamPendingInvites.splice(index);

    if(team.teamPendingInvites.length == 0) {
        team.teamPendingInvites.push("")
    }

    updateDatabase("Teams/" + auth.currentUser.uid + "/" + teamID, {
      teamMemberList: team.teamMemberList,
      teamPendingInvites: team.teamPendingInvites
    });

    updateDatabase("Teams/" + member.UID + "/" + teamID, {
        teamMemberList: team.teamMemberList,
        teamPendingInvites: team.teamPendingInvites
      }).then(
        sendNotification("Join Request Accepted", "You have been accepted into " + team.teamName + ". You can view the team in the teams panel", "success", member.UID)
      );

    for(let i = 0; i < team.teamMemberList.length; i++) {
        updateDatabase("Teams/" + team.teamMemberList[i].UID + "/" + teamID, {
            teamMemberList: team.teamMemberList,
            teamPendingInvites: team.teamPendingInvites
          });
    }

  };

  readOnceFromDatabase(
    "Teams/" + auth.currentUser.uid + "/" + teamID,
    onTeamReceived
  );
};

export const fetchNotification = (onNotificationReceived) => {
  read_from_Database_onChange("Notification/" + auth.currentUser.uid, onNotificationReceived)
}


export const sendNotification = (title, message, type, receiverUID) => {

  let notification = {title: title, message: message, type: type}

  if(Array.isArray(receiverUID)){
    for(let i = 0; i < receiverUID.length; i++) {
      const onNotificationReceived = (notificationList) => {
        if(notificationList == null) {
          let dataList = [];
          dataList.push(notification)
          notificationList = dataList
        } else {
          notificationList.push(notification)
        }

         writeToDatabase("Notification/" + receiverUID[i], notificationList)
      }

      readOnceFromDatabase("Notification/" + receiverUID[i], onNotificationReceived)

        }
    } else {
      const onNotificationReceived = (notificationList) => {
        if(notificationList == null) {
          let dataList = [];
          dataList.push(notification)
          notificationList = dataList
        } else {
          notificationList.push(notification)
        }

         writeToDatabase("Notification/" + receiverUID, notificationList)
      }

      readOnceFromDatabase("Notification/" + receiverUID, onNotificationReceived)
    }

}

export const deleteNotification = (notificationList, index) => {
  notificationList.splice(index);
  writeToDatabase("Notification/" + auth.currentUser.uid, notificationList)
}

