import React from 'react'
import * as MDIcons from 'react-icons/md';
import * as IOIcons from 'react-icons/io';
import * as FaIcons6 from 'react-icons/fa6';

export const SideBarData = [
    {
        title: "Activity",
        icon: <MDIcons.MdOutlineWindow className='MenuIcon'/>,
        path: "/Home",
        cName: "nav_item"
    },
    {
        title: "Chat",
        icon: <IOIcons.IoIosChatboxes className='MenuIcon'/>,
        path: "/Chats",
        cName: "nav_item"
    }, 
    {
        title: "Teams",
        icon: <FaIcons6.FaPeopleGroup className='MenuIcon'/>,
        path: "/Teams",
        cName: "nav_item"
    } 
]