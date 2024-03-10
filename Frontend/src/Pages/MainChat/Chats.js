import React, { useState } from 'react';
import * as IOIcons from "react-icons/io";
import FolderViewer from '../../components/FolderViewer/FolderViewer';

function Chats() {

  var sideBarStatus = true;

  try{
    sideBarStatus = getPreviousSetting("sideBarStatus");
  } catch(e) {
    sideBarStatus = true;
  }

  const [isOpen, setIsOpen] = useState(sideBarStatus);
  const SideBarResult = isOpen ? "sideBar show_SideBar" : "sideBar hide_SideBar";
  const MainContentResult = isOpen
    ? "activityContent bringBackMainContent"
    : "activityContent extendMainContent";
  const IconResult = isOpen ? "rotateIcon0" : "rotateIcon180";
  return (
    <div className='chat'>
      <div className={SideBarResult}>
        <div className='closeButton' onClick={event => {
          setIsOpen(!isOpen);
          sidebarToggler(!isOpen);
        }}>
            <IOIcons.IoMdArrowDropleft className={IconResult} />
        </div>
        </div>
      
      
      <div className={MainContentResult}>

      <div className='tw-ml-[30px] tw-flex tw-items-center'>
          <IOIcons.IoIosArrowBack className='tw-w-[30px] tw-h-[30px] tw-cursor-pointer' onClick={event => {goBack()}}/>
          <h1 className=' tw-ml-[30px] tw-text-[22px]'>Version History</h1>
        </div>

        <div className="tw-w-full tw-flex heightMain">
          <div className="tw-flex-1 tw-rounded-[10px] tw-m-[10px] tw-flex-shrink-0">
          <FolderViewer url={"https://nnjtrading.com/wp-content/uploads/2024/03/files.zip"} />
          </div>

          <div className="tw-flex-1 tw-m-[10px] tw-rounded-[10px]">
          <div className='tw-p-[10px] tw-bg-[#0b0b0b] tw-rounded-[10px] tw-w-full tw-flex-2 tw-right-0 tw-overflow-y-scroll heightMain3'>
          <h3>versions</h3>
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

export default Chats;