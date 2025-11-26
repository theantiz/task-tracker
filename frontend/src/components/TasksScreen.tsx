import { parseDate } from "@internationalized/date";
import {
  Button,
  Checkbox,
  DateInput,
  Progress,
  Spacer,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Spinner,
} from "@nextui-org/react";
import { ArrowLeft, Edit, Minus, Plus, Trash } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../AppProvider";
import Task from "../domain/Task";
import { TaskStatus } from "../domain/TaskStatus";

const TasksScreen: React.FC = () => {
  const { state, api } = useAppContext();
  const { listId } = useParams<{ listId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const taskList = state.taskLists.find((tl) => tl.id === listId);

  useEffect(() => {
    const load = async () => {
      if (!listId) return;

      setIsLoading(true);
      try {
        if (!taskList) {
          await api.getTaskList(listId);
        }

        try {
          await api.fetchTasks(listId);
        } catch (e) {
          console.log("Tasks not available yet");
        }
      } finally {
        setIsLoading(false);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listId]);

  const toggleStatus = async (task: Task) => {
    if (!listId || !task.id) return;

    const updated = {
      ...task,
      status:
        task.status === TaskStatus.CLOSED
          ? TaskStatus.OPEN
          : TaskStatus.CLOSED,
    };

    await api.updateTask(listId, task.id, updated);
    await api.fetchTasks(listId);
  };

  const deleteTaskList = async () => {
    if (!listId) return;
    await api.deleteTaskList(listId);
    navigate("/");
  };

  const completionPercentage = useMemo(() => {
    if (!listId) return 0;
    const tasks = state.tasks[listId];
    if (!tasks || tasks.length === 0) return 0;

    const closed = tasks.filter((t) => t.status === TaskStatus.CLOSED).length;
    return (closed / tasks.length) * 100;
  }, [state.tasks, listId]);

  const tableRows = () => {
    if (!listId) return [];

    const tasks = state.tasks[listId];
    if (!tasks) return [];

    return tasks.map((task) => (
      <TableRow key={task.id}>
        <TableCell>
          <Checkbox
            isSelected={task.status === TaskStatus.CLOSED}
            onValueChange={() => toggleStatus(task)}
          />
        </TableCell>

        <TableCell>{task.title}</TableCell>
        <TableCell>{task.priority}</TableCell>

        <TableCell>
          {task.dueDate && (
            <DateInput
              isDisabled
              defaultValue={parseDate(
                new Date(task.dueDate).toISOString().split("T")[0]
              )}
            />
          )}
        </TableCell>

        <TableCell>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              onClick={() =>
                navigate(`/task-lists/${listId}/edit-task/${task.id}`)
              }
            >
              <Edit className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              onClick={() => {
                if (listId && task.id) api.deleteTask(listId, task.id);
              }}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    ));
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <h1 className="text-2xl font-bold">
          {taskList ? taskList.title : "Unknown Task List"}
        </h1>

        <Button
          variant="ghost"
          onClick={() => navigate(`/edit-task-list/${listId}`)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>

      <Progress value={completionPercentage} className="mb-4" />

      <Button
        onClick={() => navigate(`/task-lists/${listId}/new-task`)}
        className="mb-4 w-full"
      >
        <Plus className="h-4 w-4" /> Add Task
      </Button>

      <div className="border rounded-lg overflow-hidden">
        <Table aria-label="Tasks list">
          <TableHeader>
            <TableColumn>Completed</TableColumn>
            <TableColumn>Title</TableColumn>
            <TableColumn>Priority</TableColumn>
            <TableColumn>Due Date</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>

          <TableBody>{tableRows()}</TableBody>
        </Table>
      </div>

      <Spacer y={4} />

      <div className="flex justify-end">
        <Button color="danger" startContent={<Minus />} onClick={deleteTaskList}>
          Delete TaskList
        </Button>
      </div>
    </div>
  );
};

export default TasksScreen;
