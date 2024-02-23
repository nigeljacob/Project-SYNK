import React from "react";
import {
  retrieveProfilePicture,
  retrieveSenderData,
} from "../../../../Backend/src/chat.js";

const ReceiveMessage = ({ message }) => {
  const profilePicture = retrieveProfilePicture(message.senderUID);

  //   let userData = retrieveSenderData(message.senderUID).catch((error) => {
  //     alert("Failed to retrieve user data");
  //   });

  return (
    <div className="tw-flex tw-mt-[10px]">
      <div className="tw-mr-[10px] tw-mt-[-10px]">
        <img
          src={
            profilePicture !== null
              ? profilePicture
              : "https://www.w3schools.com/howto/img_avatar.png"
          }
          alt="profilePhoto"
          className="tw-rounded-full tw-w-[35px] tw-h-[35px] tw-object-cover"
        />
      </div>
      <div className="tw-flex tw-flex-col tw-items-start">
        <p className="tw-text-[12px] tw-mb-[5px]">Sevinda</p>
        <div className="tw-bg-[#272727] tw-w-fit tw-py-[5px] tw-px-[10px] tw-rounded-[5px] tw-max-w-[400px]">
          {message.message}
        </div>
        <div className="tw-text-[white]">
          <div className="tw-flex tw-flex-col tw-items-start tw-text-[12px] tw-m-[5px]">
            <p>{message.date}</p>
            <p>{message.time}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiveMessage;
