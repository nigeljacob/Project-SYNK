import React, {useState} from 'react'
import './TeamLeaderDashboard.css'
import '../../MainTeamsPage/Teams.css'
import TaskDetails from "../../../components/TaskComponent/TaskDetails.jsx"

const TeamLeaderDashboard = (props) => {
  
  return (
    <div className='teamLeaderDashboard'>
    <h1>Leader</h1>
    <TaskDetails
      index="1"
      taskDesc="Finish the individual report"
      taskStatus="Continue"
      setViewTaskTrigger={props.setViewTaskTrigger}
      viewTaskTrigger={props.viewTaskTrigger}     

    />
    </div>
  )
}

export default TeamLeaderDashboard
