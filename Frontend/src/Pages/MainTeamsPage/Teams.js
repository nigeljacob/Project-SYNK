import { Tooltip } from "@mui/material";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import * as AIIcons from "react-icons/ai";
import * as IOIcons from "react-icons/io";
import * as IOSIcons from "react-icons/io5";
import { auth } from "../../utils/firebase";
import {
  createTeam,
  fetchTeams,
  joinTeam,
  sendNotification,
} from "../../utils/teamFunctions";
import loader from "../../assets/images/loader.gif";
import TeamComponent from "../../components/TeamComponent/TeamComponent.jsx";
import { cn } from "../../shadCN-UI/lib/utils";
import { Button } from "../../shadCN-UI/ui/button";
import { Calendar } from "../../shadCN-UI/ui/calendar";
import { Card } from "../../shadCN-UI/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../shadCN-UI/ui/popover";
import "./Teams.css";
import { readOnceFromDatabase, read_OneValue_from_Database } from "../../utils/firebaseCRUD";
import Loading from "../LoadingPage/LoadingPage";
const electronApi = window?.electronApi;


function Teams() {
  let [teamOwnList, setTeamOwnList] = useState([]);
  let [teamInList, setTeamInList] = useState([]);
  let [teamPendingList, setTeamPendingList] = useState([]);
  let [allTeams, setAllTeams] = useState([]);

  let [isLoading, setLoading] = useState(false);


  const sendMessage = () => {
    electronApi.sendMessageToMain('Hello from renderer process!');
  }

  const handleLoad = (boolean) => {
    setLoading(boolean);
  };

  const fetchAllTeams = (toLoad) => {
    if (toLoad) {
      handleLoad(true);
    }

    const onDataReceived = (dataList) => {
      setAllTeams(dataList);
      let OwnedTeamList = [];
      let JoinTeamList = [];
      let PendingTeamList = [];
      
      if (dataList.length > 0) {
        for (let i = 0; i < dataList.length; i++) {
          const element = dataList[i];
          if (element["teamLeader"]["UID"] === auth.currentUser.uid) {
            if (
              !teamOwnList.some((item) => item.teamCode === element.teamCode)
            ) {
              OwnedTeamList.push(element);
            }
          } else if (element["teamMemberList"].some((item) => item.UID === auth.currentUser.uid)) {
            JoinTeamList.push(element);
          } else {

            for(let i =0; i < element["teamPendingInvites"].length; i++) {
              if(element["teamPendingInvites"][i].UID === auth.currentUser.uid) {
                element["teamStatus"] = "Pending";
                PendingTeamList.push(element);
                break;
              }
            }
          }
        }
      }

      setTeamOwnList(OwnedTeamList);
      setTeamInList(JoinTeamList);
      setTeamPendingList(PendingTeamList);

      if (toLoad) {
        handleLoad(false);
      }
    };

    fetchTeams(onDataReceived);
  };

  useEffect(() => {
    fetchAllTeams(true);
  }, []);

  let git = false

  const [isOpen, setIsOpen] = useState(false);

  const SideBarResult = isOpen
    ? "popupLayout show_popup"
    : "popupLayout hide_popup";

  const [date, setDate] = useState(new Date());

  const [isRecurring, setRecurring] = useState(false);

  const [teamCode, setTeamCode] = useState("");

  const [teamName, setTeamName] = useState("");

  const [teamDescription, setReamDescription] = useState("");

  const [inviteHtml, setInviteHtml] = useState("");

  const [projectType, setProjectType] = useState("induvidualasked");

  const [gitConnected, setGitConnected] = useState("notConnected");

  const [useGit, setUseGit] = useState(false);

  const [gitType, setGitType] = useState("");

  const [directoryPath, setDirectoryPath] = useState(
    "Click here to Select Folder"
  );

  const [addReadme, setReadMe] = useState(false);

  const [isCopied, setCopied] = useState(false);

  const [isInviteCopied, setInviteCopied] = useState(false);

  const result = !isCopied ? "Copy" : "Copied";

  const fileInputRef = useRef(null);

  const [GithubBranches, setGithubBranches] = useState([]);

  const handleInvite = (invite) => {
    setInviteHtml(invite);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();

    if (projectType === "induvidualasked") {
      if(isRecurring) {
        createTeam(
          teamCode,
          teamName,
          "",
          teamDescription,
          "",
          projectType,
          useGit
        ).then(() => {
          let popupLayout = document.getElementById("popupLayout");
          let joinPopup = document.getElementById("JoinTeamPopup");
          let createPopup = document.getElementById("createTeamPopup");
          if (!isOpen) {
            popupLayout.style.visibility = "visible";
          } else {
            popupLayout.style.visibility = "hidden";
            joinPopup.style.visibility = "hidden";
            createPopup.style.visibility = "hidden";
            popupLayout.style.background = "rgba(0,0,0,0)";
          }

          sendNotification("Team Created Successfully", "Team " + teamName + " was created successfully. You can now view the team in the teams panel", "success", auth.currentUser.uid, "success", auth.currentUser.uid)
          setIsOpen(!isOpen);
          setTeamName("");
          setReamDescription("")
          setDate(new Date())
          setInviteHtml("")
        });
      } else {
        if (date < new Date()) {
        alert("project deadlines cannot be past");
        return;
      }

      let month = date.getMonth() + 1;

      createTeam(
        teamCode,
        teamName,
        "",
        teamDescription,
        date.getDate().toString() +
          "/" +
          month +
          "/" +
          date.getFullYear().toString(),
        projectType,
        useGit
      ).then(() => {
        let popupLayout = document.getElementById("popupLayout");
        let joinPopup = document.getElementById("JoinTeamPopup");
        let createPopup = document.getElementById("createTeamPopup");
        if (!isOpen) {
          popupLayout.style.visibility = "visible";
        } else {
          popupLayout.style.visibility = "hidden";
          joinPopup.style.visibility = "hidden";
          createPopup.style.visibility = "hidden";
          popupLayout.style.background = "rgba(0,0,0,0)";
        }

        sendNotification("Team Created Successfully", "Team " + teamName + " was created successfully. You can now view the team in the teams panel", "success", auth.currentUser.uid, "success", auth.currentUser.uid)
        setIsOpen(!isOpen);
        setTeamName("");
        setReamDescription("")
        setDate(new Date())
        setInviteHtml("")
      });
      }
    }
  };

  const [joinTeamCode, setJoinTeamCode] = useState("");

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    const onRequestSent = (data) => {
      if (data === "success") {
        let popupLayout = document.getElementById("popupLayout");
        let joinPopup = document.getElementById("JoinTeamPopup");
        let createPopup = document.getElementById("createTeamPopup");
        if (!isOpen) {
          popupLayout.style.visibility = "visible";
        } else {
          popupLayout.style.visibility = "hidden";
          joinPopup.style.visibility = "hidden";
          createPopup.style.visibility = "hidden";
          popupLayout.style.background = "rgba(0,0,0,0)";
        }

        setIsOpen(!isOpen);
        setJoinTeamCode("");

        sendNotification("Sent Successfully", "Join Request successfuly sent to team admin", "success", auth.currentUser.uid, "success", auth.currentUser.uid)

      } else if (data === "alreadyJoined") {
        sendNotification("Already Joined", "You have already joined this team as a member", "warning", auth.currentUser.uid, "error", auth.currentUser.uid)
      } else if(data === "alreadySent") {
        sendNotification("Join Request sent already", "A join request to this team has been sent to the admin already", "warning", auth.currentUser.uid, "error", auth.currentUser.uid)
      } else {
        sendNotification("Failed to join team", "An error occured while trying to join a team", "danger", auth.currentUser.uid, "error", auth.currentUser.uid)

      }
    };
    joinTeam(joinTeamCode, onRequestSent);
  };

  const handleCopy = () => {
    let code = document.getElementById("code");
    navigator.clipboard.writeText(code.textContent);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 5000);
  };

  const handleInviteCopy = () => {
    let teaxtArea = document.getElementById("textInvite");
    navigator.clipboard.writeText(teaxtArea.value);
    setInviteCopied(true);
    setTimeout(() => {
      setInviteCopied(false);
    }, 5000);
  };

  const handleRecurring = (checkbox) => {
    if (checkbox.target.checked) {
      if (!isRecurring) {
        setRecurring(true);
      }
    } else {
      if (isRecurring) {
        setRecurring(false);
      }
    }
  };

  const handleUseGit = (checkbox) => {
    if (checkbox.target.checked) {
      if (!useGit) {
        setUseGit(true);
      }
    } else {
      if (useGit) {
        setUseGit(false);
      }
    }
  };

  const handleAddReadMe = (checkbox) => {
    if (checkbox.target.checked) {
      if (!addReadme) {
        setReadMe(true);
      }
    } else {
      if (addReadme) {
        setReadMe(false);
      }
    }
  };

  const handleFolderChange = (event) => {
    const folderPath = event.target.files[0].path
      .split("/")
      .slice(0, -1) // Remove the last element (file name)
      .join("/");
    setDirectoryPath(folderPath);
    // Now you can use folderPath as needed, such as configuring a Git repository
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      {isLoading ? (
        <Loading message="Loading Teams" background={false} />
      ) : (
        <>
          <div className="teams">
            {teamOwnList.length + teamInList.length + teamPendingList.length >
            0 ? (
              <>
                {teamOwnList.length > 0 ? (
                  <>
                    <h2>Teams you own</h2>
                    <div className="teamsYouOwn">
                      {teamOwnList.map((item, index) => {
                        return <TeamComponent team={teamOwnList[index]} teamsList={allTeams}/>;
                      })}
                    </div>
                  </>
                ) : null}

                {teamInList.length > 0 ? (
                  <>
                    <h2>Teams your in</h2>
                    <div className="teamsYourIn">
                      {teamInList.map((item, index) => {
                        return <TeamComponent team={teamInList[index]} teamsList={allTeams}/>;
                      })}
                    </div>
                  </>
                ) : null}

                {teamPendingList.length > 0 ? (
                  <>
                    <h2>Pending Teams</h2>
                    <div className="pendingTeams">
                      {teamPendingList.map((item, index) => {
                        return <TeamComponent team={teamPendingList[index]} teamsList={allTeams}/>;
                      })}
                    </div>
                  </>
                ) : null}
              </>
            ) : (
              <div className="tw-h-full tw-flex tw-items-center tw-justify-center tw-mb-[60px]">
                <h2 className="tw-text-center tw-text-[#A7A7A7]">
                  ⓘ No teams created yet
                </h2>
              </div>
            )}

            <div className="tw-h-[50px]"><br></br></div>

            <div className="joinButtons">
              <div
                className="button"
                onClick={(event) => {
                  let popupLayout = document.getElementById("popupLayout");
                  let popup = document.getElementById("JoinTeamPopup");
                  if (isOpen) {
                    popup.style.visibility = "hidden";
                    popupLayout.style.background = "rgba(0,0,0,0)";
                  } else {
                    popupLayout.style.visibility = "visible";
                    popup.style.visibility = "visible";
                    setTimeout(() => {
                      popupLayout.style.background = "rgba(0,0,0,0.7)";
                    }, 100);
                  }

                  setIsOpen(!isOpen);
                }}
              >
                <h4>Join Team</h4>
              </div>
              <div
                className="button"
                onClick={(event) => {
                  let popupLayout = document.getElementById("popupLayout");
                  let popup2 = document.getElementById("createTeamPopup");
                  if (isOpen) {
                    popup2.style.visibility = "hidden";
                    popupLayout.style.background = "rgba(0,0,0,0)";
                  } else {
                    popupLayout.style.visibility = "visible";
                    popup2.style.visibility = "visible";
                    setTimeout(() => {
                      popupLayout.style.background = "rgba(0,0,0,0.7)";
                    }, 100);
                  }

                  generateTeamCode();
                  setIsOpen(!isOpen);
                }}
              >
                <h4>Create Team</h4>
              </div>
            </div>
          </div>
          <div className={SideBarResult} id="popupLayout">
            <Card
              className="tw-w-[500px] tw-h-[400px] tw-border-none tw-bg-zinc-900 tw-relative JoinTeamPopup"
              id="JoinTeamPopup"
            >
              <div className="tw-flex tw-items-center tw-p-5">
                <h3 className="tw-text-[18px]">Join Team</h3>
                <IOSIcons.IoClose
                  className="tw-w-[30px] tw-h-[30px] tw-absolute tw-right-5 tw-cursor-pointer hover:tw-text-[#A7A7A7]"
                  onClick={(event) => {
                    let popupLayout = document.getElementById("popupLayout");
                    let joinPopup = document.getElementById("JoinTeamPopup");
                    let createPopup =
                      document.getElementById("createTeamPopup");
                    if (!isOpen) {
                      popupLayout.style.visibility = "visible";
                    } else {
                      popupLayout.style.visibility = "hidden";
                      joinPopup.style.visibility = "hidden";
                      createPopup.style.visibility = "hidden";
                      popupLayout.style.background = "rgba(0,0,0,0)";
                    }

                    setIsOpen(!isOpen);
                  }}
                />
              </div>

              <div className="tw-mr-[30px] tw-ml-[30px] tw-mt-[50px] tw-relative tw-h-[180px]">
                <h4 className="tw-text-[15px]">Enter Team Code</h4>
                <form onSubmit={handleJoinSubmit}>
                  <input
                    type="number"
                    required
                    className="tw-bg-zinc-900 tw-text-white tw-mt-[15px]"
                    name="teamCode"
                    value={joinTeamCode}
                    onChange={(e) => {
                      setJoinTeamCode(e.target.value);
                    }}
                  />
                  <input
                    type="submit"
                    className="tw-w-[90px] tw-h-[40px] tw-text-[12px] tw-text-black tw-bg-[#5BCEFF] tw-border-none hover:tw-opacity-[80%] tw-cursor-pointer tw-absolute tw-right-0 tw-bottom-0"
                  />
                </form>
              </div>
            </Card>

            <Card
              className="tw-w-[500px] tw-h-[550px] tw-border-none tw-bg-zinc-900 tw-relative createTeamPopup tw-overflow-x-scroll"
              id="createTeamPopup"
            >
              <div className="tw-flex tw-items-center tw-p-5 tw-sticky tw-top-0 tw-bg-zinc-900 tw-z-[1000]">
                <h3 className="tw-text-[18px]">Create Team</h3>
                <IOSIcons.IoClose
                  className="tw-w-[30px] tw-h-[30px] tw-absolute tw-right-5 tw-cursor-pointer hover:tw-text-[#A7A7A7]"
                  onClick={(event) => {
                    let popupLayout = document.getElementById("popupLayout");
                    let joinPopup = document.getElementById("JoinTeamPopup");
                    let createPopup =
                      document.getElementById("createTeamPopup");
                    if (!isOpen) {
                      popupLayout.style.visibility = "visible";
                    } else {
                      popupLayout.style.visibility = "hidden";
                      joinPopup.style.visibility = "hidden";
                      createPopup.style.visibility = "hidden";
                      popupLayout.style.background = "rgba(0,0,0,0)";
                    }

                    setIsOpen(!isOpen);
                  }}
                />
              </div>

              <div className="tw-mr-[30px] tw-ml-[30px] tw-mt-[30px] tw-relative tw-pb-[70px]">
                <form onSubmit={handleCreateSubmit}>
                  <h4 className="tw-text-[15px]">Team Name</h4>
                  <input
                    type="text"
                    value={teamName}
                    required
                    className="tw-bg-zinc-900 tw-text-white tw-mt-[15px]"
                    name="teamName"
                    onChange={(event) => {
                      generateInvite(
                        event.target.value,
                        document.getElementById("code").textContent
                      );
                      setTeamName(event.target.value);
                    }}
                  />

                  <h4 className="tw-text-[15px] tw-mt-[20px]">
                    Team Description
                  </h4>
                  <textarea
                    rows={5}
                    required
                    value={teamDescription}
                    className="tw-bg-zinc-900 tw-text-white tw-mt-[15px] tw-w-full "
                    name="teamDescription"
                    onChange={(event) => {
                      setReamDescription(event.target.value);
                    }}
                  >
                    {" "}
                  </textarea>

                  <h4 className="tw-text-[15px] tw-mt-[20px] tw-mb-[10px]">
                    Project Deadline
                  </h4>

                  <div className="tw-flex tw-items-center tw-mb-[10px]">
                    <input
                      type="checkbox"
                      id="recurring"
                      value={isRecurring}
                      name="recurring"
                      onChange={handleRecurring}
                      className="tw-w-[12px] tw-h-[12px] tw-mr-[10px] tw-mt-0"
                    />
                    <label for="recurring" className="tw-text-[12px]">
                      Project Recurring
                    </label>
                  </div>

                  {!isRecurring ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"secondary"}
                          className={cn(
                            "tw-w-auto tw-justify-start tw-text-left tw-font-normal tw-text-gray-300 tw-border tw-border-input tw-hover:bg-secondary/10 tw-bg-background tw-important",
                            !date && "tw-text-muted-foreground"
                          )}
                        >
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

                  {/* github intergration UI */}

                  {git && (
                    <>
                      <h4 className="tw-text-[15px] tw-mt-[20px] tw-mb-[10px]">
                    Project Type
                  </h4>
                  <div className="tw-flex tw-items-center tw-mb-[20px]">
                    <select
                      name="projectType"
                      className="tw-text-black tw-text-[13px] tw-p-[5px] tw-rounded-[5px] tw-mr-[10px]"
                      onChange={(event) => {
                        setProjectType(event.target.value);
                      }}
                      required
                    >
                      <option value="collaborativeProject" selected>
                        Collaboration Project
                      </option>
                      <option value="induvidualasked">
                        Induvidual-Tasked Project
                      </option>
                      <option value="both">Both</option>
                    </select>

                    <Tooltip title="For collaboration, select 'Collaborative' otherwise, 'Individual'. You can select both as well.">
                      <div>
                        <AIIcons.AiFillQuestionCircle className="tw-cursor-pointer" />
                      </div>
                    </Tooltip>
                  </div>

                  {projectType === "collaborativeProject" ||
                  projectType === "both" ? (
                    <div className="tw-flex tw-items-center tw-mb-[10px]">
                      <input
                        type="checkbox"
                        id="recurring"
                        name="recurring"
                        onChange={handleUseGit}
                        className="tw-w-[12px] tw-h-[12px] tw-mr-[10px] tw-mt-0"
                      />
                      <label
                        for="recurring"
                        className="tw-text-[12px] tw-mr-[10px]"
                      >
                        Use Git
                      </label>
                      <Tooltip title="You can use git for file merging in your project. This will enable editing on the same file by multiple users. (Recommended for coding projects)">
                        <div>
                          <AIIcons.AiFillQuestionCircle className="tw-cursor-pointer" />
                        </div>
                      </Tooltip>
                    </div>
                  ) : null}

                  {useGit ? (
                    <>
                      <hr></hr>
                      <h4 className="tw-text- [15px] tw-mt-[20px] tw-mb-[10px]">
                        How do you want to use git
                      </h4>

                      <div className="tw-flex tw-items-center">
                        {gitType === "createGit" ? (
                          <input
                            type="radio"
                            checked
                            id="createGit"
                            name="gitType"
                            value="CreateGitRepository"
                            className="tw-w-[12px] tw-mr-[10px] tw-mt-0"
                            onClick={(event) => {
                              setGitType("createGit");
                            }}
                          />
                        ) : (
                          <input
                            type="radio"
                            id="createGit"
                            name="gitType"
                            value="CreateGitRepository"
                            className="tw-w-[12px] tw-mr-[10px] tw-mt-0"
                            onClick={(event) => {
                              setGitType("createGit");
                            }}
                          />
                        )}
                        <label
                          for="createGit"
                          className="tw-text-[12px] tw-mt-0"
                        >
                          Create Git Repository
                        </label>
                        <br></br>
                      </div>

                      <div className="tw-flex tw-items-center tw-mb-[20px]">
                        {gitType === "cloneGit" ? (
                          <input
                            type="radio"
                            checked
                            id="cloneGit"
                            name="gitType"
                            value="CreateGitRepository"
                            className="tw-w-[12px] tw-mr-[10px] tw-mt-0"
                            onClick={(event) => {
                              setGitType("cloneGit");
                            }}
                          />
                        ) : (
                          <input
                            type="radio"
                            id="cloneGit"
                            name="gitType"
                            value="CreateGitRepository"
                            className="tw-w-[12px] tw-mr-[10px] tw-mt-0"
                            onClick={(event) => {
                              setGitType("cloneGit");
                            }}
                          />
                        )}
                        <label
                          for="cloneGit"
                          className="tw-text-[12px] tw-mt-0"
                        >
                          Clone exisitng into local folder
                        </label>
                      </div>

                      {gitType === "createGit" ? (
                        <div>
                          <form>
                            <h4 className="tw-text-[15px]">
                              Github Access Token{" "}
                              <span className="tw-ml-[10px]">-</span>
                              {gitConnected === "notConnected" ? (
                                <span className="tw-ml-[10px] tw-text-[#FF0000] tw-cursor-pointer">
                                  Not Connected
                                </span>
                              ) : gitConnected === "connecting" ? (
                                <span className="tw-ml-[10px] tw-text-[#FF0000] tw-cursor-pointer">
                                  Connecting
                                </span>
                              ) : (
                                <span className="tw-ml-[10px] tw-text-[#FF0000] tw-cursor-pointer">
                                  Connected
                                </span>
                              )}
                            </h4>
                            <div className="tw-flex tw-items-center">
                              <input
                                type="text"
                                required
                                className="tw-bg-zinc-900 tw-text-white tw-mb-[10px] tw-mr-[10px]"
                                name="teamName"
                                onKeyDown={(event) => {
                                  if (event.code === "Space") {
                                    event.preventDefault();
                                  }
                                }}
                              />
                              {gitConnected === "notConnected" ? (
                                <h3 className="tw-text-[#5BCEFF] tw-cursor-pointer">
                                  Connect
                                </h3>
                              ) : gitConnected === "connecting" ? (
                                <img
                                  src={loader}
                                  alt="loader"
                                  className="tw-w-[40px]"
                                />
                              ) : (
                                <IOIcons.IoIosDoneAll className="tw-w-[30px] tw-h-[30px] tw-text-[#00FF00]" />
                              )}
                            </div>

                            <div className="tw-flex tw-items-center tw-mb-[15px]">
                              <h5 className="tw-text-[#A7A7A7] tw-text-[10px] tw-mr-[10px]">
                                input your github access token above and click
                                on connect once complete
                              </h5>
                              <Tooltip title="Visit github website. Go to Settings > Developer Settings > Personal Access Token > Generate Token. Fill in the details and give access to all permissions. Generate the token and copy it.">
                                <div>
                                  <AIIcons.AiFillQuestionCircle className="tw-cursor-pointer" />
                                </div>
                              </Tooltip>
                            </div>

                            <h4 className="tw-text-[15px]">
                              Git Repository Name
                            </h4>
                            <input
                              type="text"
                              required
                              className="tw-bg-zinc-900 tw-text-white tw-mt-[15px]"
                              name="gitName"
                              onKeyDown={(event) => {
                                if (event.code === "Space") {
                                  event.preventDefault();
                                }
                              }}
                            />

                            <h4 className="tw-text-[15px] tw-mt-[20px]">
                              Git Repository Description
                            </h4>
                            <textarea
                              rows={5}
                              required
                              className="tw-bg-zinc-900 tw-text-white tw-mt-[15px] tw-w-full "
                              name="gitDescription"
                            >
                              {" "}
                            </textarea>

                            <h4 className="tw-text-[15px] tw-mt-[20px] tw-mb-[10px]">
                              Git Repository Visibility
                            </h4>
                            <div className="tw-flex tw-items-center tw-mb-[20px]">
                              <select
                                name="gitRepositoryVisibility"
                                className="tw-text-black tw-text-[13px] tw-p-[5px] tw-rounded-[5px] tw-mr-[10px]"
                                required
                              >
                                <option value="Public" selected>
                                  Public
                                </option>
                                <option value="Private">Private</option>
                              </select>

                              <Tooltip title="For anyone to view the repository, select 'Public' otherwise, 'Private' which can only be viewable using the link">
                                <div>
                                  <AIIcons.AiFillQuestionCircle className="tw-cursor-pointer" />
                                </div>
                              </Tooltip>
                            </div>

                            <h4 className="tw-text-[15px] tw-mt-[20px]">
                              Add Branches
                            </h4>

                            {GithubBranches.map((info, index) => {
                              return (
                                <div key={index} className="tw-mt-[10px]">
                                  <h4 className="tw-text-[15px]">
                                    Branch {index + 1}
                                  </h4>
                                  <div className="tw-flex tw-items-center tw-mt-[5px]">
                                    <input
                                      type="text"
                                      required
                                      className="tw-bg-zinc-900 tw-text-white"
                                      name={`gitName_${index}`}
                                      onKeyDown={(event) => {
                                        if (event.code === "Space") {
                                          event.preventDefault();
                                        }
                                      }}
                                    />
                                    <IOIcons.IoIosAddCircle className="tw-w-[25px] tw-h-[25px] tw-ml-[10px] tw-text-[#5BCEFF] tw-cursor-pointer" />
                                  </div>
                                </div>
                              );
                            })}

                            <div
                              className="tw-p-[10px] tw-bg-[#272727] tw-rounded-[10px] tw-mb-[20px] tw-mt-[10px] tw-cursor-pointer"
                              onClick={(event) => {
                                const newBranches = [...GithubBranches, ""];
                                // Update the state with the new array
                                setGithubBranches(newBranches);
                              }}
                            >
                              <h1 className="tw-text-center">Add New Branch</h1>
                            </div>

                            <div className="tw-flex tw-items-center">
                              <input
                                type="submit"
                                value="Create Repo"
                                className="tw-w-[90px] tw-h-[40px] tw-text-[12px] tw-text-black tw-bg-[#5BCEFF] tw-border-none hover:tw-opacity-[80%] tw-cursor-pointer"
                              />
                              <h3 className="tw-text-[12px] tw-text-[#FF0000] tw-ml-[10px]">
                                Not Created Yet
                              </h3>
                            </div>
                          </form>

                          <form>
                            <h4 className="tw-text-[15px] tw-mt-[20px] tw-mb-[10px]">
                              Project Folder
                            </h4>
                            <input
                              type="file"
                              webkitdirectory=""
                              onChange={handleFolderChange}
                              ref={fileInputRef}
                              className="tw-text-[#A7A7A7]"
                              style={{ display: "none" }}
                            />
                            <div className="tw-max-w-[500px] tw-overflow-scroll tw-flex tw-items-center tw-justify-center">
                              <p
                                className="tw-text-[15px] tw-text-[#E7E7E7] tw-mt-[10px] tw-cursor-pointer"
                                onClick={handleClick}
                              >
                                {directoryPath}
                              </p>
                            </div>

                            <h4 className="tw-text-[15px] tw-mt-[20px] tw-mb-[10px]">
                              Local Git Repo Configuration
                            </h4>

                            <div className="tw-flex tw-items-center tw-mb-[10px] tw-mt-[10px]">
                              <input
                                type="checkbox"
                                id="recurring"
                                name="recurring"
                                onChange={handleAddReadMe}
                                className="tw-w-[12px] tw-h-[12px] tw-mr-[10px] tw-mt-0"
                              />
                              <label
                                for="recurring"
                                className="tw-text-[12px] tw-mr-[10px]"
                              >
                                Add ReadMe File
                              </label>
                              <Tooltip title="Add a ReadMe file to your git repo">
                                <div>
                                  <AIIcons.AiFillQuestionCircle className="tw-cursor-pointer" />
                                </div>
                              </Tooltip>
                            </div>

                            {addReadme ? (
                              <>
                                <h4 className="tw-text-[15px] tw-mt-[20px]">
                                  ReadMe file Text
                                </h4>
                                <textarea
                                  rows={5}
                                  required
                                  className="tw-bg-zinc-900 tw-text-white tw-mt-[15px] tw-w-full "
                                  name="gitDescription"
                                >
                                  {" "}
                                </textarea>{" "}
                              </>
                            ) : null}

                            <div className="tw-flex tw-items-center tw-mb-[10px] tw-mt-[10px]">
                              <input
                                type="submit"
                                value="Make Initial Commit & Push"
                                className="tw-w-fit tw-h-[40px] tw-text-[12px] tw-text-black tw-bg-[#5BCEFF] tw-border-none hover:tw-opacity-[80%] tw-cursor-pointer"
                              />
                              <h3 className="tw-text-[12px] tw-text-[#FF0000] tw-ml-[10px]">
                                Not Pushed Yet
                              </h3>
                            </div>
                          </form>
                        </div>
                      ) : gitType === "cloneGit" ? (
                        <>
                          <h4 className="tw-text-[15px] tw-mt-[20px] tw-mb-[10px]">
                            Folder to Clone Repository
                          </h4>
                          <input
                            type="file"
                            webkitdirectory=""
                            onChange={handleFolderChange}
                            ref={fileInputRef}
                            className="tw-text-[#A7A7A7]"
                            style={{ display: "none" }}
                          />
                          <div className="tw-max-w-[500px] tw-overflow-scroll tw-flex tw-items-center tw-justify-center tw-mb-[10px]">
                            <p
                              className="tw-text-[15px] tw-text-[#E7E7E7] tw-mt-[10px] tw-cursor-pointer"
                              onClick={handleClick}
                            >
                              {directoryPath}
                            </p>
                          </div>

                          <h4 className="tw-text-[15px]">
                            Git Repository Link
                          </h4>
                          <input
                            type="text"
                            placeholder="https://github.com/userName/exampleRepo"
                            required
                            className="tw-bg-zinc-900 tw-text-white tw-mt-[15px]"
                            name="gitName"
                            onKeyDown={(event) => {
                              if (event.code === "Space") {
                                event.preventDefault();
                              }
                            }}
                          />

                          <div className="tw-flex tw-items-center tw-mb-[10px] tw-mt-[10px]">
                            <input
                              type="submit"
                              value="Clone Repo to Directory"
                              className="tw-w-fit tw-h-[40px] tw-text-[12px] tw-text-black tw-bg-[#5BCEFF] tw-border-none hover:tw-opacity-[80%] tw-cursor-pointer"
                            />
                            <h3 className="tw-text-[12px] tw-text-[#FF0000] tw-ml-[10px]">
                              Not Cloned Yet
                            </h3>
                          </div>
                        </>
                      ) : null}
                      <hr></hr>
                    </>
                  ) : null}
                    </>
                  )}

                  <div className="tw-flex t-items-center tw-mt-[20px]">
                    <h3 className="tw-flex-1">Team Code</h3>
                    <Tooltip title={result} id="copyText">
                      <h4
                        className={
                          isCopied
                            ? "tw-mr-[20px] tw-text-[#00FF00]"
                            : "tw-mr-[20px] tw-text-[#5BCEFF]"
                        }
                        id="code"
                        onClick={handleCopy}
                      >
                        {teamCode}
                      </h4>
                    </Tooltip>
                    <div
                      id="copyIcon"
                      className="tw-bg-[#272727] tw-pl-2 tw-pr-2 tw-rounded-[5px]"
                    >
                      {isCopied ? (
                        <IOIcons.IoMdDoneAll className="tw-text-[#00FF00] hover:tw-opacity-[70%] tw-cursor-copy t-w-[25px] tw-h-[25px]" />
                      ) : (
                        <IOSIcons.IoCopy
                          className="tw-text-[#5BCEFF] hover:tw-opacity-[70%] tw-cursor-copy t-w-[25px] tw-h-[25px]"
                          onClick={handleCopy}
                        />
                      )}
                    </div>
                  </div>

                  <div className="tw-flex tw-items-center tw-mt-[20px]">
                    <h4 className="tw-text-[15px] tw-flex-1">Team Invite</h4>
                    <div
                      id="copyIcon"
                      className="tw-bg-[#272727] tw-pl-2 tw-pr-2 tw-rounded-[5px]"
                    >
                      {isInviteCopied ? (
                        <IOIcons.IoMdDoneAll className="tw-text-[#00FF00] hover:tw-opacity-[70%] tw-cursor-copy t-w-[25px] tw-h-[25px]" />
                      ) : (
                        <IOSIcons.IoCopy
                          className="tw-text-[#5BCEFF] hover:tw-opacity-[70%] tw-cursor-copy t-w-[25px] tw-h-[25px]"
                          onClick={handleInviteCopy}
                        />
                      )}
                    </div>
                  </div>
                  <textarea
                    rows={5}
                    readOnly
                    className="tw-bg-zinc-900 tw-text-white tw-mt-[15px] tw-w-full "
                    name="teamDescription"
                    value={inviteHtml}
                    id="textInvite"
                  ></textarea>

                  <input
                    type="submit"
                    value="Create Team"
                    className="tw-w-fit tw-h-[40px] tw-text-[12px] tw-text-black tw-bg-[#5BCEFF] tw-border-none hover:tw-opacity-[80%] tw-cursor-pointer tw-absolute tw-right-0 tw-bottom-1"
                  />
                </form>
              </div>
              <div className="tw-h-[20px]"></div>
            </Card>
          </div>
        </>
      )}
    </>
  );

  function generateTeamCode() {
    let teamCode = Math.random() * 99999999;
    teamCode = Math.floor(teamCode);

    const onDataReceived = (teamCodes) => {
      if (teamCodes == null) {
        setTeamCode(teamCode);
      } else {
        generateTeamCode();
      }
    };
    readOnceFromDatabase("TeamCodes/" + teamCode, onDataReceived);
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
    );
  }
}

export default Teams;
