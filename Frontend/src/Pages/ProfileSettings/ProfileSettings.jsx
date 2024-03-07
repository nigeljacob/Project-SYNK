import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import * as IOIcons from "react-icons/io";
import { MdModeEditOutline } from "react-icons/md";
import { auth } from '../../../../Backend/src/firebase';
import { updateProfileData } from '../../../../Backend/src/UserAccount';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { CircularProgress } from '@mui/material';

const ProfileSettings = (props) => {


    const history = useNavigate();

     
    const [profilePic, setProfilePic] = useState(props.user.photoURL)
    const [tempProfilePic, setTempProfilePic] = useState(props.user.photoURL)

    const [userName, setName] = useState(props.user.displayName)
    const [email, setEmail] = useState(props.user.email)
    const [number, setNumber] = useState(props.user.phoneNumber)
    const [about, setAbout] = useState(props.userData.about)
    const [isLoading, setLoading] = useState(true)
    const fileInputRef = useRef(null);

    const handleClick = () => {
      fileInputRef.current.click();
   };

   const handleLoad = () => {
    setTimeout(() => {
      setLoading(false)
    }, 1000)
   }

   handleLoad()

   const [isUploading, setUploading] = useState(false)

   const goBack = () => {
    if(userName === props.user.displayName && email === props.user.email && number === props.user.phoneNumber && about === props.userData.about ) {
      history(-1)
    } else {
      confirmAlert({
        title: 'Are you sure?',
        message: 'Your changes wan\'t be saved',
        buttons: [
          {
            label: 'Yes',
            onClick: () => history(-1)
          },
          {
            label: 'No'
          }
        ],
        closeOnEscape: true,
        closeOnClickOutside: true,
        keyCodeForClose: [8, 32],
        willUnmount: () => {},
        afterClose: () => {},
        onClickOutside: () => {},
        onKeypress: () => {},
        onKeypressEscape: () => {},
        overlayClassName: "alertConfirm"
      });
    }
 };

   const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setProfilePic(file)
      setTempProfilePic(URL.createObjectURL(file))
    }
   }

   const handleUpdateProfile = () => {
    setUploading(true)
    if(profilePic === props.user.photoURL) {
      updateProfileData(userName, email, number, null, about, setUploading)
    } else {
      updateProfileData(userName, email, number, profilePic, about, setUploading)
    }
   }

  return (
    <div className='tw-w-full tw-h-full tw-relative'>

      <div className='tw-w-[300px] tw-bg-zinc-900 tw-absolute tw-right-0 tw-m-[20px] tw-rounded-[20px] sideBarOpened tw-flex tw-flex-col tw-items-center'>

        <div className="profilePic tw-w-[85%] tw-bg-[#0B0B0B] tw-rounded-[20px] tw-h-[250px] tw-mt-[20px] tw-flex tw-items-center tw-justify-center tw-relative">
            {profilePic != null ? (
                <>
                  {profilePic === props.user.photoURL ? (
                    <img src={profilePic} alt="profilePic" className='tw-rounded-[20px] tw-w-[100%] tw-h-[250px] tw-snap-center tw-object-cover'/>
                  ) : (
                    <img src={tempProfilePic} alt="profilePic" className='tw-rounded-[20px] tw-w-[100%] tw-h-[250px] tw-snap-center tw-object-cover'/>
                  )}

                  {isLoading ? (
                    <CircularProgress className='tw-absolute' />
                  ): null}
                </>
            ) : (
              <>
                <h1 className='tw-text-[150px] tw-font-extrabold tw-select-none'>{userName[0]}</h1>
              </>
            )} 

            <div className='tw-absolute tw-p-[10px] tw-bg-[#272727] tw-rounded-[10px] tw-bottom-0 tw-right-0 tw-m-[10px] tw-cursor-pointer' onClick={event => {handleClick()}}>
              <MdModeEditOutline className='tw-w-[20px] tw-h-[20px]'/>
              <input style={{display: 'none'}} ref={fileInputRef} type="file" onChange={onImageChange} />
            </div>

        </div>

        <div className= 'tw-h-[55%] tw-max-h-[55%] tw-w-[90%] tw-overflow-y-scroll'>
        <div className="info tw-w-[90%] tw-mt-[20px] tw-ml-[20px]">
          <h1 className='tw-text-[20px] tw-text-white'>{userName}</h1>
          <p className='tw-text-light tw-text-[13px] tw-text-[#A7A7A7]'>Name</p>
        </div>

        <div className="info tw-w-[90%] tw-mt-[10px] tw-ml-[20px]">
          <h1 className='tw-text-[20px] tw-text-white'>{email}</h1>
          <p className='tw-text-light tw-text-[13px] tw-text-[#A7A7A7]'>email Address</p>
        </div>

        {number != null ? (
          <div className="info tw-w-[90%] tw-mt-[10px] tw-ml-[20px]">
          <h1 className='tw-text-[20px] tw-text-white'>{number}</h1>
          <p className='tw-text-light tw-text-[13px] tw-text-[#A7A7A7]'>Contact Number</p>
        </div>
        ) : null}

        {about != "" || about != null ? (
          <div className="info tw-w-[90%] tw-mt-[10px] tw-ml-[20px]">
          <h1 className='tw-text-[15px] tw-text-white'>{about}</h1>
          <p className='tw-text-light tw-text-[13px] tw-text-[#A7A7A7]'>About</p>
           </div>
        ) : null}
        </div>

        {isUploading ? (
          <div className="tw-absolute tw-bottom-0 tw-w-[90%] tw-py-[7px] tw-mb-[15px] tw-flex tw-items-center tw-justify-center tw-text-black">
            <CircularProgress />
          </div>
        ) : (
          <div className="tw-absolute tw-bottom-0 tw-w-[90%] tw-py-[7px] tw-bg-[#5BCEFF] tw-rounded-[10px] tw-mb-[15px] tw-flex tw-items-center tw-justify-center tw-text-black tw-cursor-pointer" onClick={event => {handleUpdateProfile()}}>
          <p className='tw-font-bold'>Update Profile</p>
          </div>
        )}

      </div>
      
    <div className='tw-mt-[50px] tw-ml-[30px] tw-flex tw-items-center'>
      <IOIcons.IoIosArrowBack className='tw-w-[30px] tw-h-[30px] tw-cursor-pointer' onClick={event => {goBack()}}/>
      <h1 className=' tw-ml-[30px] tw-text-[22px]'>Edit Profile</h1>
    </div>

   <div className='tw-w-[70%] tw-ml-[10px] tw-justify-center tw-flex tw-mt-[30px]'>
   <form className='tw-w-[90%]'>
      
      <h4 className='tw-text-[15px] tw-ml-[5px]'>Name</h4>
      <input type="text" name="userName" id="userName" className='tw-bg-[#0B0B0B] tw-text-white tw-border-none' value={userName} onChange={event => {setName(event.target.value)}}/>

      <h4 className='tw-text-[15px] tw-ml-[5px] tw-mt-[15px]'>Email</h4>
      <input type="text" name="email" id="email" className='tw-bg-[#0B0B0B] tw-text-white tw-border-none' value={email} onChange={event => {setEmail(event.target.value)}}/>

      <h4 className='tw-text-[15px] tw-ml-[5px] tw-mt-[15px]'>Phone Number</h4>
      <input type="tel" name="email" id="email" className='tw-bg-[#0B0B0B] tw-text-white tw-border-none' value={number} onChange={event => {setNumber(event.target.value)}}/>

      <h4 className='tw-text-[15px] tw-ml-[5px] tw-mt-[15px]'>About</h4>
      <textarea type="text" rows="1" maxLength={30} name="about" id="about" className='tw-bg-[#0B0B0B] tw-text-white tw-border-none' value={about} onChange={event => {setAbout(event.target.value)}}/>

    </form>
   </div>

    </div>
  )
}

export default ProfileSettings
