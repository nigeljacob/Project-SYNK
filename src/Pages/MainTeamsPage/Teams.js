import React, { useState } from 'react';
import './Teams.css';
import Team from "../../Classes/Team.js"
import TeamComponent from "../../components/TeamComponent/TeamComponent.jsx"

let teamOwnList = [];
let teamInList = [];
let teamPendingList = [];

for(let i = 0; i < 5; i++ ) {
  let team = new Team("T0001", "SDGP Group", "https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg", "A hassle-free team collaboration system for leaders to keep in touch with members and check in with progress" , "Nigel", ["Milni", "Sevinda", "Sasri", "Nigel", "Sevinda"], "2024/02/05", []);
  teamOwnList.push(team);
}

for(let i = 0; i < 2; i++ ) {
  let team = new Team("T0001", "On Life", "", "A hassle-free team collaboration system for leaders to keep in touch with members and check in with progress" , "Milni", ["Milni", "Sevinda", "Sasri", "Nigel", "Sevinda Perera"], "2024/02/05", []);
  teamInList.push(team);
}

for(let i = 0; i < 3; i++ ) {
  let team = new Team("T0001", "SDGP Group", "", "A hassle-free team collaboration system for leaders to keep in touch with members and check in with progress" , "Sasri", ["Milni", "Sevinda", "Sasri", "Nigel", "Sevinda"], "2024/02/05", []);
  teamPendingList.push(team);
}

function Teams() {

  const [isOpen, setIsOpen] = useState(false);
  const SideBarResult = isOpen ? "popupLayout show_popup" : "popupLayout hide_popup";

  return (
    <>
    <div className='teams'>
      <h2>Teams you own</h2>
      <div className='teamsYouOwn'>
      {teamOwnList.map((item, index) => {
                return (
                  <TeamComponent team={teamOwnList[index]} />
                )
            })}
      </div>

      <h2>Teams your in</h2>
      <div className='teamsYourIn'>
      {teamInList.map((item, index) => {
                return (
                  <TeamComponent team={teamInList[index]} />
                )
            })}
      </div>

      <h2>Pending Teams</h2>
      <div className='pendingTeams'>
      {teamPendingList.map((item, index) => {
                return (
                  <TeamComponent team={teamPendingList[index]} />
                )
            })}
      </div>

      <div className='joinButtons'>
          <div className='button' onClick={event => {
            let popupLayout = document.getElementById("popupLayout");
            let popup = document.getElementById('JoinTeamPopup');
              if(isOpen) {
                popup.style.visibility = "hidden";
                popupLayout.style.background = "rgba(0,0,0,0)"
              } else {
                popupLayout.style.visibility = "visible";
                popup.style.visibility = "visible";
                setTimeout(() => {
                  popupLayout.style.background = "rgba(0,0,0,0.7)"
                }, 100);
              }
            
              setIsOpen(!isOpen);
          }}>
            <h4>Join Team</h4>
          </div>
          <div className='button' onClick={event => {
              let popupLayout = document.getElementById("popupLayout");
              let popup2 = document.getElementById('createTeamPopup');
              if(isOpen) {
                popup2.style.visibility = "hidden";
                popupLayout.style.background = "rgba(0,0,0,0)"
              } else {
                popupLayout.style.visibility = "visible";
                popup2.style.visibility = "visible";
                setTimeout(() => {
                  popupLayout.style.background = "rgba(0,0,0,0.7)"
                }, 100);
              }
            
              setIsOpen(!isOpen);
          }}>
            <h4>Create Team</h4>
          </div>
      </div>
    </div>
<div className={SideBarResult} id='popupLayout' onClick={event => {
      
        let popupLayout = document.getElementById("popupLayout");
        let joinPopup = document.getElementById('JoinTeamPopup');
        let createPopup = document.getElementById('createTeamPopup');
        if(!isOpen) {
          popupLayout.style.visibility = "visible";
        } else {
          popupLayout.style.visibility = "hidden";
          joinPopup.style.visibility = "hidden";
          createPopup.style.visibility = "hidden";
          popupLayout.style.background = "rgba(0,0,0,0)"
        }

        setIsOpen(!isOpen);

    }}>
    
        <div className='JoinTeamPopup' id='JoinTeamPopup'>
            
        </div>

        <div className='createTeamPopup' id='createTeamPopup'>
            
        </div>
    </div>

    </>
  )
}

export default Teams
