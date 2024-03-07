import React, { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { SideBarData } from './SideBarData';
import * as MDIcons from 'react-icons/md';
import * as BSIcons from 'react-icons/bs';
import * as IOIcons5 from 'react-icons/io5';
import "./SideBar.css"
import { getStatus } from '../../../../Backend/src/UserAccount';
import Clock from 'react-live-clock';
import { read_OneValue_from_Database } from '../../../../Backend/src/firebaseCRUD';
import { auth } from '../../../../Backend/src/firebase';

const SideBar = (props) => {
    
    const [status, setStatus] = useState("Active");
    const [user, setUser] = useState(null);

    let notifications = [];
    const [newNotifications, setNewNotifications] = useState([]);

    try {
        notifications = JSON.parse(localStorage.getItem("notifications") || "[]");
    } catch (e) {
        console.error('Error parsing localStorage:', e);
    }
    
    useEffect(() => {
        const newNoti = notifications.filter(notification => !notification.seen);
    
    // Update state with newNotifications
    setNewNotifications(newNoti);
    }, [notifications])

    useEffect(() => {
        getStatus(props.user.uid, (status) => {
            setStatus(status);
        })
    }, [])

    useEffect(() => {
        read_OneValue_from_Database("Users/" + auth.currentUser.uid, (user) => {
            setUser(user)
        })
    }, [])

  return (
    <>
    <div>

    </div>
      <div className='navBar'>
        <div className='Profile'>
            <div>
            <div className='profilePicture'>
               {user === null ? (
                <IOIcons5.IoPerson className='profilePerson' />
               ): (
                user.profile == "" ? (
                    <IOIcons5.IoPerson className='profilePerson' />
                  ) : (
                   <img src = {user.profile} alt='profile' className='tw-w-full tw-h-full tw-object-cover tw-rounded-[50%]'/>
                  )
               )}
            </div>
    

            </div>

            {status === "Active" ? (
                <div className="userStatus tw-bg-[#00ff00]"> </div>
            ) : (
                status === "Away" ? (
                    <div className="userStatus tw-bg-[#e4ec45]"> </div>
                ) : (
                    status === "Busy" ? (
                        <div className="userStatus tw-bg-[#5BCEFF]"> </div> 
                    ) : (
                        <div className="userStatus tw-bg-[#ff0000]"> </div>
                    )
                )
            )}
            <div className='title'>
                <h2 id='userName'>
                    {props.user.displayName}
                </h2>
                {user != null ? (
                    (user.about != "" && user.about != undefined && user.about != null) ? (
                        <h4 id='title'>
                        {user.about.toUpperCase()}
                    </h4>
                    ): null
                    ) : null }
            </div>
            <Link className='editButton' to="/profileUpdate">
                <MDIcons.MdOutlineEdit className='editICON' />
            </Link>
        </div>
        <ul className='navItems'>
            {SideBarData.map((item, index) => {
                return(
                    <div className='itemWrapper'>
                        <NavLink to={item.path} className={({ isActive }) => (isActive ? 'active' : 'nav_item')} >
                    <div className = {item.cName} key={index}>
                        {item.icon}
                        <span>{item.title}</span>
                    </div> 
                    </NavLink>
                    </div>
                )
            })}
        </ul>

        

        <div className='bottomButtons'>
            <Clock format={'hh:mm a'} ticking={true} />
            {newNotifications.length > 0 ? (
                <div className='notificationButton tw-relative'>
                    <Link to="/notifications">
                        <BSIcons.BsBellFill className='notificationIcon' />
                    </Link>

                    <div className='tw-w-[20px] tw-h-[20px] tw-bg-[#5BCEFF] tw-absolute tw-top-0 tw-mt-[-10px] tw-mr-[-10px] tw-right-0 tw-rounded-[50%] tw-flex tw-justify-center tw-items-center'>
                        <h3 className='tw-text-black tw-text-[12px]'>{newNotifications.length}</h3>
                    </div>
                </div>
            ): (
                <div className='notificationButton'>
                    <Link to="/notifications">
                        <BSIcons.BsBellFill className='notificationIcon' />
                    </Link>
                </div>
            )}
        </div>
      </div>
    </>
  )
}

export default SideBar
