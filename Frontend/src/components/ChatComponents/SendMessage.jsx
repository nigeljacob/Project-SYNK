import React from "react";

const SendMessage = ({ message }) => {
  return (
    <div className="tw-flex tw-justify-end tw-text-[black] tw-mt-[10px]">
      <div className="tw-flex tw-flex-col tw-items-end">
        <div className="tw-bg-[#5BCEFF] tw-w-fit tw-py-[5px] tw-px-[10px] tw-rounded-[5px] tw-max-w-[400px]">
          {message.message}
        </div>
        <div className="tw-text-[white]">
          <div className="tw-flex tw-flex-col tw-items-end tw-text-[12px] tw-m-[5px]">
            <p>{message.date}</p>

            <p>{message.time}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendMessage;
