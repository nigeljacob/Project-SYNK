import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import * as IOIcons from "react-icons/io";
import './Notifications.css'
const electronApi = window?.electronApi;

const Notifications = (props) => {

  const history = useNavigate();

  const goBack = () => {
      handleRemoveNotification()
      history(-1)// Go back to the previous page
  };

  let notifications = [];
  let oldNotifications = [];
  let newNotifications = [];

  try{
    notifications = JSON.parse(localStorage.getItem("notifications") || "[]");
  } catch (e) {

  }

  const handleRemoveNotification = () => {
    for(let i = 0; i < notifications.length; i++) {
      if(!notifications[i]["seen"]) {
        notifications[i]["seen"] = true
      }
    }
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }

  const handleDelete = (type) => {
    setOldClearLoading(true)
    if(type === "old") {
      for(let i = 0; i < notifications.length; i++) {
        if(notifications[i]["seen"]) {
          notifications.splice(i)
        }
      }
      localStorage.setItem("notifications", JSON.stringify(notifications));
      electronApi.sendShowAlertSignamToMain(["Done!!", "All Old Notifications Cleared"])
      setOldClearLoading(false)
    }
  }

  for(let i = 0; i < notifications.length; i++) {
    if(!notifications[i]["seen"]) {
      newNotifications.push(notifications[i])
    } else {
      oldNotifications.push(notifications[i])
    }
  }

  const [isOldClearLoading, setOldClearLoading] = useState(false)

  const [viewOldNotifications, setViewOldNotifications] = useState(false);

  useEffect(() => {
    if(newNotifications.length === 0) {
      if(!viewOldNotifications) {
        setViewOldNotifications(true)
      }
    }
  }, [])
  
  return (
    <div className='tw-w-full notifications'>
      
      <div className='tw-mt-[50px] tw-ml-[30px] tw-flex tw-items-center'>
        <IOIcons.IoIosArrowBack className='tw-w-[30px] tw-h-[30px] tw-cursor-pointer' onClick={event => {goBack()}}/>
        <h1 className=' tw-ml-[30px] tw-text-[22px]'>Notifications</h1>
      </div>

      {notifications.length > 0 ? (
          <div className='tw-w-full tw-flex tw-justify-center tw-overflow-y-scroll maxHeight'>
          <div className="notificationCenter tw-w-[90%] tw-mt-[40px]">
          <h3 className='tw-mt-[30px] tw-mb-[20px] tw-flex-1'>New Notifications ({newNotifications.length})</h3>
          <div className='tw-max-h-[400px] tw-overflow-y-scroll tw-w-full'>
            {newNotifications.map((item, index) => (
            !newNotifications[index]["seen"] ? (
              <div className="tw-w-[95%] tw-h-fit tw-mr-[10px] tw-ml-[10px] tw-bg-[#0B0B0B] tw-p-[20px] tw-rounded-[10px] tw-mb-[10px] tw-flex tw-items-center">
              <div className='tw-w-[50px] tw-h-[50px] tw-flex tw-justify-center tw-items-center tw-rounded-[5px] tw-bg-[#272727] tw-mr-[20px]'>
                <h3 className="tw-text-[20px] tw-font-bold ">{item.title.split("@")[1].trim().split(" ")[0][0]} {item.title.split("@")[1].trim().split(" ")[1][0]}</h3>
              </div>
              <div>
                <h3 className="tw-text-[15px] tw-mb-[5px]">{item.title}</h3>
                <p>{item.message}</p>
              </div>
              </div>
            ) : null
            ))}
          </div>

          <div className='tw-w-full tw-relative tw-flex tw-items-center'>
            <h3 className='tw-mt-[30px] tw-mb-[20px] tw-flex-1'>Old Notifications ({oldNotifications.length})</h3>
            {viewOldNotifications ? (
              <IOIcons.IoIosArrowBack className='tw-w-[30px] tw-h-[30px] tw-cursor-pointer tw-rotate-[90deg]' onClick={event => {setViewOldNotifications(false)}}/>
            ) : (
              <IOIcons.IoIosArrowBack className='tw-w-[30px] tw-h-[30px] tw-cursor-pointer tw-rotate-[-90deg]' onClick={event => {setViewOldNotifications(true)}}/>
            )}
            {isOldClearLoading ? (
              <div className='tw-p-[5px] tw-ml-[10px] tw-cursor-pointer' onClick={event => {handleDelete("old")}}>
                <CircularProgress />
              </div>
            ) : (
              <div className='tw-p-[5px] tw-bg-[#0B0B0B] tw-rounded-[5px] tw-ml-[10px] tw-cursor-pointer' onClick={event => {handleDelete("old")}}>
              <p className='tw-text-[12px]'>Clear All</p>
              </div>
            )}
          </div>
          <div className='tw-w-full'>
          {viewOldNotifications ? (
            oldNotifications.length != 0 ? (
              oldNotifications.map((item, index) => (
                oldNotifications[index]["seen"] ? (
                  <div className="tw-w-[95%] tw-h-fit tw-mr-[10px] tw-ml-[10px] tw-bg-[#0B0B0B] tw-p-[20px] tw-rounded-[10px] tw-mb-[10px] tw-flex tw-items-center">
                  <div className='tw-w-[50px] tw-h-[50px] tw-flex tw-justify-center tw-items-center tw-rounded-[5px] tw-bg-[#272727] tw-mr-[20px]'>
                    <h3 className="tw-text-[20px] tw-font-bold ">{item.title.split("@")[1].trim().split(" ")[0][0]} {item.title.split("@")[1].trim().split(" ")[1][0]}</h3>
                  </div>
                  <div>
                    <h3 className="tw-text-[15px] tw-mb-[5px]">{item.title}</h3>
                    <p>{item.message}</p>
                  </div>
                  </div>
                ) : null
              ))
            ) : (
              <div className='tw-w-full tw-flex tw-justify-center tw-items-center'>
                <div className="notificationCenter tw-w-[90%] tw-mt-[40px] tw-flex tw-justify-center tw-items-center">
                  <h3>⚠️ No Old Notifications</h3>
                </div>
              </div>
            )
          ) : null}
          </div>
          </div>
          </div>
      ) : (
        <>
        <div className='tw-w-full tw-flex tw-justify-center tw-items-center tw-h-[75vh]'>
          <div className="notificationCenter tw-w-[90%] tw-mt-[40px] tw-flex tw-justify-center tw-items-center">
            <h3>⚠️ No Notifications</h3>
          </div>
        </div>
        </>
      )}

    </div>
  )

}

export default Notifications

