import { isToday, isTomorrow, isYesterday } from "date-fns";
import clockImage from "../../assets/images/clock.svg";
import 'react-clock/dist/Clock.css';
import Clock from 'react-clock';
import { useEffect, useState } from 'react';
import React from "react";

const DeadlineComponent = ({task, closestDate}) => {

  let dueText = "";
  let isAlreadyDued = false;

  if (isToday(closestDate)) {
    dueText = "dues Today"
  } else if (isTomorrow(closestDate)) {
    dueText = "dues Tomorrow"
  } else if(closestDate < new Date()) {
    if(isYesterday(closestDate)) {
      dueText = "dued Yesterday"
    } else {
      dueText = "dued on " + task.deadline[0]
    }
    isAlreadyDued = true;
  }else {
     dueText = "dues on " + task.deadline[0]
  }

  const [value, setValue] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setValue(new Date()), 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    
    <>
      {isAlreadyDued ? (
        <>
        <div className="deadline-container_past tw-h-[140px]">
      <div className="clock-container">
        <Clock value={value} className="tw-bg-white tw-rounded-[50%] tw-w-[40px] tw-h-[40px] tw-border-4  tw-border-[#FF0000]" size={90} />
        <div className="deadline-text-container">
          <h3 className="tw-text-[20px]"><b>{task.taskName}</b> {dueText}</h3>
          <h4>{task.taskDesc}</h4>
        </div>
      </div>

     {task.taskStatus == "Start" ? (
       <button className="tw-bg-black tw-rounded-[10px] tw-px-[35px] tw-py-[12px]">Start</button>
     ) : task.taskStatus == "In Progress" ? (
      <button className="tw-bg-black tw-rounded-[10px] tw-px-[35px] tw-py-[12px]">Continue</button>
     ): null }
    </div>
    </>
      ) : (
        <>
        <div className="deadline-container tw-h-[140px]">
      <div className="clock-container">
      <Clock value={value} className="tw-bg-white tw-rounded-[50%] tw-w-[40px] tw-h-[40px] tw-border-4  tw-border-[#A7A7A7]" size={90} />
        <div className="deadline-text-container">
          <h3 className="tw-text-[20px]"><b>{task.taskName}</b> {dueText}</h3>
          <h4>{task.taskDesc}</h4>
        </div>
      </div>


    </div>
        </>
      )}
    </>
  );
};

export default DeadlineComponent;
