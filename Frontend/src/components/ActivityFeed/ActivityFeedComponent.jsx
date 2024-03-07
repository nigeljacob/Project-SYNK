import React, { useEffect, useState } from "react";
import './ActivityFeed.css'
import { read_OneValue_from_Database } from "../../../../Backend/src/firebaseCRUD";
import { auth } from "../../../../Backend/src/firebase";

const ActivityFeedComponent = ({ isLast, notification}) => {

  let [userProfile, setUserProfile] = useState("")

  useEffect(() => {
    read_OneValue_from_Database("Users/" + notification.ID + "/profile", (profile) => {
      setUserProfile(profile)
    })
  }, [])

  return (
    <div className="tw-mt-[10px] tw-flex-shrink-0 feedAnimation">
      <div className="tw-flex tw-items-center">
        <div className="tw-w-[35px] tw-h-[35px] tw-rounded-[50%] tw-bg-[#0B0B0B] tw-flex tw-items-center tw-justify-center tw-flex-shrink-0">

          {notification.notificationType === "feed -joinRequest" ? (
              
              userProfile != "" ? (
                <img
                  src= {userProfile}
                  alt=""
                  className="tw-rounded-[50%] tw-object-cover"
              />
              ) : (
                <img
                  src="https://www.w3schools.com/howto/img_avatar.png"
                  alt=""
                  className="tw-rounded-[50%] tw-object-cover"
                />
              )
            ) : (
              notification.notificationType === "feed -teamRequestAccepted" ? (
                notification.title.split("@")[1].trim().split(" ").length > 1 ? (
                  <h3 className="tw-text-[12px] tw-font-bold">{notification.title.split("@")[1].trim().split(" ")[0][0].toUpperCase()}{notification.title.split("@")[1].trim().split(" ")[1][0].toUpperCase()}</h3>
                ) : (
                  <h3 className="tw-text-[12px] tw-font-bold">{notification.title.split("@")[1].trim().split(" ")[0][0].toUpperCase()}</h3>
                )
              ) : (
                notification.notificationType === "feed -taskAssigned" ? (
                  notification.title.split("@")[1].trim().split(" ").length > 1 ? (
                    <h3 className="tw-text-[12px] tw-font-bold">{notification.title.split("@")[1].trim().split(" ")[0][0].toUpperCase()}{notification.title.split("@")[1].trim().split(" ")[1][0].toUpperCase()}</h3>
                  ) : (
                    <h3 className="tw-text-[12px] tw-font-bold">{notification.title.split("@")[1].trim().split(" ")[0][0].toUpperCase()}</h3>
                  )
                ) : (
                  notification.notificationType === "feed -taskDetailsUpdatedLeader" ? (
                    userProfile != "" ? (
                      <img
                        src= {userProfile}
                        alt=""
                        className="tw-rounded-[50%] tw-object-cover"
                    />
                    ) : (
                      <img
                        src="https://www.w3schools.com/howto/img_avatar.png"
                        alt=""
                        className="tw-rounded-[50%] tw-object-cover"
                      />
                    )
                  ) : (
                    notification.notificationType === "feed -taskCompleted" ? (
                      userProfile != "" ? (
                        <img
                          src= {userProfile}
                          alt=""
                          className="tw-rounded-[50%] tw-object-cover"
                      />
                      ) : (
                        <img
                          src="https://www.w3schools.com/howto/img_avatar.png"
                          alt=""
                          className="tw-rounded-[50%] tw-object-cover"
                        />
                      )
                    ) : null
                  )
                )
              )
            )}
        </div>

        <div className="tw-flex tw-justify-center tw-flex-col tw-items-center tw-ml-[10px]">
          <h3 className="tw-text-[10px]">{notification.date[0]}</h3>
          <h3 className="tw-text-[11px]">{notification.date[1]}</h3>
        </div>

        {notification.notificationType === "feed -joinRequest" ? (
          <h3 className="tw-text-[14px] tw-ml-[20px]">
          {notification.message.split(" ")[1] != "has" ? (
            <>
              <span className="tw-font-bold">{notification.message.split(" ")[0]} {notification.message.split(" ")[1]}</span> has requested to
              join <span className="tw-font-bold">{notification.title.split("@")[1].trim()}</span>
            </>
          ) : (
            <>
              <span className="tw-font-bold">{notification.message.split(" ")[0]}</span> has requested to
              join <span className="tw-font-bold">{notification.title.split("@")[1].trim()}</span>
            </>
          )}
          
          </h3>
        ) : (
          notification.notificationType === "feed -teamRequestAccepted" ? (
            <h3 className="tw-text-[14px] tw-ml-[10px]">
              Leader at <span className="tw-font-bold">{notification.title.split("@")[1].trim()}</span> has accepted your request
                to join the team
            </h3>
          ) : (
            notification.notificationType === "feed -taskAssigned" ? (
              <h3 className="tw-text-[14px] tw-ml-[10px]">
                 Leader at <span className="tw-font-bold">{notification.title.split("@")[1].trim()}</span> has assigned a task to you.
              </h3>
            ) : (
              notification.notificationType === "feed -taskDetailsUpdatedLeader" ? (
                <h3 className="tw-text-[14px] tw-ml-[10px]">
                {notification.title.split(" ")[1] != "@" ? (
                  <>
                    <span className="tw-font-bold">{notification.title.split(" ")[0]} {notification.title.split(" ")[1]}</span> has updated their task details at<span className="tw-font-bold"> {notification.title.split("@")[1].trim()}</span>
                  </>
                ) : (
                  <>
                    <span className="tw-font-bold">{notification.title.split(" ")[0]}</span> has updated their task details at 
                    <span className="tw-font-bold"> {notification.title.split("@")[1].trim()}</span>
                  </>
                )}
                
              </h3>
              ) : (
                notification.notificationType === "feed -taskCompleted" ? (
                  <h3 className="tw-text-[14px] tw-ml-[10px]">
                  {notification.message.split(" ")[1] != "has" ? (
                    <>
                      <span className="tw-font-bold">{notification.message.split(" ")[0]} {notification.message.split(" ")[1]}</span> has completed a task at <span className="tw-font-bold">{notification.title.split("@")[1].trim()}</span>
                    </>
                  ) : (
                    <>
                      <span className="tw-font-bold">{notification.message.split(" ")[0]}</span> has updated their task details at
                      <span className="tw-font-bold">{notification.title.split("@")[1].trim()}</span>
                    </>
                  )}
                  
                </h3>
                ) : null
              )
            )
          )
        )}
      </div>

      <div className="tw-min-h-[50px] tw-flex">
        {!isLast ? (
          <>
            <div className="tw-w-[35px] tw-flex tw-justify-center tw-items-center tw-h-full tw-min-h-[50px] tw-mt-[10px]">
              <span className="tw-border tw-border-white tw-h-full tw-min-h-[50px]"></span>
            </div>

            {notification.notificationType === "feed -joinRequest" ? (
              <></>
            ) : (
              notification.notificationType === "feed -teamRequestAccepted" ? (
                <></>
              ) : (
                notification.notificationType === "feed -taskAssigned" ? (
                  <p className="tw-text-[#A7A7A7] tw-text-[12px] tw-ml-[65px]">
                    {notification.message}
                  </p>
                ) : (
                  notification.notificationType === "feed -taskDetailsUpdatedLeader" ? (
                    <p className="tw-text-[#A7A7A7] tw-text-[12px] tw-ml-[65px]">
                    {notification.message}
                    </p>
                  ) : (
                    notification.notificationType === "feed -taskCompleted" ? (
                      <></>
                    ) : null
                  )
                )
              )
            )}
          </>
        ) : (
          <>
            <div className="tw-w-[35px] tw-flex tw-justify-center tw-items-center tw-h-full tw-min-h-[50px] tw-mt-[10px]">
              <span className="tw-h-full tw-min-h-[50px] fade"></span>
            </div>
            {notification.notificationType === "feed -joinRequest" ? (
              <></>
            ) : (
              notification.notificationType === "feed -teamRequestAccepted" ? (
                <></>
              ) : (
                notification.notificationType === "feed -taskAssigned" ? (
                  <p className="tw-text-[#A7A7A7] tw-text-[12px] tw-ml-[65px]">
                    {notification.message}
                  </p>
                ) : (
                  notification.notificationType === "feed -taskDetailsUpdatedLeader" ? (
                    <p className="tw-text-[#A7A7A7] tw-text-[12px] tw-ml-[65px]">
                    {notification.message}
                    </p>
                  ) : (
                    notification.notificationType === "feed -taskCompleted" ? (
                      <></>
                    ) : null
                  )
                )
              )
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ActivityFeedComponent;
