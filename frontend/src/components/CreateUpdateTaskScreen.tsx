import React, { useEffect, useState } from "react";
import { Button, Input, Textarea, Spacer, Card, Chip } from "@nextui-org/react";
import { ArrowLeft } from "lucide-react";
import { useAppContext } from "../AppProvider";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { TaskPriority } from "../domain/TaskPriority";
import { DatePicker } from "@nextui-org/date-picker";
import { TaskStatus } from "../domain/TaskStatus";
import { parseDate } from "@internationalized/date";

const CreateUpdateTaskScreen: React.FC = () => {
  const { state, api } = useAppContext();
  const { listId, taskId } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdate, setIsUpdate] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [priority, setPriority] = useState(TaskPriority.MEDIUM);
  const [status, setStatus] = useState<TaskStatus | undefined>(undefined);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      if (!listId || !taskId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        if (!state.taskLists.find(tl => tl.id === listId)) {
          await api.getTaskList(listId);
        }

        await api.getTask(listId, taskId);

        const task = state.tasks[listId]?.find(t => t.id === taskId);

        if (task) {
          setTitle(task.title);
          setDescription(task.description || "");
          setDueDate(task.dueDate ? new Date(task.dueDate) : undefined);
          setPriority(task.priority || TaskPriority.MEDIUM);
          setStatus(task.status);
        }

        setIsUpdate(true);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [listId, taskId]);

  const createUpdateTask = async () => {
    try {
      if (!listId) return;

      if (isUpdate && taskId) {
        await api.updateTask(listId, taskId, {
          id: taskId,
          title,
          description,
          dueDate,
          priority,
          status,
        });
      } else {
        await api.createTask(listId, {
          title,
          description,
          dueDate,
          priority,
          status: undefined,
        });
      }

      navigate(`/task-lists/${listId}`);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const handleDateChange = (date: Date | null) => {
    setDueDate(date || undefined);
  };

  const formatDateForPicker = (date: Date | undefined) => {
    if (!date) return undefined;
    return date.toISOString().split("T")[0];
  };

  if (isLoading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="w-full max-w-md mx-auto p-4">

      {/* Centered Header */}
      <div className="relative mb-6 flex items-center">

        {/* Back button */}
        <Button
          variant="ghost"
          className="absolute left-0"
          aria-label="Go back"
          onPress={() => navigate(`/task-lists/${listId}`)}
        >
          <ArrowLeft size={20} />
        </Button>

        {/* Title */}
        <h1 className="text-xl font-bold mx-auto">
          {isUpdate ? "Update Task" : "Create Task"}
        </h1>
      </div>

      {/* Error */}
      {error && <Card className="mb-3 p-4 text-red-500">{error}</Card>}

      <form onSubmit={(e) => e.preventDefault()}>
        <Input
          label="Title"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          fullWidth
        />

        <Spacer y={1} />

        <Textarea
          label="Description"
          placeholder="Enter task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
        />

        <Spacer y={1} />

        <DatePicker
          label="Due date (optional)"
          defaultValue={
            dueDate ? parseDate(formatDateForPicker(dueDate)!) : undefined
          }
          onChange={(newDate) =>
            handleDateChange(
              newDate ? new Date(newDate.toString()) : null
            )
          }
        />

        <Spacer y={2} />

        {/* Priority */}
        <div className="flex flex-col gap-1">
          {Object.values(TaskPriority).map((p) => (
            <Chip
              key={p}
              color={priority === p ? "primary" : "default"}
              variant={priority === p ? "solid" : "faded"}
              onClick={() => setPriority(p)}
              className="cursor-pointer text-xs"
              size="sm"
            >
              {p} Priority
            </Chip>
          ))}
        </div>

        <Spacer y={2} />

        <Button fullWidth color="primary" onPress={createUpdateTask}>
          {isUpdate ? "Update Task" : "Create Task"}
        </Button>
      </form>
    </div>
  );
};

export default CreateUpdateTaskScreen;
