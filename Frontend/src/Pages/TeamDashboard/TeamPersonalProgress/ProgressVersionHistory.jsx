import React, { useEffect, useState } from "react";
import * as IOIcons from "react-icons/io";
import FolderViewer from "../../../components/FolderViewer/FolderViewer";
import TeamYourProgress from "../TeamPersonalProgress/TeamYourProgress";
import { getVersions } from "../../../utils/AssignTask/taskFunctions";
import { FaDownload } from "react-icons/fa6";
import axios from "axios";
import download from "downloadjs";
import "./ProgressVersionHistory.css";
import { CircularProgress, Tooltip } from "@mui/material";
import { version } from "jszip";
import { sendNotification } from "../../../utils/teamFunctions";
import { auth } from "../../../utils/firebase";

const ProgressVersionHistory = (props) => {
  const goBack = () => {
    if (props.previous === "TEAM_PERSONAL_VERSION") {
      props.elementStringTrigger("TEAM_PERSONAL_PROGRESS");
    } else {
      props.elementStringTrigger("TEAM_MEMBER_PROGRESS");
    }
    props.setElement(
      <TeamYourProgress
        team={props.team}
        sideBarStatus={props.sideBarStatus}
        elementTrigger={props.setElement}
        elementStringTrigger={props.elementStringTrigger}
        UID={props.UID}
      />
    );
  };

  const [versions, setVersions] = useState([]);

  let taskName = "";

  const [taskPath, setTaskPath] = useState("");

  const [selectedVersion, setSelectedVersion] = useState(0);

  const [downloadingVersion, setDownloadingVersion] = useState(-1);

  const [isLoading, setLoading] = useState(false);

  const downloadZipFile = async (url, folderName) => {
    try {
      const response = await axios.get(url, { responseType: "blob" });
      const blob = new Blob([response.data]);

      download(blob, `${folderName}.zip`);
      setLoading(false);
      setDownloadingVersion(-1);
    } catch (error) {
      sendNotification(
        "Error Downloading File",
        "An unexpected error occurred while downloading the file",
        "danger",
        auth.currentUser.uid,
        "error",
        auth.currentUser.uid
      );
    }
  };

  useEffect(() => {
    let teamMemberIndex = props.team.teamMemberList.findIndex(
      (member) => member.UID === props.UID
    );

    taskName =
      props.team.teamMemberList[teamMemberIndex].taskList[props.index].taskName;

    setTaskPath(
      props.team.teamMemberList[teamMemberIndex].taskList[props.index].filePath
    );

    getVersions(
      props.index,
      props.team,
      teamMemberIndex,
      props.UID,
      (versionList) => {
        if (versionList[0] != "") {
          setVersions(versionList.reverse());
        }
      }
    );
  }, []);

  const handleSelectedVersion = (index) => {
    setSelectedVersion(index);
  };

  console.log(versions);

  return (
    <div className="">
      <div className="">
        <div className="tw-ml-[30px] tw-flex tw-items-center">
          <IOIcons.IoIosArrowBack
            className="tw-w-[30px] tw-h-[30px] tw-cursor-pointer"
            onClick={(event) => {
              goBack();
            }}
          />
          <h1 className=" tw-ml-[20px] tw-text-[20px]">Version History</h1>
        </div>

        <div className="tw-w-full tw-flex heightMain">
          <div className="tw-flex-1 tw-rounded-[10px] tw-m-[10px] tw-flex-shrink-0">
            {versions.length > 0 ? (
              <FolderViewer
                url={versions[selectedVersion].filePath}
                filePath={taskPath}
                title={
                  versions[selectedVersion].date +
                  " at " +
                  versions[selectedVersion].time
                }
              />
            ) : (
              <h3 className="widthMain tw-mt-[20px]">No Versions Loaded</h3>
            )}
          </div>

          <div className="tw-flex-1 tw-m-[10px] tw-rounded-[10px]">
            <div className="tw-p-[10px] tw-bg-[#272727] tw-rounded-[10px] tw-w-full tw-flex-2 tw-right-0 tw-overflow-y-scroll heightMain3">
              {versions.length > 0 ? (
                <div>
                  <div className="tw-w-full tw-flex tw-justify-center tw-items-center tw-mt-[10px] ">
                    <h3 className="tw-text-[18px]">
                      File version for{" "}
                      <span className="tw-text-[#5BCEFF] tw-font-bold">
                        TASK {props.index + 1}
                      </span>
                    </h3>
                  </div>

                  <div className="tw-mt-[20px] tw-h-full tw-overflow-y-scroll tw-ml-[-10px]">
                    {versions.map((version, index) => {
                      return index === selectedVersion ? (
                        <div className="tw-w-[90%] tw-bg-[#0B0B0B] tw-h-fit tw-my-[10px] tw-p-[10px] tw-flex tw-items-center tw-relative version">
                          <div>
                            <div className="tw-flex tw-items-center">
                              <div className="tw-min-w-[10px] tw-min-h-[10px] tw-rounded-[50%] tw-bg-[#5BCEFF]"></div>
                              <h3 className="tw-text-[15px] tw-font-bold tw-ml-[10px]">
                                {version.date} at {version.time}
                              </h3>
                            </div>
                            <p className="tw-text-[#A7A7A7] tw-ml-[15px] tw-mt-[5px] tw-text-[12px]">
                              Currently viewing version
                            </p>
                          </div>
                          <Tooltip
                            title={
                              isLoading && downloadingVersion === index
                                ? "Downloading..."
                                : "Download currently viewing version"
                            }
                            className="tw-absolute tw-right-0 tw-mr-[10px] tw-cursor-pointer hover:tw-text-[#5BCEFF]"
                          >
                            {isLoading && downloadingVersion === index ? (
                              <div>
                                <CircularProgress className="tw-max-w-[20px] tw-max-h-[20px]" />
                              </div>
                            ) : (
                              <div>
                                <FaDownload
                                  onClick={(event) => {
                                    setLoading(true);
                                    setDownloadingVersion(index);
                                    downloadZipFile(
                                      version.filePath,
                                      taskPath.split("/")[
                                        taskPath.split("/").length - 1
                                      ] +
                                        "_" +
                                        version.date.replace("_", "/") +
                                        "_" +
                                        version.time.replace("_", ":")
                                    );
                                  }}
                                />
                              </div>
                            )}
                          </Tooltip>
                        </div>
                      ) : (
                        <div
                          className="tw-w-[90%] tw-h-fit tw-my-[10px] tw-cursor-pointer tw-p-[10px]"
                          onClick={(event) => {
                            handleSelectedVersion(index);
                          }}
                        >
                          <div className="tw-flex tw-items-center">
                            <div className="tw-min-w-[10px] tw-min-h-[10px] tw-rounded-[50%] tw-bg-[#5BCEFF]"></div>
                            <h3 className="tw-text-[15px] tw-font-bold tw-ml-[10px]">
                              {version.date} at {version.time}
                            </h3>
                          </div>
                          <p className="tw-text-[#A7A7A7] tw-ml-[15px] tw-text-[12px] tw-mt-[5px]">
                            Click to view this version
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div>No Version Yet</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function sidebarToggler(boolean) {
  if (boolean === true) {
    localStorage.setItem("sideBarStatus", "true");
  } else {
    localStorage.setItem("sideBarStatus", "false");
  }
}

function getPreviousSetting(name) {
  let setting = localStorage.getItem(name);
  if (setting === "true") {
    return true;
  } else {
    return false;
  }
}

export default ProgressVersionHistory;
