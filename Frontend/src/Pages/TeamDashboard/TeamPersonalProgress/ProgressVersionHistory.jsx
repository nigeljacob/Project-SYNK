import React, { useEffect, useState } from "react";
import * as IOIcons from "react-icons/io";
import FolderViewer from "../../../components/FolderViewer/FolderViewer";
import TeamYourProgress from "../TeamPersonalProgress/TeamYourProgress";
import { useNavigate } from "react-router-dom";
import { getVersions } from "../../../utils/AssignTask/taskFunctions";
import "./ProgressVersionHistory.css";

const ProgressVersionHistory = (props) => {
  const history = useNavigate();

  const goBack = () => {
    props.setElement(
      <TeamYourProgress
        team={props.team}
        sideBarStatus={props.sideBarStatus}
        elementTrigger={props.setElement}
      />
    );
  };

  const [versions, setVersions] = useState([]);

  const [selectedVersion, setSelectedVersion] = useState(0);

  useEffect(() => {
    let teamMemberIndex = props.team.teamMemberList.findIndex(
      (member) => member.UID === props.UID
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
          <h1 className=" tw-ml-[30px] tw-text-[22px]">Version History</h1>
        </div>

        <div className="tw-w-full tw-flex heightMain">
          <div className="tw-flex-1 tw-rounded-[10px] tw-m-[10px] tw-flex-shrink-0">
            {versions.length > 0 ? (
              <FolderViewer url={versions[selectedVersion].filePath} />
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
                        <div className="tw-w-[90%] tw-bg-[#0B0B0B] tw-h-[80px] tw-my-[20px] version">
                          <div className="tw-flex tw-items-center">
                            <div className="tw-min-w-[10px] tw-min-h-[10px] tw-rounded-[50%] tw-bg-[#5BCEFF]"></div>
                            <h3 className="tw-text-[15px] tw-font-bold tw-ml-[10px]">
                              {version.date} at {version.time}
                            </h3>
                          </div>
                          <p className="tw-text-[#A7A7A7] tw-ml-[10px]">
                            currently viewing version
                          </p>
                        </div>
                      ) : (
                        <div
                          className="tw-w-[90%] tw-h-[80px] tw-my-[20px] tw-px-[10px] tw-cursor-pointer"
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
                          <p className="tw-text-[#A7A7A7] tw-ml-[10px]">
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
