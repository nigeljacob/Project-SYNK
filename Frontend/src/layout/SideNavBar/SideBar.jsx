import React, { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { SideBarData } from './SideBarData';
import * as MDIcons from 'react-icons/md';
import * as BSIcons from 'react-icons/bs';
import * as IOIcons5 from 'react-icons/io5';
import "./SideBar.css"
import { getStatus } from '../../../../Backend/src/UserAccount';

const SideBar = (props) => {
    
    
    setInterval(function() {
        document.getElementById("time").innerHTML = getTime();
    }, 3000);


    const [status, setStatus] = useState("Active");

    const result = status === "Active" ? "userStatus" : "userStatus_Offline";

    useEffect(() => {
        getStatus(props.user.uid, (status) => {
            setStatus(status);
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
                <IOIcons5.IoPerson className='profilePerson' />
            </div>
            <div className={result}>

            </div>
            </div>
            <div className='title'>
                <h2 id='userName'>
                    {props.user.displayName}
                </h2>
                <h4 id='title'>
                    Full Stack Developer
                </h4>
            </div>
            <Link className='editButton'>
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
            <h3 id='time'>
                {getTime()}
            </h3>
            <div className='notificationButton'>
                <Link>
                    <BSIcons.BsBellFill className='notificationIcon' />
                </Link>
            </div>
        </div>
      </div>
    </>
  )
}

function getTime() {
    const locale = 'en';
    const today = new Date();
    let time = today.toLocaleTimeString(locale, { hour: 'numeric', hour12: true, minute: 'numeric' })
    return time;
}

export default SideBar
