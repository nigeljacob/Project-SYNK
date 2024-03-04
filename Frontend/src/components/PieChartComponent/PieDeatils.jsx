import React from 'react';

var a = "60"
function PieDetails () {
    return(
        <div className=""> 
          <h1 className="tw-ml-20 tw-font-semibold">Total of {a} Miniutes Spent on This Task</h1>
          <ul className="tw-ml-20 tw-mt-[20px]">
            <li className="tw-border p-2">Task Assigned - 2022/03/12</li>
            <li className="tw-border p-2 tw-mt-10 ">Task Completed - 2023/03/18</li>
            <li className="tw-border p-2 tw-mt-10">Task Assigned - 2024/03/18</li>
            <li className="tw-mt-10 tw-text-green-500 tw-font-semibold tw-text-lg">Task Completed 2 Days Before Deadline</li>
          </ul>

        </div>
    )

}

export default PieDetails;