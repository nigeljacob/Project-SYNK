import React from 'react'
import './Teams.css';
import Team from "../Team.js"
import TeamComponent from "../components/TeamComponent.jsx"

let teamsList = [];

for(let i = 0; i < 5; i++ ) {
  let team = new Team("T0001", "SDGP Group", "", "A hassle-free team collaboration system for leaders to keep in touch with members and check in with progress" , "Nigel Jacob", ["Milni", "Sevinda", "Sasri", "Nigel", "Sevinda"], "2024/02/05", []);
  teamsList.push(team);
}

function Teams() {
  return (
    <div className='teams'>
      <h2>Teams you own</h2>
      <div className='teamsYouOwn'>
      {teamsList.map((item, index) => {
                return (
                  <TeamComponent team={teamsList[index]} />
                )
            })}
      </div>
      
      <h2>Teams your in</h2>
      <div className='teamsYourIn'>
      {teamsList.map((item, index) => {
                return (
                  <TeamComponent team={teamsList[index]} />
                )
            })}
      </div>

      <h2>Pending Teams</h2>
      <div className='pendingTeams'>
      {teamsList.map((item, index) => {
                return (
                  <TeamComponent team={teamsList[index]} />
                )
            })}
      </div>

      <div className='joinButtons'>
        
      </div>
    </div>
  )
}

export default Teams
