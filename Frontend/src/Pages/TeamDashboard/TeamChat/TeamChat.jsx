import { useEffect, useRef, useState } from "react";
import ReceiveMessage from "../../../components/ChatComponents/ReceiveMessage";
import SendMessage from "../../../components/ChatComponents/SendMessage.jsx";
import { IoSend } from "react-icons/io5";
import { sendTeamMessage, fetchMessage, decrypt } from "../../../utils/chat";

import React from "react";

import { auth } from "../../../utils/firebase";
import { fireEvent } from "@testing-library/react";
import { sendNotification } from "../../../utils/teamFunctions";

const TeamChat = ({ user, team }) => {
  let [messageList, setMessageList] = useState([]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  scrollToBottom();

  let firstTime = true;

  useEffect(() => {
    const onDataReceived = (data) => {
      for (let i = 0; i < data.length; i++) {
        data[i].message = decrypt(data[i].message);
      }
      setMessageList(data);
      scrollToBottom();
    };

    fetchMessage(onDataReceived, team.teamCode);
  }, [messageList.length]);

  const [message, setMessage] = useState("");

  let teamMembers = [];

  for (let i = 0; i < team.teamMemberList.length; i++) {
    if (team.teamMemberList[i]["UID"] != team.teamLeader.UID) {
      if (!teamMembers.includes(team.teamMemberList[i].UID)) {
        teamMembers.push(team.teamMemberList[i].UID);
      }
    }
  }

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (message === "") return;

    sendTeamMessage(
      message,
      auth.currentUser.uid,
      team.teamCode,
      auth.currentUser.email,
      auth.currentUser.displayName
    );

    setMessage("");

    let teamMembers = [];

    for (let i = 0; i < team.teamMemberList.length; i++) {
      if (team.teamMemberList[i]["UID"] != auth.currentUser.uid) {
        teamMembers.push(team.teamMemberList[i].UID);
      }
    }

    sendNotification(
      "New Chat" + " @ " + team.teamName,
      user.displayName + ": " + message,
      "info",
      teamMembers,
      "chat",
      auth.currentUser.uid
    );
  };

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
            return <ReceiveMessage key={index} message={message} />;
          }
        })}
        <div ref={messagesEndRef} />
      </div>

      <div>
        <form className="tw-flex" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Type a message"
            className="tw-w-full tw-py-[10px] tw-px-[20px] tw-rounded-sm tw-bg-[#272727] tw-text-[white] tw-m-[10px] tw-border-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></input>
          <button type="submit">
            <IoSend className="tw-w-[25px] tw-h-[25px]" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeamChat;
