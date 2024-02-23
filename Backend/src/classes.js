
export const Team = (teamCode, teamName, teamProfile, teamDescription, teamLeader, teamMemberList, projectLength, projectType, gitConfig, taskList, teamStatus, teamPendingInvites) => {
    return {
        "teamCode": teamCode,
        "teamName": teamName,
        "teamProfile": teamProfile,
        "teamDescription": teamDescription,
        "teamLeader": teamLeader,
        "teamMemberList": teamMemberList,
        "projectLength": projectLength,
        "projectType": projectType, 
        "gitConfig" : gitConfig,
        "taskList": taskList,
        "teamStatus": teamStatus,
        "teamPendingInvites" : teamPendingInvites
    }
}

export const User = () => {
    return {

    }
}

export const Task = () => {
    return {
        
    }
}

export const Message = () => {
    
}

export const Progress = () => {
    return {
        
    }
}