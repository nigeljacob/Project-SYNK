import React from "react";
import timeClock from "../../assets/images/timeClock.svg";

const TeamProgressComponent = ({
  photo,
  name,
  activityTime,
  workingTime,
  tasks,
}) => {
  return (
    <div className="tw-mt-[30px] tw-w-[255px] tw-min-w-[255px] tw-min-h-[255px] tw-h-[255px] tw-bg-[#272727] tw-mb-[40px] tw-rounded-[10px] tw-py-[20px] tw-px-[15px] tw-flex tw-flex-col tw-justify-between">
      <div className="tw-flex tw-flex-col tw-relative">
        <div className="tw-flex tw-items-center tw-w-full">
          {photo ? (
            <img src={photo} alt="profile picture" />
          ) : (
            <div className="tw-flex tw-justify-center tw-items-center tw-text-[18px] tw-w-[50px] tw-h-[50px] tw-bg-[#0B0B0B]">
              {name[0]}
            </div>
          )}
          <div className="tw-pl-[6px]">
            <p className="tw-text-[18px]">{name}</p>
            <p className="tw-text-[12px] tw-text-[#9C9C9C]">
              {activityTime}Active now
            </p>
            <p className="tw-absolute tw-top-0 tw-right-0 tw-text-[11px] tw-text-[#00FF00] tw-bg-[#284829] tw-py-[4px] tw-px-[6px] tw-rounded-[5px]">
              {workingTime}Working
            </p>
          </div>
        </div>

        <div className="tw-mt-[10px] tw-flex tw-flex-col tw-gap-[5px]">
          {tasks.map((task, index) => (
            <div key={index} className="tw-flex tw-gap-[8px]">
              <img src={timeClock} alt="time clock" />
              <p className="tw-text-[14px]">{task}</p>
            </div>
          ))}
        </div>
      </div>

      <button className="tw-flex tw-justify-center tw-items-center tw-w-full tw-h-[25px] tw-bg-[#0B0B0B] tw-text-[#5BCEFF] tw-text-[13px]">
        View Progress
      </button>
    </div>
  );
};

export default TeamProgressComponent;
