import { Progress, Task } from "../classes";
import { auth } from "../firebase";
import { readOnceFromDatabase, updateDatabase } from "../firebaseCRUD";
import { sendNotification } from "../teamFunctions";
const electronApi = window?.electronApi;

export const assignTask = (
  userID,
  team,
  index,
  taskName,
  taskDesc,
  deadline,
  onSuccess
) => {
  const currentTask = Task(
    taskName,
    taskDesc,
    "",
    [""],
    "",
    getTimeDate(),
    deadline,
    "",
    "Start",
    "",
    team.teamName,
    team.teamCode
  );

  const onDataReceived = (taskList) => {
    if (taskList.includes("")) {
      taskList.splice(0);
    }

    taskList.push(currentTask);
    updateDatabase(
      "Teams/" +
        auth.currentUser.uid +
        "/" +
        team.teamCode +
        "/teamMemberList/" +
        index,
      { taskList: taskList }
    ).then(() => {
      updateDatabase(
        "Teams/" + userID + "/" + team.teamCode + "/teamMemberList/" + index,
        { taskList: taskList }
      ).then(() => {
        sendNotification(
          "Task assigned @ " + team.teamName,
          taskName + `\nDeadline: ${deadline}`,
          "info",
          userID,
          "feed -taskAssigned",
          userID
        );
        onSuccess(true);
      });
    });
  };
  readOnceFromDatabase(
    "Teams/" +
      userID +
      "/" +
      team.teamCode +
      "/teamMemberList/" +
      index +
      "/taskList",
    onDataReceived
  );
};

export const updateViewTask = (
  team,
  task,
  taskIndex,
  newApplicationList,
  filePath,
  callback
) => {
  const onDataReceived = (data) => {
    for (let i = 0; i < data.length; i++) {
      let member = data[i];
      if (member.UID === auth.currentUser.uid) {
        let task = member.taskList[taskIndex];

        let applicationList = newApplicationList;

        if (task.progress === "") {
          let applicationTimeList = [];

          for (let i = 0; i < applicationList.length; i++) {
            let dict = { name: applicationList[i].name, timeLength: "" };
            applicationTimeList.push(dict);
          }

          task.progress = Progress("", [""], applicationTimeList, "");
        } else {
          let applicationTimeList = task.progress.applicationTimeList;

          for (let i = 0; i < applicationList.length; i++) {
            if (
              !applicationTimeList.some(
                (item) => item.name == applicationList[i].name
              )
            ) {
              applicationTimeList.push({
                name: applicationList[i].name,
                timeLength: "",
              });
            }
          }
        }

        task.applicationsList = applicationList;
        task.filePath = filePath;
        task.taskStatus = "Continue";

        updateDatabase(
          "Teams/" +
            auth.currentUser.uid +
            "/" +
            team.teamCode +
            "/teamMemberList/" +
            i +
            "/taskList/" +
            taskIndex,
          task
        )
          .then(() => {
            updateDatabase(
              "Teams/" +
                team.teamLeader.UID +
                "/" +
                team.teamCode +
                "/teamMemberList/" +
                i +
                "/taskList/" +
                taskIndex,
              task
            ).then(() => {
              sendNotification(
                "Task Details Updated",
                "Task details have been updated... You can now start the task",
                "success",
                auth.currentUser.uid,
                "success",
                auth.currentUser.uid
              );
              sendNotification(
                member.name + " @ " + team.teamName,
                "Updated their task details for task " +
                  parseInt(taskIndex + 1),
                "info",
                team.teamLeader.UID,
                "feed -taskDetailsUpdatedLeader",
                auth.currentUser.uid
              );
              callback(true);
            });
          })
          .catch(() => {
            sendNotification(
              "Failed to update task details",
              "An error occured while updating task details",
              "danger",
              auth.currentUser.uid,
              "error",
              auth.currentUser.uid
            );
            callback(false);
          });
      }
    }
  };

  readOnceFromDatabase(
    "Teams/" + auth.currentUser.uid + "/" + team.teamCode + "/teamMemberList/",
    onDataReceived
  );
};

// there are some errros in this function have to fix.. don't use it might ruin the firebase structure
export const updateTaskStatus = (
  team,
  memberIndex,
  taskIndex,
  taskStatus,
  memberName
) => {
  updateDatabase(
    "Teams/" +
      auth.currentUser.uid +
      "/" +
      team.teamCode +
      "/" +
      "teamMemberList/" +
      memberIndex +
      "/taskList/" +
      taskIndex,
    { taskStatus: taskStatus }
  ).then(() => {
    updateDatabase(
      "Teams/" +
        team.teamLeader["UID"] +
        "/" +
        team.teamCode +
        "/" +
        "teamMemberList/" +
        memberIndex +
        "/taskList/" +
        taskIndex,
      { taskStatus: taskStatus }
    ).then(() => {
      if (taskStatus === "Completed") {
        sendNotification(
          "Task Completed @" + team.teamName,
          memberName +
            " has succesfully completed task " +
            parseInt(taskIndex + 1) +
            ".",
          "info",
          team.teamLeader["UID"],
          "feed -taskCompleted",
          team.teamLeader["UID"]
        );
        updateDatabase(
          "Teams/" +
            auth.currentUser.uid +
            "/" +
            team.teamCode +
            "/" +
            "teamMemberList/" +
            memberIndex +
            "/taskList/" +
            taskIndex,
          { taskCompletedDate: getTimeDate() }
        );
        updateDatabase(
          "Teams/" +
            team.teamLeader["UID"] +
            "/" +
            team.teamCode +
            "/" +
            "teamMemberList/" +
            memberIndex +
            "/taskList/" +
            taskIndex,
          { taskCompletedDate: getTimeDate() }
        );
      }
    });
  });
};

export const startTask = (task, taskIndex, team, teamMemberIndex, onTaskStarted) => {
  readOnceFromDatabase(
    "Users/" + auth.currentUser.uid + "/userStatus",
    (status) => {
      if (status === "Active") {
        updateDatabase("Users/" + auth.currentUser.uid, { userStatus: "Busy" });
        if (task.startedDate === "") {
          task.startedDate = getTimeDate();
        }

        updateDatabase(
          "Teams/" +
            auth.currentUser.uid +
            "/" +
            team.teamCode +
            "/teamMemberList/" +
            teamMemberIndex +
            "/taskList/" +
            taskIndex,
          { taskStatus: "In Progress", startedDate: task.startedDate }
        ).then(() => {
          updateDatabase(
            "Teams/" +
              team.teamLeader.UID +
              "/" +
              team.teamCode +
              "/teamMemberList/" +
              teamMemberIndex +
              "/taskList/" +
              taskIndex,
            { taskStatus: "In Progress", startedDate: task.startedDate }
          ).then(() => {
            sendNotification(
              "Task Started @" + team.teamName,
              auth.currentUser.displayName +
                " have started task " +
                parseInt(taskIndex + 1) +
                ".",
              "info",
              team.teamLeader.UID,
              "info",
              team.teamLeader.UID
            );
          });

          updateDatabase(
            "Teams/" +
              auth.currentUser.uid +
              "/" +
              team.teamCode +
              "/teamMemberList/" +
              teamMemberIndex,
            { status: "Working on task " + parseInt(taskIndex + 1) }
          ).then(() => {
            updateDatabase(
              "Teams/" +
                team.teamLeader.UID +
                "/" +
                team.teamCode +
                "/teamMemberList/" +
                teamMemberIndex,
              { status: "Working on task " + parseInt(taskIndex + 1) }
            );
          });

          readOnceFromDatabase(
            "Teams/" +
              auth.currentUser.uid +
              "/" +
              team.teamCode +
              "/teamMemberList/" +
              teamMemberIndex
              + "/taskList/" +
              taskIndex,
            (task) => {
              onTaskStarted(task);
            }
          );

        });
      } else {
        //send alert
        electronApi.sendShowAlertSignamToMain([
          "Another task is running",
          "You can only work on one task at a time.",
        ]);
        onTaskStarted(null);
      }
    }
  );
};

export const PauseTask = (task, taskIndex, team, teamMemberIndex, onTaskPaused) => {
    readOnceFromDatabase("Users/" + auth.currentUser.uid + "/userStatus", (status) => {
        if(status === "Busy") {
          updateDatabase("Users/" + auth.currentUser.uid, { userStatus: "Active" });

          

          updateDatabase(
            "Teams/" +
              auth.currentUser.uid +
              "/" +
              team.teamCode +
              "/teamMemberList/" +
              teamMemberIndex +
              "/taskList/" +
              taskIndex,
            { taskStatus: "Continue"}
          ).then(() => {
            updateDatabase(
              "Teams/" +
                team.teamLeader.UID +
                "/" +
                team.teamCode +
                "/teamMemberList/" +
                teamMemberIndex +
                "/taskList/" +
                taskIndex,
              { taskStatus: "Continue"}
            )
  
            updateDatabase(
              "Teams/" +
                auth.currentUser.uid +
                "/" +
                team.teamCode +
                "/teamMemberList/" +
                teamMemberIndex,
              { status: "Worked on task " + parseInt(taskIndex + 1) }
            ).then(() => {
              updateDatabase(
                "Teams/" +
                  team.teamLeader.UID +
                  "/" +
                  team.teamCode +
                  "/teamMemberList/" +
                  teamMemberIndex,
                { status: "Worked on " + parseInt(taskIndex + 1) }
              ).then(() => {
                onTaskPaused(true)
              });
            });
          }).then(() => {
            onTaskPaused(false)
          });

        }})
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
