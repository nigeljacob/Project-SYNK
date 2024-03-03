import React, { useEffect, useState } from "react";
import {
  retrieveProfilePicture,
  retrieveSenderData,
} from "../../../../Backend/src/chat.js";
import { getProfilePicture } from "../../../../Backend/src/UserAccount.js";

const ReceiveMessage = ({ message }) => {
  const [proflePicture, setProfiePicture] = useState(null);

  useEffect(() => {
    getProfilePicture(message.senderUID, (data) => {
      if(data != "") {
        setProfiePicture(data)
      }
    })
  }, [])

  var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;

  function isOnlyEmojis(str) {
    return str.match(regex) !== null && str.match(regex).join('') === str;
  }

  return (
    <div className="tw-flex tw-mt-[15px]">
      <div className="tw-mr-[10px] tw-mt-[-10px]">
        <img
          src={
            proflePicture !== null
              ? proflePicture
              : "https://www.w3schools.com/howto/img_avatar.png"
          }
          alt="profilePhoto"
          className="tw-rounded-full tw-w-[35px] tw-h-[35px] tw-object-cover"
        />
      </div>
      <div className="tw-flex tw-flex-col tw-items-start">
        <p className="tw-text-[12px] tw-mb-[5px]">{message.senderName}</p>
        {isOnlyEmojis(message.message) ? (
          <div className=" tw-w-fit tw-py-[5px] tw-px-[10px] tw-rounded-[5px] tw-max-w-[400px] tw-text-[55px]">
          <h5>{message.message}</h5>
        </div>
        ) : (
          <div className="tw-bg-[#272727] tw-w-fit tw-py-[5px] tw-px-[10px] tw-rounded-[5px] tw-max-w-[400px] tw-text-[15px]">
          <h5>{message.message}</h5>
        </div>
        )}
        <div className="tw-text-[white]">
          <div className="tw-flex tw-flex-col tw-items-start tw-text-[12px] tw-m-[5px] tw-text-[#A7A7A7]">
            <p>{message.date}</p>
            <p>{message.time}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiveMessage;
