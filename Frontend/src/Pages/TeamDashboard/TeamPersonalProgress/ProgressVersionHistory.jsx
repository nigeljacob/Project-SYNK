import React, { useEffect, useState } from 'react';
import * as IOIcons from "react-icons/io";
import FolderViewer from '../../../components/FolderViewer/FolderViewer';
import TeamYourProgress from "../TeamPersonalProgress/TeamYourProgress";
import { useNavigate } from 'react-router-dom';
import { getVersions } from '../../../../../Backend/src/AssignTask/taskFunctions';

const ProgressVersionHistory = (props) => {

    const history = useNavigate();

    const goBack = () => {
        props.setElement(<TeamYourProgress team={props.team} sideBarStatus={props.sideBarStatus} elementTrigger = {props.setElement} />)
    };

    const [versions, setVersions] = useState([])

    const [selectedVersion, setSelectedVersion] = useState(0)

    useEffect(() => {
      let teamMemberIndex = props.team.teamMemberList.findIndex((member) => member.UID === props.UID)
      getVersions(props.index, props.team, teamMemberIndex, props.UID, (versionList) => {
        setVersions(versionList)
      })
    }, [])

    console.log(versions)

    return (
      <div className=''>

        <div className="">
  
        <div className='tw-ml-[30px] tw-flex tw-items-center'>
            <IOIcons.IoIosArrowBack className='tw-w-[30px] tw-h-[30px] tw-cursor-pointer' onClick={event => {goBack()}}/>
            <h1 className=' tw-ml-[30px] tw-text-[22px]'>Version History</h1>
          </div>
  
          <div className="tw-w-full tw-flex heightMain">
            <div className="tw-flex-1 tw-rounded-[10px] tw-m-[10px] tw-flex-shrink-0">
            {versions.length > 0 ? (
              <FolderViewer url={versions[selectedVersion].filePath} />
            ) : (
              <h3>No Versions Loaded</h3>
            )}
            </div>
  
            <div className="tw-flex-1 tw-m-[10px] tw-rounded-[10px]">
            <div className='tw-p-[10px] tw-bg-[#0b0b0b] tw-rounded-[10px] tw-w-full tw-flex-2 tw-right-0 tw-overflow-y-scroll heightMain3'>
              {versions.length > 0 ? (
                <div>
                  <h3>File version for task {props.index + 1}</h3>
                </div>
              ) : (
                <div>
                  No Version Yet
                </div>
              )}
          </div>
            </div>
  
          </div>
  
         
        </div>
      </div>
    );
}

function sidebarToggler(boolean) {
    if(boolean === true) {
      localStorage.setItem("sideBarStatus", "true");
    } else {
      localStorage.setItem("sideBarStatus", "false");
    }
  }
  
  function getPreviousSetting(name) {
    let setting = localStorage.getItem(name);
    if(setting === "true") {
      return true
    } else {
      return false
    }
  }

export default ProgressVersionHistory