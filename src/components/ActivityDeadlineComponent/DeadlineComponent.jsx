import clockImage from "../../assets/images/clock.svg";

import React from "react";

const DeadlineComponent = ({ taskDeadlineDate, taskDetailsParagraph }) => {
  return (
    <div className="deadline-container">
      <div className="clock-container">
        <img src={clockImage} alt="clock" />
        <div className="deadline-text-container">
          <h2>{taskDeadlineDate}</h2>
          <p>{taskDetailsParagraph}</p>
        </div>
      </div>

      <button className="continue-btn">Continue</button>
    </div>
  );
};

export default DeadlineComponent;
