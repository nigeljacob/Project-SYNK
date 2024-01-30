import React from 'react'
import { Link } from 'react-router-dom'
import { SideBarData } from './SideBarData';
import * as MDIcons from 'react-icons/md';
import * as BSIcons from 'react-icons/bs';
import "./SideBar.css"

function SideBar() {
  return (
    <>
    <div>

    </div>
      <div className='navBar'>
        <div className='Profile'>
            <div>
            <div className='profilePicture'>
                <img />
            </div>
            <div className='userStatus'>

            </div>
            </div>
            <div className='title'>
                <h2 id='userName'>
                    Nigel Jacob
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
                    <div className = {item.cName} key={index}>
                        {item.icon}
                        <span>{item.title}</span>
                    </div> 
                )
            })}
        </ul>
        <div className='bottomButtons'>
            <h3 id='time'>
                4:55 pm
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

export default SideBar
