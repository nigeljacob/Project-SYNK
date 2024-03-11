export const Team = (
  teamCode,
  teamName,
  teamProfile,
  teamDescription,
  teamLeader,
  teamMemberList,
  projectLength,
  projectType,
  gitConfig,
  teamStatus,
  teamPendingInvites,
  startDate
) => {
  return {
    teamCode: teamCode,
    teamName: teamName,
    teamProfile: teamProfile,
    teamDescription: teamDescription,
    teamLeader: teamLeader,
    teamMemberList: teamMemberList,
    projectLength: projectLength,
    projectType: projectType,
    gitConfig: gitConfig,
    teamStatus: teamStatus,
    teamPendingInvites: teamPendingInvites,
    startDate: startDate,
  };
};

export const User = (uid, email, username, profilePicture, userStatus) => {
  return {
    uid: uid,
    email: email,
    username: username,
    profile: profilePicture,
    userStatus: userStatus,
  };
};

export const Task = (
  taskName,
  taskDesc,
  documentFilePath,
  applicationsList,
  progress,
  assignedDate,
  deadline,
  taskCompletedDate,
  taskStatus,
  startedDate,
  teamName,
  teamCode
) => {
  return {
    taskName: taskName,
    taskDesc: taskDesc,
    documentFilePath: documentFilePath,
    applicationsList: applicationsList,
    progress: progress,
    assignedDate: assignedDate,
    deadline: deadline,
    taskCompletedDate: taskCompletedDate,
    taskStatus: taskStatus,
    startedDate: startedDate,
    teamName: teamName,
    teamCode: teamCode,
  };
};

export const Message = (
  message,
  senderUID,
  receiverUID,
  time,
  date,
  key,
  senderEmail,
  senderName
) => {
  return {
    message: message,
    senderUID: senderUID,
    receiverUID: receiverUID,
    time: time,
    date: date,
    key: key,
    senderEmail: senderEmail,
    senderName: senderName,
  };
};

export const Progress = (taskLength, folderVersions, applicationTimeList, lastApplication) => {
  return {
    taskLength: taskLength,
    folderVersions: folderVersions,
    applicationTimeList: applicationTimeList,
    lastApplication: lastApplication
  };
};
