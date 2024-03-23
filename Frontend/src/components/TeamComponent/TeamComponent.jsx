import React, { useEffect, useState } from "react";
import "./TeamComponent.css";
import * as FaIcons from "react-icons/fa";
import { Link } from "react-router-dom";
import { getProfilePicture } from "../../utils/UserAccount";
import { Tooltip } from "@mui/material";
const { differenceInDays, differenceInMonths } = require("date-fns");
import ReactHover, { Trigger, Hover } from "react-hover";
import UserComponent from "../UserComponent/UserComponent";

const TeamMemberProfileComponent = ({ item, profilePictures, index }) => {
  const [isHovering, setIsHovering] = useState(false);
  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };

  return (
    <div className="memberProfile">
      {isHovering && (
        <UserComponent UID={item.UID} type="Single" setTriger={setIsHovering} />
      )}
      <div
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        className="tw-cursor-pointer"
      >
        {profilePictures[index] === undefined ||
        profilePictures[index] === null ||
        profilePictures[index] === "" ? (
          <div className="memberExtra">
            <h3 className="tw-text-white tw-text-[13px]">{item.name[0]}</h3>
          </div>
        ) : (
          <img src={profilePictures[index]} alt="mmm" className="img" />
        )}
      </div>
    </div>
  );
};

const TeamMemberExtraComponent = ({ item, team, index }) => {
  const [isHovering, setIsHovering] = useState(false);
  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };

  let List = team["teamMemberList"].slice(3, team["teamMemberList"].length);

  return (
    <div className="memberProfile">
      {isHovering && (
        <UserComponent UID={List} type="All" setTriger={setIsHovering} />
      )}
      <div
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        className="tw-cursor-pointer"
      >
        <div className="memberExtra">
          <p>+{team["teamMemberList"].length - index}</p>
        </div>
      </div>
    </div>
  );
};

function TeamComponent({ team, teamsList }) {
  const isAvailable = team["teamProfile"] !== "";
  const nameList = team["teamName"].split(" ");
  const isLarger = nameList.length > 1;

  const optionsCursorTrueWithMargin = {
    followCursor: true,
    shiftX: 20,
    shiftY: 0,
  };

  let [profilePictures, setProfilePictures] = useState(["", "", ""]);

  let tempProfilePictures = [];

  if (team.teamMemberList.length > 2) {
    for (let i = 0; i < 3; i++) {
      getProfilePicture(team.teamMemberList[i].UID, (data) => {
        if (data != "") {
          tempProfilePictures[i] = data;
        }
      });
    }
  } else {
    for (let i = 0; i < team.teamMemberList.length; i++) {
      getProfilePicture(team.teamMemberList[i].UID, (data) => {
        if (data != "") {
          tempProfilePictures[i] = data;
        }
      });
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setProfilePictures(tempProfilePictures);
    }, 500);
  }, tempProfilePictures);

  return (
    <div className="teamWrapper ">
      {team["teamStatus"] === "Active" ? (
        <div className="teamStatus tw-bg-[#284829]">
          <h3>{team["teamStatus"]}</h3>
        </div>
      ) : (
        <div className="teamStatus tw-bg-[#39401C]">
          <h3 className="tw-text-yellow-400">{team["teamStatus"]}</h3>
        </div>
      )}
      <div className="teamProfile">
        <div className="profile">
          {isAvailable ? (
            <img src={team["teamProfile"]} alt="profileImage" />
          ) : isLarger ? (
            <h1>
              {nameList[0].substring(0, 1).toUpperCase()}
              {nameList[nameList.length - 1].substring(0, 1).toUpperCase()}
            </h1>
          ) : (
            <h1>{nameList[0].substring(0, 1).toUpperCase()}</h1>
          )}
        </div>
        <div className="teamTitle">
          <h3 id="teamName">{team["teamName"]}</h3>
          <h5 id="membersLength">{team["teamMemberList"].length} Members</h5>
        </div>
      </div>
      <div className="teamDesc">
        <p id="teamDesc">{team["teamDescription"]}</p>
      </div>
      <div className="projectLength">
        <FaIcons.FaClock />
        <h3>{calculateProjectLength()}</h3>
        <h3 id="remaining">{calculateProjectRemaining()}</h3>
      </div>
      <div className="memberProfiles">
        {team["teamMemberList"].map((item, index) => {
          if (index < 3) {
            return (
              <div>
                <TeamMemberProfileComponent
                  item={item}
                  profilePictures={profilePictures}
                  index={index}
                />
              </div>
            );
          } else if (index === 3) {
            return (
              <div>
                <TeamMemberExtraComponent
                  item={item}
                  team={team}
                  index={index}
                />
              </div>
            );
          } else {
            return null;
          }
        })}
      </div>

      <div className="buttons">
        <Link
          to="/memberDashboard"
          state={{ Team: team }}
          className="teamButton"
        >
          <div>
            <h3>View Team</h3>
          </div>
        </Link>
      </div>
    </div>
  );

  function calculateProjectRemaining() {
    let newDate = new Date();
    let month = newDate.getMonth() + 1;

    const startDateStr =
      newDate.getFullYear() + "-" + month + "-" + newDate.getDate();
    const endDate = team.projectLength.split("/");

    const endDateStr = endDate[2] + "-" + endDate[1] + "-" + endDate[0];

    const dateLength = calculateDateLength(startDateStr, endDateStr);

    return dateLength.months + " M " + dateLength.days + " d";
  }

  function calculateProjectLength() {
    const startDate = team.startDate.split("/");
    const endDate = team.projectLength.split("/");

    const startDateStr = startDate[2] + "-" + startDate[1] + "-" + startDate[0];
    const endDateStr = endDate[2] + "-" + endDate[1] + "-" + endDate[0];

    const dateLength = calculateDateLength(startDateStr, endDateStr);

    return dateLength.months + " Months";
  }
}

// Function to calculate the length of the date range in days and months
function calculateDateLength(startDateStr, endDateStr) {
  // Parse the start and end dates
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  // Calculate the difference in days
  const differenceDays = differenceInDays(endDate, startDate);

  // Calculate the difference in months
  const differenceMonths = differenceInMonths(endDate, startDate);

  return {
    months: differenceMonths,
    days: differenceDays % 30, // get the remaining days after subtracting complete months
  };
}

export default TeamComponent;
