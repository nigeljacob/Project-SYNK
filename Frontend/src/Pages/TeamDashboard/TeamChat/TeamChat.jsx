import ReceiveMessage from "../../../components/ChatComponents/ReceiveMessage";
import SendMessage from "../../../components/ChatComponents/SendMessage.jsx";

import { IoSend } from "react-icons/io5";

import React from "react";

// const handleSendClick = (e) => {
//   e.preventDefault();
// };

const TeamChat = ({ user }) => {
  let messageList = [
    {
      message: "Haloo my name is Sevinda. HAHAHAH i dont know what to write",
      time: "13.23",
      date: "2025/02",
      senderUID: "123",
    },
    {
      message: "Haloo my name is Sevinda. HAHAHAH i dont know what to write",
      time: "13.23",
      date: "2025/02/01",
      senderUID: "123",
    },
    {
      message: "I am Nigel Jacob please stay away from me. Omg i am Nigel",
      time: "13.23",
      date: "2025/02/01",
      senderUID: user.uid,
    },
    {
      message: "Haloo my name is Sevinda. HAHAHAH i dont know what to write",
      time: "13.23",
      date: "2025/02/01",
      senderUID: "123",
    },
    {
      message: "Haloo my name is Sevinda",
      time: "13.23",
      date: "2025/02/01",
      senderUID: "123",
    },
    {
      message: "I am Nigel Jacob please stay away from me. Omg i am Nigel",
      time: "13.23",
      date: "2025/02/01",
      senderUID: user.uid,
    },
    {
      message: "I am Nigel Jacob please stay away from me. Omg i am Nigel",
      time: "13.23",
      date: "2025/02/01",
      senderUID: user.uid,
    },
    {
      message: "I am Nigel Jacob please stay away from me",
      time: "13.23",
      date: "2025/02/01",
      senderUID: user.uid,
    },
    {
      message: "I am Nigel Jacob please stay away from me",
      time: "13.23",
      date: "2025/02/01",
      senderUID: user.uid,
    },
    {
      message: "Haloo my name is Sevinda",
      time: "13.23",
      date: "2025/02/01",
      senderUID: "123",
    },
    {
      message: "I am Nigel Jacob please stay away from me",
      time: "13.23",
      date: "2025/02/01",
      senderUID: user.uid,
    },
    {
      message: "I am Nigel Jacob please stay away from me. ",
      time: "13.23",
      date: "2025/02/01",
      senderUID: user.uid,
    },
    {
      message: "Haloo my name is Sevinda",
      time: "13.23",
      date: "2025/02/01",
      senderUID: "123",
    },
  ];

  return (
    <div>
      <div className="tw-pt-[50px] tw-h-[calc(100vh_-_120px)] tw-overflow-y-scroll">
        {messageList.map((message, index) => {
          if (message.senderUID === user.uid) {
            return (
              // <SendMessage key={index} message={message["message"]} time={message["time"]} />
              <SendMessage key={index} message={message} />
            );
          } else {
            return (
              // <ReceiveMessage
              //   message={message["message"]}
              //   time={message["time"]}
              //   senderUID={message["senderUID"]}
              //   key={index}
              // />
              <ReceiveMessage key={index} message={message} />
            );
          }
        })}
      </div>

      <div>
        <form className="tw-flex">
          <input
            type="text"
            placeholder="Type a message"
            className="tw-w-full tw-py-[10px] tw-px-[20px] tw-rounded-sm tw-bg-[#272727] tw-text-[white] tw-m-[10px] tw-border-none"
          ></input>
          <button
            type="submit"
            // onSubmit={handleSendClick()}
          >
            <IoSend className="tw-w-[25px] tw-h-[25px]" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeamChat;
