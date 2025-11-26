import React, { useEffect, useState } from "react";
import { Button, Input, Textarea, Spacer, Card } from "@nextui-org/react";
import { ArrowLeft } from "lucide-react";
import { useAppContext } from "../AppProvider";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const CreateUpdateTaskListScreen: React.FC = () => {
  const { state, api } = useAppContext();
  const { listId } = useParams();
  const navigate = useNavigate();

  const [isUpdate, setIsUpdate] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState<string | undefined>("");

  const findTaskList = (taskListId: string) => {
    const filtered = state.taskLists.filter((tl) => taskListId === tl.id);
    return filtered.length === 1 ? filtered[0] : null;
  };

  const populateTaskList = (taskListId: string) => {
    const taskList = findTaskList(taskListId);
    if (taskList) {
      setTitle(taskList.title);
      setDescription(taskList.description || "");
      setIsUpdate(true);
    }
  };

  useEffect(() => {
    if (listId) {
      if (!state.taskLists) {
        api.fetchTaskLists().then(() => populateTaskList(listId));
      } else {
        populateTaskList(listId);
      }
    }
  }, [listId]);

  const createUpdateTaskList = async () => {
    try {
      if (isUpdate && listId) {
        await api.updateTaskList(listId, {
          id: listId,
          title,
          description,
          count: undefined,
          progress: undefined,
          tasks: undefined,
        });
      } else {
        await api.createTaskList({
          title,
          description,
          count: undefined,
          progress: undefined,
          tasks: undefined,
        });
      }
      navigate("/");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">

      {/* Centered header */}
      <div className="relative mb-6 flex items-center">

        {/* Back button */}
        <Button
          variant="ghost"
          className="absolute left-0"
          onPress={() => navigate("/")}
        >
          <ArrowLeft size={20} />
        </Button>

        {/* Title */}
        <h1 className="text-xl font-bold mx-auto">
          {isUpdate ? "Update Task List" : "Create Task List"}
        </h1>
      </div>

      {/* Error */}
      {error && <Card className="p-3 mb-4 text-red-500">{error}</Card>}

      {/* Form */}
      <form onSubmit={(e) => e.preventDefault()}>
        <Input
          label="Title"
          placeholder="Enter task list title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          fullWidth
        />

        <Spacer y={1} />

        <Textarea
          label="Description"
          placeholder="Enter task list description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
        />

        <Spacer y={2} />

        <Button color="primary" fullWidth onPress={createUpdateTaskList}>
          {isUpdate ? "Update Task List" : "Create Task List"}
        </Button>
      </form>
    </div>
  );
};

export default CreateUpdateTaskListScreen;
