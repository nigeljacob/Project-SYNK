import React from 'react';

function PieDetails (props) {
    return(
        <div className=""> 
          <h1 className="tw-ml-20 tw-font-semibold">A Total of <span className='tw-text-[#5BCEFF]'>{formatMilliseconds(parseInt(props.task.progress.taskLength)).toUpperCase()}</span> Spent on This Task</h1>
            <p className="tw-mt-10 tw-list-disc tw-ml-20 tw-text-lg tw-font-semibold">Task Assigned -{props.task.assignedDate[0]} at {props.task.assignedDate[1]}</p>
            {props.task.taskStatus === "Complete" ? (
              <div>
                <p className="tw-mt-2 tw-list-disc tw-ml-20 tw-text-lg tw-font-semibold">Task Completed -{props.taskAssigneddDate} </p>
                <p className="tw-mt-2 tw-text-green-500 tw-font-semibold tw-text-lg tw-ml-20">Task Completed {props.taskBeforeAfter} Days Before Deadline</p>
              </div>
            ) : (
              <div>
                <p className="tw-mt-2 tw-list-disc tw-text-lg tw-font-semibold tw-ml-20">Task Deadline - {props.task.deadline[0]} at {props.task.deadline[1]} </p>
              </div>
            )}

        </div>
    )

}

function formatMilliseconds(milliseconds) {
  // Convert milliseconds to hours, minutes, and seconds
  let hours = Math.floor(milliseconds / 3600000);
  milliseconds = milliseconds % 3600000;
  let minutes = Math.floor(milliseconds / 60000);

  // Build the formatted string
  let formattedTime = '';
  if (hours > 0) {
      formattedTime += hours + ' hour';
      if (hours > 1) formattedTime += 's'; // pluralize 'hour' if necessary
  }
  if (minutes > 0) {
      if (formattedTime !== '') formattedTime += ' ';
      formattedTime += minutes + ' minute';
      if (minutes > 1) formattedTime += 's'; // pluralize 'minute' if necessary
  }

  // Handle the case where milliseconds are less than 1 minute
  if (formattedTime === '') formattedTime = 'less than a minute';

  return formattedTime;
}

export default PieDetails;