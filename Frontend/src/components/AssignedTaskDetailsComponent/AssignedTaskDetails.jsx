import React, { useState } from "react";
import ScrollArea from '../../shadCN-UI/ui/scroll-area'
import "../../components/TaskComponent/TaskDetails.css";

const AssignedTaskDetails = ({ index, taskDesc, taskActivity }) => {
  const [showDetails, setShowDetails] = useState(false);
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="single-task-container tw-relative tw-overflow-y-scroll">
      <p className="tw-absolute tw-top-[10px]">{index + ". " + taskDesc}</p>

      <div className="tw-flex tw-flex-col tw-gap-[10px] tw-items-center tw-mt-[30px] tw-text-lime-500">
        <div className="tw-flex tw-gap-[50px] tw-items-center">
            <p>{taskActivity}</p>
            <button
              className="tw-text-cyan-500 tw-bg-black tw-rounded-lg tw-p-1 tw-h-[35px] tw-w-[90px]"
              onClick={toggleDetails}
            >
              Details
            </button>
        </div>
        {showDetails && (
          <ul>
            <li className="tw-mb-1 tw-text-white  tw-rounded-lg tw-p-1 tw-left-0 tw- tw-list-disc">
              Time Spent -
            </li>
            <li className="tw-mb-1 tw-text-white tw-rounded-lg tw-p-1 tw-list-disc">
              Task Assigned -
            </li>
            <li className="tw-mb-1 tw-text-white  tw-rounded-lg tw-p-1 tw-list-disc">
              Task Completed -
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default AssignedTaskDetails;
