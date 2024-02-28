import { Task } from "../classes"
import { auth } from "../firebase";
import { readOnceFromDatabase, updateDatabase, writeToDatabase } from "../firebaseCRUD";
import { sendNotification } from "../teamFunctions";

export const assignTask = (userID, team, index , taskName, taskDesc, deadline, onSuccess ) => {
    const currentTask = Task( taskName, taskDesc, "", [""], "", getTimeDate(), deadline, "", "Not Started Yet" )
    
    const onDataReceived = (taskList)=>{
        if (taskList.includes(""))
    {
        taskList.splice(0)
        
    }

    taskList.push(currentTask)
        updateDatabase("Teams/" + auth.currentUser.uid + "/" + team.teamCode + "/teamMemberList/" + index, {taskList: taskList}).then(
            ()=>{
                updateDatabase("Teams/" + userID + "/" + team.teamCode + "/teamMemberList/" + index, {taskList: taskList}).then(
                    ()=>{
                        sendNotification("Task assigned @ " + team.teamName, taskName +         `\nDeadline: ${deadline}` , "info", userID)
                        onSuccess(true)
        
                    }
                )

            }
    )
    
}
    readOnceFromDatabase("Teams/" + userID + "/" + team.teamCode + "/teamMemberList/" + index + "/taskList", onDataReceived)
}



const getTimeDate = () => {
    let newDate = new Date();
  
    let month = newDate.getMonth() + 1;
  
    let hours = newDate.getHours();
    if (hours < 10) hours = "0" + hours;
    let minutes = newDate.getMinutes();
    if (minutes < 10) minutes = "0" + minutes;
  
    return [
      newDate.getDate() + "/" + month + "/" + newDate.getFullYear(),
      hours + ":" + minutes,
    ];
  };