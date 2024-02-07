import React from 'react'
import { useLocation } from 'react-router';
import TaskDetails from "../components/TaskDetails.jsx"

const TeamMemberDashboard = () => {
    const location = useLocation();
    const state = location.state;
    const currentTeam = state["Team"];

    let taskList = currentTeam._taskList;

  return (
    <>
       <div className="deadline-container">
          <div className="clock-container">
            <img src="/images/clock.svg" alt="clock" />
            <div className="deadline-text-container">
              <h2>Task Deadline Today</h2>
              <p>Task assigned to you by leader from SDGP GROUP dues today</p>
            </div>
          </div>

          <button className="continue-btn">Continue</button>
        </div>

        <div className="mt-[55px] ml-[10px] tasks-container">
          <h2>Your Tasks</h2>
          {taskList.length > 0 ? (
            taskList.map((item) => {
              // Render the item here
              return (
                <TaskDetails
                index="1"
                taskDesc="Finish the individual report"
                taskStatus="Completed"
              />
              );
            })
          ) : (
            <p className='tasksNotAvailable'>No tasks has been assigned to you yet</p>
          )}
        </div>
    </>
  )
}

export default TeamMemberDashboard
