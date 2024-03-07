import React from 'react';

var totalTime = "60"
var taskCompletedDate  = "03/07/2024"
var taskAssigneddDate = "03/18/2024"
var taskBeforeAfter="3"



function PieDetails () {
    return(
        <div className=""> 
          <h1 className="tw-ml-20 tw-font-semibold">Total of {totalTime} Miniutes Spent on This Task</h1>
          <ul className="tw-ml-20 tw-mt-[20px]">
            <li className="tw-mt-10 tw-list-disc tw-ml-5 tw-text-lg tw-font-semibold">Task Assigned -{taskCompletedDate}</li>
            <li className="tw-mt-10 tw-list-disc tw-ml-5 tw-text-lg tw-font-semibold">Task Completed -{taskAssigneddDate} </li>
            <li className="tw-mt-10 tw-text-green-500 tw-font-semibold tw-text-lg ">Task Completed {taskBeforeAfter} Days Before Deadline</li>
          </ul>

        </div>
    )

}

export default PieDetails;