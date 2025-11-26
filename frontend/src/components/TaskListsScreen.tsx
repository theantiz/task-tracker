import { Button, Card, CardBody, Progress } from "@nextui-org/react";
import { List, Plus } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../AppProvider";

const TaskListScreen: React.FC = () => {
  const { state, api } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (state.taskLists == null) {
      api.fetchTaskLists();
    }
  }, [state]);

  return (
    <div className="w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">My Task Lists</h1>

      <Button
        onPress={() => navigate("/new-task-list")}
        color="primary"
        startContent={<Plus size={20} />}
        className="w-full mb-6"
      >
        Create New Task List
      </Button>

      {state.taskLists.map((list) => (
        <Card
          key={list.id}
          className="mb-4 w-full cursor-pointer"
          role="button"
          onClick={() => navigate(`/task-lists/${list.id}`)}
        >
          <CardBody>
            <div className="flex items-center">
              <List size={20} className="mr-2 opacity-40" />
              <h2 className="text-lg font-semibold">{list.title}</h2>
            </div>

            <p className="text-sm text-gray-500 mt-1">{list.count} tasks</p>

            <Progress
              value={list.progress ? list.progress * 100 : 0}
              className="mt-2"
              color="primary"
            />
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default TaskListScreen;
