import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TaskLists from "./components/TaskListsScreen";
import CreateUpdateTaskListScreen from "./components/CreateUpdateTaskListScreen";
import TaskListScreen from "./components/TasksScreen";
import CreateUpdateTaskScreen from "./components/CreateUpdateTaskScreen";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">

        {/* Main content wrapper */}
        <main className="flex-1 flex justify-center items-center">
          <Routes>
            <Route path="/" element={<TaskLists />} />
            <Route path="/new-task-list" element={<CreateUpdateTaskListScreen />} />
            <Route path="/edit-task-list/:listId" element={<CreateUpdateTaskListScreen />} />
            <Route path="/task-lists/:listId" element={<TaskListScreen />} />
            <Route path="/task-lists/:listId/new-task" element={<CreateUpdateTaskScreen />} />
            <Route path="/task-lists/:listId/edit-task/:taskId" element={<CreateUpdateTaskScreen />} />
          </Routes>
        </main>

        {/* Footer always bottom */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
