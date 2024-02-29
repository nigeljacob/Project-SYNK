import React from 'react'
import { useNavigate } from 'react-router-dom';
import * as IOIcons from "react-icons/io";

const Notifications = (props) => {

  const history = useNavigate();

  const goBack = () => {
      history(-1)// Go back to the previous page
  };

  
  return (
    <div className='tw-w-full notifications'>
      
      <div className='tw-mt-[50px] tw-ml-[30px] tw-flex tw-items-center'>
        <IOIcons.IoIosArrowBack className='tw-w-[30px] tw-h-[30px] tw-cursor-pointer' onClick={event => {goBack()}}/>
        <h1 className=' tw-ml-[30px] tw-text-[22px]'>Notifications</h1>
      </div>

      {props.Notifications.length > 0 ? (
          <div className='tw-w-full tw-flex tw-justify-center'>
          <div className="notificationCenter tw-w-[90%] tw-mt-[40px]">
          {props.Notifications.map((item, index) => (
            <div className="tw-w-full tw-h-fit tw-mr-[10px] tw-ml-[10px] tw-bg-[#0B0B0B] tw-p-[20px] tw-rounded-[10px] tw-mb-[10px]">
            <h3 className="tw-text-[15px] tw-mb-[5px]">{item.title}</h3>
            <p>{item.message}</p>
            </div>
          ))}
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

