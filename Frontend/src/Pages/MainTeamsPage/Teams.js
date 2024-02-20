import React, { useState } from 'react';
import './Teams.css';
import {Team} from "../../../../Backend/src/classes"
import TeamComponent from "../../components/TeamComponent/TeamComponent.jsx"
import { Card } from '../../shadCN-UI/ui/card';
import * as IOSIcons from "react-icons/io5";
import * as IOIcons from "react-icons/io";
import { Popover, PopoverContent, PopoverTrigger } from "../../shadCN-UI/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "../../shadCN-UI/ui/calendar";
import { Button } from "../../shadCN-UI/ui/button";
import { cn } from "../../shadCN-UI/lib/utils";
import { format } from "date-fns";
import { Tooltip } from '@mui/material';
import { auth } from '../../../../Backend/src/firebase';

let teamOwnList = [];
let teamInList = [];
let teamPendingList = [];

for(let i = 0; i < 5; i++ ) {
  let team = Team("T0001", "SDGP Group", "https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg", "A hassle-free team collaboration system for leaders to keep in touch with members and check in with progress" , "Nigel", ["Milni", "Sevinda", "Sasri", "Nigel", "Sevinda"], "2024/02/05", [], "Active", []);
  teamOwnList.push(team);
}

for(let i = 0; i < 2; i++ ) {
  let team = Team("T0001", "On Life", "", "A hassle-free team collaboration system for leaders to keep in touch with members and check in with progress" , "Milni", ["Milni", "Sevinda", "Sasri", "Nigel", "Sevinda Perera"], "2024/02/05", [], "Active", []);
  teamInList.push(team);
}

for(let i = 0; i < 3; i++ ) {
  let team = Team("T0001", "SDGP Group", "", "A hassle-free team collaboration system for leaders to keep in touch with members and check in with progress" , "Sasri", ["Milni", "Sevinda", "Sasri", "Nigel", "Sevinda"], "2024/02/05", [], "Pending", []);
  teamPendingList.push(team);
}

function Teams() {

  const [isOpen, setIsOpen] = useState(false);
  const SideBarResult = isOpen ? "popupLayout show_popup" : "popupLayout hide_popup";


  const handleJoinSubmit = (e) => {
    e.preventDefault()
  }

  const [date, setDate] = useState(new Date());

  const [isRecurring, setRecurring] = useState(false)

  const [inviteHtml, setInviteHtml] = useState('');

  const [isCopied, setCopied] = useState(false)

  const [isInviteCopied, setInviteCopied] = useState(false)

  const result = !isCopied ? "Copy" : "Copied";

  const handleInvite = (invite) => {
    setInviteHtml(invite)
  } 

  const handleCopy = () => {
    let code = document.getElementById('code');
    navigator.clipboard.writeText(code.textContent);
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 5000)
  }

  const handleInviteCopy = () => {
    let teaxtArea = document.getElementById('textInvite');
    navigator.clipboard.writeText(teaxtArea.value);
    setInviteCopied(true)
    setTimeout(() => {
      setInviteCopied(false)
    }, 5000)
  }
  
  const handleRecurring = (checkbox)  => {
    if(checkbox.target.checked) {
      if(!isRecurring) {
        setRecurring(true)
      }
    } else {
      if(isRecurring) {
        setRecurring(false)}
    }
  }

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
<div className={SideBarResult} id='popupLayout'>
    
        <Card className="tw-w-[500px] tw-h-[400px] tw-border-none tw-bg-zinc-900 tw-relative JoinTeamPopup" id='JoinTeamPopup' > 

          <div className='tw-flex tw-items-center tw-p-5'>
            <h3 className='tw-text-[18px]'>Join Team</h3>
            <IOSIcons.IoClose className='tw-w-[30px] tw-h-[30px] tw-absolute tw-right-5 tw-cursor-pointer hover:tw-text-[#A7A7A7]' onClick={event => {
      
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

            }}/>
          </div>

          <div className='tw-mr-[30px] tw-ml-[30px] tw-mt-[50px] tw-relative tw-h-[180px]'>
            <h4 className='tw-text-[15px]'>Enter Team Code</h4>
            <form onSubmit={handleJoinSubmit}>
              <input type='number' required className='tw-bg-zinc-900 tw-text-white tw-mt-[15px]' name="teamCode" />
              <input type='submit' className='tw-w-[90px] tw-h-[40px] tw-text-[12px] tw-text-black tw-bg-[#5BCEFF] tw-border-none hover:tw-opacity-[80%] tw-cursor-pointer tw-absolute tw-right-0 tw-bottom-0'/>
            </form>
          </div>

        </Card>

        <Card className="tw-w-[500px] tw-h-[400px] tw-border-none tw-bg-zinc-900 tw-relative createTeamPopup tw-overflow-x-scroll" id='createTeamPopup' > 

          <div className='tw-flex tw-items-center tw-p-5 tw-sticky tw-top-0 tw-bg-zinc-900 tw-z-[1000]'>
            <h3 className='tw-text-[18px]'>Create Team</h3>
            <IOSIcons.IoClose className='tw-w-[30px] tw-h-[30px] tw-absolute tw-right-5 tw-cursor-pointer hover:tw-text-[#A7A7A7]' onClick={event => {
      
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

            }}/>
          </div>

          <div className='tw-mr-[30px] tw-ml-[30px] tw-mt-[30px] tw-relative tw-pb-[70px]' >
            <form onSubmit={handleJoinSubmit}>
              <h4 className='tw-text-[15px]'>Team Name</h4>
              <input type='text' required className='tw-bg-zinc-900 tw-text-white tw-mt-[15px]' name="teamName" onChange={event => {
                 generateInvite(event.target.value, document.getElementById('code').textContent);
              }}/>

              <h4 className='tw-text-[15px] tw-mt-[20px]'>Team Description</h4>
              <textarea rows={5} required className='tw-bg-zinc-900 tw-text-white tw-mt-[15px] tw-w-full ' name="teamDescription"> </textarea>

              <h4 className='tw-text-[15px] tw-mt-[20px] tw-mb-[10px]'>Project Deadline</h4>

              <div className='tw-flex tw-items-center tw-mb-[10px]'>
                <input type="checkbox" id="recurring" name="recurring" onChange={handleRecurring} className='tw-w-[12px] tw-h-[12px] tw-mr-[10px] tw-mt-0'/>
                <label for="recurring" className='tw-text-[12px]'>Project Recurring</label>
              </div>

              {!isRecurring ? (
                <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"secondary"}
                    className={cn(
                      "tw-w-auto tw-justify-start tw-text-left tw-font-normal tw-text-gray-300 tw-border tw-border-input tw-hover:bg-secondary/10 tw-bg-background tw-important",
                      !date && "tw-text-muted-foreground"
                    )}>
                    <CalendarIcon className="tw-mr-2 tw-h-4 tw-w-4" />
                    {date ? format(date, "PPP") : <div>Pick a date</div>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="tw-w-auto tw-p-0 tw-bg-background tw-z-[2000]">
                  <Calendar 
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              ) : null}

              <div className='tw-flex t-items-center tw-mt-[20px]'>
                <h3 className='tw-flex-1'>Team Code</h3>
                <Tooltip title={result} id='copyText'>
                  <h4 className={isCopied ? "tw-mr-[20px] tw-text-[#00FF00]" : "tw-mr-[20px] tw-text-[#5BCEFF]"} id = "code" onClick={handleCopy}>{generateTeamCode()}</h4>
                </Tooltip>
                <div id='copyIcon' className='tw-bg-[#272727] tw-pl-2 tw-pr-2 tw-rounded-[5px]'>
                {isCopied ? (
                  <IOIcons.IoMdDoneAll className='tw-text-[#00FF00] hover:tw-opacity-[70%] tw-cursor-copy t-w-[25px] tw-h-[25px]'/>
                ) : (
                  <IOSIcons.IoCopy className='tw-text-[#5BCEFF] hover:tw-opacity-[70%] tw-cursor-copy t-w-[25px] tw-h-[25px]' onClick={handleCopy}/>
                )}
                </div>
              </div>

              <div className='tw-flex tw-items-center tw-mt-[20px]'>
                <h4 className='tw-text-[15px] tw-flex-1'>Team Invite</h4>
                <div id='copyIcon' className='tw-bg-[#272727] tw-pl-2 tw-pr-2 tw-rounded-[5px]'>
                  {isInviteCopied ? (
                    <IOIcons.IoMdDoneAll className='tw-text-[#00FF00] hover:tw-opacity-[70%] tw-cursor-copy t-w-[25px] tw-h-[25px]'/>
                  ) : (
                    <IOSIcons.IoCopy className='tw-text-[#5BCEFF] hover:tw-opacity-[70%] tw-cursor-copy t-w-[25px] tw-h-[25px]' onClick={handleInviteCopy}/>
                  )}
                  </div>
              </div>
              <textarea rows={5} readOnly className='tw-bg-zinc-900 tw-text-white tw-mt-[15px] tw-w-full ' name="teamDescription" value={inviteHtml} id='textInvite'>
              </textarea>

              <input type='submit' className='tw-w-[90px] tw-h-[40px] tw-text-[12px] tw-text-black tw-bg-[#5BCEFF] tw-border-none hover:tw-opacity-[80%] tw-cursor-pointer tw-absolute tw-right-0 tw-bottom-1'/>
            </form>
          </div>
            <div className='tw-h-[20px]'></div>        
        </Card>
    </div>

    </>
  )

  function generateTeamCode() {
    let teamCode = "10987656"
    return teamCode
  }
  
  function generateInvite(teamName, teamCode) {
    handleInvite(
    `Join Team ${teamName}! 🎉

Hello User,

You're invited to a team on SYNK where you can work together with the others on a project.

Team Name: ${teamName}
Team Code: ${teamCode}
    
Looking forward to seeing you there in contributing to quality work.

Best regards,
${auth.currentUser.displayName}
Team Leader`
    )
  }

}

export default Teams
