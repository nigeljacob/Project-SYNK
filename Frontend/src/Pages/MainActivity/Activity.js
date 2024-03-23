import React, { useEffect, useState } from "react";
import * as IOIcons from "react-icons/io";
import "./Activity.css";
import { read_from_Database_onChange } from "../../utils/firebaseCRUD";
import { auth } from "../../utils/firebase";
import { CircularProgress, Tooltip } from "@mui/material";
import DeadlineComponent from "../../components/ActivityDeadlineComponent/DeadlineComponent";
import ActivityFeedComponent from "../../components/ActivityFeed/ActivityFeedComponent";
import { MdOutlineTaskAlt } from "react-icons/md";
const {
  parse,
  differenceInMilliseconds,
  closestTo,
  isToday,
  isTomorrow,
} = require("date-fns");
import { FaClock } from "react-icons/fa6";
import { Team } from "../../utils/classes";
import FolderViewer from "../../components/FolderViewer/FolderViewer";

function Home(props) {
  var sideBarStatus = true;

  try {
    sideBarStatus = getPreviousSetting("sideBarStatus");
  } catch (e) {
    sideBarStatus = true;
  }

  var today = new Date();
  var curHr = today.getHours();

  var greeting = "";

  if (curHr < 12 && curHr > 5) {
    greeting = "Good Morning";
  } else if (curHr < 16 && curHr >= 12) {
    greeting = "Good Afternoon";
  } else if ((curHr < 24) & (curHr >= 16)) {
    greeting = "Good Evening";
  } else {
    greeting = "Time for Bed";
  }

  const [allTeams, setAllTeams] = useState([]);

  const [todayTasks, setTodayTasks] = useState([]);

  const [tomorrowTasks, setTomorrowTasks] = useState([]);

  useEffect(() => {
    read_from_Database_onChange("Teams/" + auth.currentUser.uid, (Teams) => {
      setAllTeams(Teams);

      let tempTodayTasks = [];
      let tempTomorrowTasks = [];

      let date = new Date();
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      const getTasks = (callback) => {
        for (let i = 0; i < Teams.length; i++) {
          let currentMember = Teams[i].teamMemberList.filter(
            (member) => member.UID === auth.currentUser.uid
          );
          if (currentMember.length != 0) {
            let tasksList = currentMember[0].taskList;
            if (tasksList[0] != "") {
              tempTodayTasks = [
                ...tempTodayTasks,
                tasksList.filter(
                  (task, index) =>
                    task.deadline[0] === day + "/" + month + "/" + year
                ),
              ];
              tempTomorrowTasks = [
                ...tempTomorrowTasks,
                tasksList.filter(
                  (task, index) =>
                    {

                      let currentDate = new Date()
                      const [day, month, year] = task.deadline[0].split('/');

                      const combinedDateTimeString = `${year}-${month}-${day}`;

                      const targetDate = new Date(combinedDateTimeString);

                      if(!isToday(targetDate) && targetDate > currentDate) {
                        return true
                      } return false
                    }
                ),
              ];
            }
          }
        }
        setTimeout(() => {
          callback([tempTodayTasks, tempTomorrowTasks]);
        }, 1000);
      };

      getTasks((tasksList) => {
        setTodayTasks(tasksList[0]);
        setTomorrowTasks(tasksList[1]);
      });
    });
  }, []);

  let feedNotifications = [];

  try {
    feedNotifications = JSON.parse(localStorage.getItem(auth.currentUser.uid + "feedList") || "[]");
  } catch (e) {}

  const [isAvailable, setAvailable] = useState(true);

  const [isLoading, setLoading] = useState(true);

  setTimeout(() => {
    setAvailable(false);
  }, 5000);

  setTimeout(() => {
    setLoading(false)
  }, 7000)

  const [isOpen, setIsOpen] = useState(sideBarStatus);
  const SideBarResult = isOpen
    ? "sideBar show_SideBar"
    : "sideBar hide_SideBar";
  const MainContentResult = isOpen
    ? "activityContent bringBackMainContent"
    : "activityContent extendMainContent";
  const IconResult = isOpen ? "rotateIcon0" : "rotateIcon180";

  return (
    <div className="home tw-max-h-screen tw-overflow-hidden">
      <div className={SideBarResult}>
        <div className="tw-w-[85%] tw-mt-[20px] tw-flex tw-flex-col tw-justify-center tw-items-center tw-ml-[20px]">
          <h3 className="tw-mt-[10px] tw-text-[14px]">Main</h3>
          <h3 className="tw-font-bold tw-text-[28px]">Activities</h3>
        </div>
        <h2 id="teamsHeading">Your Teams</h2>
        <div className="taskTeams tw-w-full tw-min-h-[100px] tw-flex tw-flex-col tw-mt-[-10px] heightMain2 tw-overflow-y-scroll tw-pb-[30px]">
          {allTeams.length > 0 ? (
            allTeams.map((team, index) => (
              <>
                <div className="tw-w-[full] tw-flex tw-items-center hover:tw-bg-[#181818] tw-cursor-pointer">
                  <div className="tw-h-[40px] tw-mt-[15px] tw-mr-[10px] tw-ml-[20px] tw-mb-[10px] tw-w-[40px] tw-bg-[#0B0B0B] tw-flex tw-items-center tw-justify-center tw-flex-col tw-flex-shrink-0">
                    {team.teamLeader.UID === auth.currentUser.uid ? (
                      <h3 className="tw-text-[#5bceff]">
                        {team.teamName.split(" ")[0][0].toUpperCase()}
                        {team.teamName
                          .split(" ")
                          [
                            team.teamName.split(" ").length - 1
                          ][0].toUpperCase()}
                      </h3>
                    ) : (
                      <h3>
                        {team.teamName.split(" ")[0][0].toUpperCase()}
                        {team.teamName
                          .split(" ")
                          [
                            team.teamName.split(" ").length - 1
                          ][0].toUpperCase()}
                      </h3>
                    )}
                  </div>
                  <h5 className="teamNameCropping">{team.teamName}</h5>
                </div>
                {index != allTeams.length - 1 ? (
                  <div className="lineSep"></div>
                ) : null}
              </>
            ))
          ) : isAvailable ? (
            <div className="tw-w-full tw-flex tw-items-center tw-justify-center">
              <CircularProgress />
            </div>
          ) : (
            <div className="tw-w-full tw-flex tw-items-center tw-justify-center">
              <h3>No Teams Created</h3>
            </div>
          )}
        </div>
        {/* close button */}
        <div
          className="closeButton"
          onClick={(event) => {
            setIsOpen(!isOpen);
            sidebarToggler(!isOpen);
          }}
        >
          <IOIcons.IoMdArrowDropleft className={IconResult} />
        </div>
      </div>
      <div className={MainContentResult}>
        <h1>
          <span>{greeting}</span>{" "}
          <span id="displayName">{props.user.displayName.split(" ")[0]}</span> !
        </h1>

        <div className="tw-w-full tw-flex heightMain">
          <div className="tw-flex-1 tw-rounded-[10px] tw-m-[10px] tw-flex-shrink-0">
            <h3 className="tw-mt-[20px] tw-mb-[20px]">Latest Activity Feed</h3>

            {feedNotifications.length > 0 ? (
              feedNotifications.reverse().map((feed, index) => {
                if (index === feedNotifications.length - 1) {
                  return (
                    <ActivityFeedComponent isLast={true} notification={feed} className="feedAnimation"/>
                  );
                } else {
                  return (
                    <ActivityFeedComponent isLast={false} notification={feed} className="feedAnimation" />
                  );
                }
              })
            ) : (
              <div className="tw-w-full tw-min-h-[80px] tw-flex tw-justify-center tw-items-center">
                <h4 className="tw-text-[13px] tw-h-full tw-text-[#A7A7A7]">
                  No Feed
                </h4>
              </div>
            )}
          </div>

          <div className="tw-flex-1 tw-m-[10px] tw-rounded-[10px]">
            <h3 className="tw-mt-[20px]">To Do Today</h3>
            <div className="tw-flex tw-flex-col tw-justify-center tw-mt-[10px]">
              {todayTasks.length != 0 ? (
                todayTasks.map((taskList, index) => {
                  return taskList.length != 0
                    ? taskList.map((task, taskIndex) => {
                        return (
                          <div className="tw-w-[95%] tw-h-fit tw-rounded-[10px] tw-bg-[#0B0B0B] tw-px-[15px] tw-py-[10px] tw-flex tw-items-center tw-my-[10px]">
                            <div className="tw-flex-1 tw-flex tw-items-center">
                              <div className="tw-bg-[#272727] tw-rounded-[5px] tw-w-[35px] tw-h-[35px] tw-flex tw-justify-center tw-items-center">
                                <MdOutlineTaskAlt className="tw-text-[#5BCEFF] tw-w-[70%] tw-h-[70%]" />
                              </div>

                              <div>
                                <h3 className="tw-ml-[10px] tw-text-[13px]">
                                  {task.taskName} @ {task.teamName}
                                </h3>
                                <h3 className="tw-ml-[10px] tw-text-[10px] tw-text-[#A7A7A7]">
                                  {" "}
                                  Due Today
                                </h3>
                              </div>
                            </div>

                            <FaClock />
                          </div>
                        );
                      })
                    : null;
                })
              ) : (
                isLoading ? (
                  <div className="tw-w-full tw-h-full tw-flex tw-justify-center tw-items-center tw-p-[10px]">
                  <CircularProgress />
                  </div>
                ) : (
                  <div className="tw-w-full tw-h-full tw-flex tw-justify-center tw-items-center tw-p-[10px]">
                    <h3 className="tw-text-[13px] tw-yexy-[#A7A7A7]">No Tasks Today</h3>
                  </div>
                )
              )}
            </div>

            <h3 className="tw-mt-[20px]">UpComing Todos'</h3>
            <div className="tw-flex tw-flex-col tw-justify-center tw-mt-[10px]">
              {tomorrowTasks.length != 0 ? (
                tomorrowTasks.map((taskList, index) => {
                  return taskList.length != 0
                    ? taskList.map((task, taskIndex) => {
                        return (
                          <div className="tw-w-[95%] tw-h-fit tw-rounded-[10px] tw-bg-[#0B0B0B] tw-px-[15px] tw-py-[10px] tw-flex tw-items-center tw-my-[10px]">
                            <div className="tw-flex-1 tw-flex tw-items-center">
                              <div className="tw-bg-[#272727] tw-rounded-[5px] tw-w-[35px] tw-h-[35px] tw-flex tw-justify-center tw-items-center">
                                <MdOutlineTaskAlt className="tw-text-[#5BCEFF] tw-w-[70%] tw-h-[70%]" />
                              </div>

                              <div>
                                <h3 className="tw-ml-[10px] tw-text-[13px]">
                                  {task.taskName} @ {task.teamName}
                                </h3>
                                <h3 className="tw-ml-[10px] tw-text-[10px] tw-text-[#A7A7A7]">
                                  {" "}
                                  Due on {task.deadline[0]} at{" "}
                                  {task.deadline[1]}
                                </h3>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    : null;
                })
              ) : (
                isLoading ? (
                  <div className="tw-w-full tw-h-full tw-flex tw-justify-center tw-items-center tw-p-[10px]">
                  <CircularProgress />
                  </div>
                ) : (
                  <div className="tw-w-full tw-h-full tw-flex tw-justify-center tw-items-center tw-p-[10px]">
                    <h3 className="tw-text-[13px] tw-yexy-[#A7A7A7]">No Tasks Assigned Yet</h3>
                  </div>
                )
              )}
            </div>
          </div>

        </div>

       
      </div>
    </div>
  );
}

function sidebarToggler(boolean) {
  if (boolean === true) {
    localStorage.setItem("sideBarStatus", "true");
  } else {
    localStorage.setItem("sideBarStatus", "false");
  }
}

function getPreviousSetting(name) {
  let setting = localStorage.getItem(name);
  if (setting === "true") {
    return true;
  } else {
    return false;
  }
}

export default Home;
