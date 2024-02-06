import React from 'react'
import './TeamComponent.css'
import * as CIIcons  from "react-icons/ci";
import * as FaIcons from "react-icons/fa";
import { Link } from 'react-router-dom';

function TeamComponent({team}) {
  const isAvailable = team.teamProfile !== "";
  const nameList = team.teamName.split(" ");
  const isLarger = nameList.length > 1;
  return (
    <div className='teamWrapper'>
      <div className="teamStatus">
        <h3>Active</h3>
      </div>
      <div className="teamProfile">
        <div className="profile">
        {isAvailable ? (
          <img src={team.teamProfile} alt='profileImage' />
        ) :  (
          isLarger ? (
            <h1>{nameList[0].substring(0,1).toUpperCase()}{nameList[nameList.length - 1].substring(0,1).toUpperCase()}</h1>
          ) : (
            <h1>{nameList[0].substring(0,1).toUpperCase()}</h1>
          )
        )}
        </div>
        <div className="teamTitle">
          <h3 id="teamName">{team.teamName}</h3>
          <h5 id="membersLength">{team.teamMemberList.length} Members</h5>
        </div>
      </div>
      <p id="teamDesc">{team.teamDescription}</p>
      <div className="projectLength">
        <FaIcons.FaClock />
        <h3>{calculateProjectLength()}</h3>
        <h3 id='remaining'>{calculateProjectRemaining()}</h3>
      </div>
      <div className='memberProfiles'>
      {team.teamMemberList.map((item, index) => {
        if(index < 3) {
          return(
            <div className='memberProfile'>  
              <img src="https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg" alt="" />
            </div>
          )
        } else if(index === 3){
          return(
            <div className='memberProfile'>  
              <div className="memberExtra">
                <p>+{team.teamMemberList.length - index}</p>
              </div>
            </div>
          )
        }
      })}
      </div>

      <div className="buttons">
        <Link to= {{ pathname: "/memberDashboard", state: team }} className="teamButton">
          <div>
            <h3>View Team</h3>  
          </div>
        </Link>
        <CIIcons.CiMenuKebab className='menuButton' />
      </div>   
    </div>
  )
}

function calculateProjectLength() {
  return "6 months"
}

function calculateProjectRemaining() {
  return "5m 6d"
}

export default TeamComponent