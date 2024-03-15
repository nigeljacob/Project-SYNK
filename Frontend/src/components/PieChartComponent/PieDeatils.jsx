import React from 'react';

function PieDetails (props) {
    return(
        <div className=""> 
          <h1 className="tw-ml-20 tw-font-semibold">Total of {props.totalTime} Miniutes Spent on This Task</h1>
          <ul className="tw-ml-20 tw-mt-[20px]">
            <li className="tw-mt-10 tw-list-disc tw-ml-5 tw-text-lg tw-font-semibold">Task Assigned -{props.taskCompletedDate}</li>
            <li className="tw-mt-10 tw-list-disc tw-ml-5 tw-text-lg tw-font-semibold">Task Completed -{props.taskAssigneddDate} </li>
            <li className="tw-mt-10 tw-text-green-500 tw-font-semibold tw-text-lg ">Task Completed {props.taskBeforeAfter} Days Before Deadline</li>
          </ul>

        </div>
    )

}

export default PieDetails;