import Navbar from "../components/Navbar";
import TaskList from "../tasks/TaskList";

const Dashboard = () => {
  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <TaskList />
      </div>
    </>
  );
};

export default Dashboard;
