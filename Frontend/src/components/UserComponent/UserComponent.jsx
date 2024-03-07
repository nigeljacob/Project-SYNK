import React, { useEffect, useState } from 'react'
import { readOnceFromDatabase, read_OneValue_from_Database, read_from_Database_onChange } from '../../../../Backend/src/firebaseCRUD'
import { CircularProgress } from '@mui/material'
import { auth } from '../../../../Backend/src/firebase'

const UserComponent = ({UID, type, setTriger}) => {

    const [user, setUser] = useState(null)
    const [users, setUsers] = useState(null)
    const [teams, setTeams] = useState(null)

    const handleMouseOver = () => {
        setTriger(true);
      };
    
      const handleMouseOut = () => {
        setTriger(false);
      };

    if(type === "Single") {

        useEffect(() => {
            read_OneValue_from_Database("Users/" + UID, (receivedUser) => {{
                setUser(receivedUser);
            }})
        }, [])

        useEffect(() => {
            let count = 0;
            read_from_Database_onChange("Teams/" + auth.currentUser.uid, (myTemams) => {
                read_from_Database_onChange("Teams/" + UID, (receievedTeams) => {{
                    if(UID != auth.currentUser.uid) {
                        for(let i = 0;  i < receievedTeams.length; i++) {
                            if(myTemams.some((team) => team.teamCode === receievedTeams[i].teamCode)) {
                                count++
                            }
                        }
            
                        setTeams(count);
                    } else {
                        setTeams(myTemams.length)
                    }
                }})
            })
        })

    } else {
        useEffect(() => {
            let tempList = []
            for(let i = 0; i < UID.length; i++) {
                readOnceFromDatabase("Users/" + UID[i].UID, (receivedUser) => {
                    tempList.push(receivedUser)
                })
            }
            setTimeout(() => {
                setUsers(tempList)
            }, 1000)
        }, [])
    }

  return (
    <div className='tw-absolute tw-mt-[-198px] tw-ml-[-20px] tw-w-[200px] tw-h-[200px] tw-max-h-[200px] tw-max-w-[200px] tw-bg-[#0B0B0B] tw-rounded-[10px] tw-p-[10px] tw-overflow-y-scroll tw-z-[1000]' onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
        {type === "Single" ? (
            <>
                {user != null ? (
            <div>
                <div className="tw-w-full tw-flex tw-items-center">
                    {user.profile != "" ? (
                    <div className='tw-w-[50px] tw-h-[50px] tw-rounded-[5px] tw-bg-[#272727]'>
                        <img src={user.profile} alt="profile picture" className='tw-w-full tw-h-full tw-object-cover tw-rounded-[5px]'/>
                    </div>
                ) : (
                    <div className="tw-flex tw-justify-center tw-rounded-[5px] tw-items-center tw-text-[18px] tw-w-[50px] tw-h-[50px] tw-bg-[#272727]">
                    {user["username"][0]}
                    </div>
                )}

                    <div className='tw-ml-[10px]'>
                        {UID === auth.currentUser.uid ? (
                            <h3 className='tw-text-[12px] tw-font-bold'>{user.username} (You)</h3>
                        ): (
                            <h3 className='tw-text-[12px] tw-font-bold'>{user.username}</h3>
                        )}
                        <p className='tw-text-[10px] tw-text-[#A7A7A7]'>{user.userStatus}</p>
                    </div>

                </div>

                <div className='tw-mt-[10px] tw-ml-[5px]'>
                    <h5 className='tw-text-[12px] tw-font-bold'>About: </h5>
                    <p className='tw-text-[10px] tw-text-[#A7A7A7]'>{user.about}</p>
                </div>

                <div className='tw-mt-[5px] tw-ml-[5px]'>
                    <h5 className='tw-text-[12px] tw-font-bold'>Email: </h5>
                    <p className='tw-text-[10px] tw-text-[#A7A7A7]'>{user.email}</p>
                </div>

                {UID != auth.currentUser.uid ? (
                    teams != null ? (
                        <div className='tw-mt-[5px] tw-ml-[5px]'>
                        <h5 className='tw-text-[12px] tw-font-bold'>Other Teams: </h5>
                        {teams != 1 ? (
                            <p className='tw-text-[10px] tw-text-[#A7A7A7]'>In {teams - 1} other teams with you</p>
                        ) : (
                            <p className='tw-text-[10px] tw-text-[#A7A7A7]'>Not in any other teams with you</p>
                        )}
                    </div>
                    ) : null
                ) : (
                    teams != null ? (
                        <div className='tw-mt-[5px] tw-ml-[5px]'>
                        <h5 className='tw-text-[12px] tw-font-bold'>Other Teams: </h5>
                        <p className='tw-text-[10px] tw-text-[#A7A7A7]'>In {teams - 1} other teams on SYNK</p>
                    </div>
                    ) : null
                )}

            </div>

        ) : (
            <div className='tw-w-full tw-h-full tw-flex tw-justify-center tw-items-center'>
                <CircularProgress />
            </div>
        )}
            </>
        ) : (
            <>
                {users != null ? (
                    <div className='tw-flex tw-flex-col tw-w-full'>
                    {users.map((item, Index) => {
                        if(Index == users.length - 1) {
                            return (
                                <div className="tw-w-full tw-flex tw-items-center tw-mt-[10px] tw-mb-[10px]">
                                    {item.profile != "" ? (
                                    <div className='tw-w-[40px] tw-h-[40px] tw-rounded-[5px] tw-bg-[#272727]'>
                                        <img src={item.profile} alt="profile picture" className='tw-w-full tw-h-full tw-object-cover tw-rounded-[5px]'/>
                                    </div>
                                ) : (
                                    <div className="tw-flex tw-justify-center tw-rounded-[5px] tw-items-center tw-text-[18px] tw-w-[40px] tw-h-[40px] tw-bg-[#272727]">
                                    {item["username"][0]}
                                    </div>
                                )}
    
                                    <div className='tw-ml-[10px]'>
                                        {item.uid === auth.currentUser.uid ? (
                                            <h3 className='tw-text-[12px] tw-font-bold'>{item.username} (YOU)</h3>
                                        ) : (
                                            <h3 className='tw-text-[12px] tw-font-bold'>{item.username}</h3>
                                        )}
                                        <p className='tw-text-[10px] tw-text-[#A7A7A7]'>{item.userStatus}</p>
                                    </div>
    
                                </div>
                            )
                        } else {
                            return (
                                <div className="tw-w-full tw-flex tw-items-center tw-mt-[10px]">
                                    {item.profile != "" ? (
                                    <div className='tw-w-[40px] tw-h-[40px] tw-rounded-[5px] tw-bg-[#272727]'>
                                        <img src={item.profile} alt="profile picture" className='tw-w-full tw-h-full tw-object-cover tw-rounded-[5px]'/>
                                    </div>
                                ) : (
                                    <div className="tw-flex tw-justify-center tw-rounded-[5px] tw-items-center tw-text-[18px] tw-w-[40px] tw-h-[40px] tw-bg-[#272727]">
                                    {item["username"][0]}
                                    </div>
                                )}
    
                                    <div className='tw-ml-[10px]'>
                                        {item.uid === auth.currentUser.uid ? (
                                            <h3 className='tw-text-[12px] tw-font-bold'>{item.username} (YOU)</h3>
                                        ) : (
                                            <h3 className='tw-text-[12px] tw-font-bold'>{item.username}</h3>
                                        )}
                                        <p className='tw-text-[10px] tw-text-[#A7A7A7]'>{item.userStatus}</p>
                                    </div>
    
                                </div>
                            )
                        }
                    })}

                    </div>
                ) : (
                    <div className='tw-w-full tw-h-full tw-flex tw-justify-center tw-items-center'>
                        <CircularProgress />
                    </div>
                )}
            </>
        )}
    </div>
  )
}

export default UserComponent