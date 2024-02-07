import "../Pages/TeamDashboard.css";

const TaskDetails = ({ index, taskDesc, taskStatus }) => {
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
          <div className="status">Completed</div>
        )}
      </div>
    </div>
  );
};

export default TaskDetails;
