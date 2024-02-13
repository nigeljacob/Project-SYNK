import "./TaskDetails.css";
import "../../Pages/TeamDashboard/TeamDashboard"

const TaskDetails = ({ index, taskDesc, taskStatus, setViewTaskTrigger, viewTaskTrigger }) => {
  return (
    <div className="single-task-container">
      <p>{index + ". " + taskDesc}</p>

      <div className="status-container">
        <select
          name="status"
          className={
            taskStatus === "Completed" ? "green-status" : "yellow-status"
          }
        >
          <option value="start" disabled selected hidden>
            {taskStatus}
          </option>
          <option value="inProgress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        {taskStatus !== "Completed" ? (
          <div className="status">In Progress</div>
        ) : (
          <div >
            <button className="status" onClick={event => {
            let popupLayout = document.getElementById("popupLayout2");
              if(viewTaskTrigger) {
                popupLayout.style.background = "rgba(0,0,0,0)"
              } else {
                popupLayout.style.visibility = "visible";
                setTimeout(() => {
                  popupLayout.style.background = "rgba(0,0,0,0.7)"
                }, 100);
            setViewTaskTrigger(true);

            }}}>Completed</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetails;
