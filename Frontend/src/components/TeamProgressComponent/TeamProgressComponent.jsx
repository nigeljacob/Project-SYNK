import React, { useEffect, useState } from "react";
import timeClock from "../../assets/images/timeClock.svg";
import { getProfilePicture, getStatus } from "../../../../Backend/src/UserAccount";

const TeamProgressComponent = ({
  photo,
  member,
  tasks,
}) => {

  const [status, setStatus] = useState("Offline");
  const [profilePic, setProfilePic] = useState("");
  
  let StartedTasks = 0;
  let CompletedTasks = 0;
  let StartedTasksIndex = [];

  if(tasks[0] === "") {
    tasks.splice(0)
  }

  
  for(let i = 0; i < tasks.length; i++) {
    if(tasks.taskStatus == "Continue") {
      StartedTasks++
      StartedTasksIndex.push(i)
    } else if(tasks.taskStatus == "Completed") {
      CompletedTasks++
    }
  }


    useEffect(() => {
        getStatus(member["UID"], (status) => {
            setStatus(status);
        })
        getProfilePicture(member["UID"], (data) => {
          setProfilePic(data)
          console.log(data)
        })
    }, [])


  return (
    <div className="tw-mt-[30px] tw-w-[255px] tw-min-w-[255px] tw-min-h-[255px] tw-h-[255px] tw-bg-[#272727] tw-mb-[40px] tw-rounded-[10px] tw-py-[20px] tw-px-[15px] tw-flex tw-flex-col tw-justify-between">
      <div className="tw-flex tw-flex-col tw-relative">
        <div className="tw-flex tw-items-center tw-w-full">
          {profilePic != "" ? (
            <div className='tw-w-[50px] tw-h-[50px] tw-rounded-[5px] tw-bg-[#0B0B0B]'>
              <img src={profilePic} alt="profile picture" className='tw-w-[50px] tw-h-[50px] tw-object-cover tw-rounded-[5px]'/>
            </div>
          ) : (
            <div className="tw-flex tw-justify-center tw-rounded-[5px] tw-items-center tw-text-[18px] tw-w-[50px] tw-h-[50px] tw-bg-[#0B0B0B]">
              {member["name"][0]}
            </div>
          )}
          <div className="tw-pl-[6px]">
            <p className="tw-text-[18px]">{member["name"]}</p>
            <p className="tw-text-[12px] tw-text-[#9C9C9C]">
              {status}
            </p>
            {status == "Busy" ? (
              <p className="tw-absolute tw-top-0 tw-right-0 tw-text-[11px] tw-text-[#5BCEFF] tw-bg-[#224a5b] tw-py-[4px] tw-px-[6px] tw-rounded-[5px]">
              Busy
              </p>
            ) : status == "Offline" ? (
              <p className="tw-absolute tw-top-0 tw-right-0 tw-text-[11px] tw-text-[#FF0000] tw-bg-[#341d1d]  tw-py-[4px] tw-px-[6px] tw-rounded-[5px]">
              Offline
              </p>
            ) : (
              status === "Away" ? (
                <p className="tw-absolute tw-top-0 tw-right-0 tw-text-[11px] tw-text-[#e4ec45] tw-bg-[#575a1d] tw-py-[4px] tw-px-[6px] tw-rounded-[5px]">
              Away
              </p>
              ) : (
                <p className="tw-absolute tw-top-0 tw-right-0 tw-text-[11px] tw-text-[#00FF00] tw-bg-[#284829] tw-py-[4px] tw-px-[6px] tw-rounded-[5px]">
              {member["status"]}
              </p>
              )
            )}
          </div>
        </div>

        <div className="tw-mt-[10px] tw-flex tw-flex-col tw-gap-[5px]">
          
          {StartedTasks > 0 ? (
            <></> 
            // have to implement
          ) : (
            <div>
              <div className="tw-flex tw-gap-[8px]">
              <img src={timeClock} alt="time clock" />
              <p className="tw-text-[14px]">No Tasks Started Yet</p>
            </div>
            <div className="tw-flex tw-gap-[8px]">
              <img src={timeClock} alt="time clock" />
              {tasks.length == 0 ? (
                <p>No Tasks assigned yet</p>
              ): (
                tasks.length < 2 ? (
                  <p className="tw-text-[14px]">{tasks.length} task to complete</p>
               ) : (
                 <p className="tw-text-[14px]">{tasks.length} tasks to complete</p>
               )
              )}
            </div>
            </div>
          )}
        </div>
      </div>

      <button className="tw-flex tw-justify-center tw-items-center tw-w-full tw-h-[25px] tw-bg-[#0B0B0B] tw-text-[#5BCEFF] tw-text-[13px]">
        View Progress
      </button>
    </div>
  );
};

export default TeamProgressComponent;
