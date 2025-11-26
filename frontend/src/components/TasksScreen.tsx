import { parseDate } from "@internationalized/date";
import {
  Button,
  Card,
  CardBody,
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 480);

  const taskList = state.taskLists.find((tl) => tl.id === listId);

  // -----------------------------
  // Load TaskList & Tasks
  // -----------------------------
  useEffect(() => {
    const load = async () => {
      if (!listId) return;

      setIsLoading(true);
      try {
        if (!taskList) {
          await api.getTaskList(listId);
        }
        await api.fetchTasks(listId);
      } catch (e) {
        console.log("Tasks fetch error", e);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [listId]);

  // -----------------------------
  // Mobile detection resize
  // -----------------------------
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 480);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // -----------------------------
  // Toggle task status
  // -----------------------------
  const toggleStatus = async (task: Task) => {
    if (!listId || !task.id) return;

    const updated: Task = {
      ...task,
      status:
        task.status === TaskStatus.CLOSED
          ? TaskStatus.OPEN
          : TaskStatus.CLOSED,
    };

    await api.updateTask(listId, task.id, updated);
    await api.fetchTasks(listId);
  };

  // -----------------------------
  // Delete TaskList
  // -----------------------------
  const deleteTaskList = async () => {
    if (!listId) return;
    await api.deleteTaskList(listId);
    navigate("/");
  };

  // -----------------------------
  // Completion %
  // -----------------------------
  const completionPercentage = useMemo(() => {
    const tasks = state.tasks[listId || ""];
    if (!tasks || tasks.length === 0) return 0;

    const closed = tasks.filter((t) => t.status === TaskStatus.CLOSED).length;
    return (closed / tasks.length) * 100;
  }, [state.tasks, listId]);

  const tasks = listId ? state.tasks[listId] || [] : [];

  // -----------------------------
  // Table rows for desktop
  // -----------------------------
  const tableRows = () =>
    tasks.map((task) => (
      <TableRow key={task.id}>
        <TableCell>
          <Checkbox
            aria-label="Toggle task completion"
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
              aria-label="Due date"
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
              aria-label="Edit task"
              onPress={() =>
                navigate(`/task-lists/${listId}/edit-task/${task.id}`)
              }
            >
              <Edit className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              aria-label="Delete task"
              onPress={() => task.id && api.deleteTask(listId!, task.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    ));

  // -----------------------------
  // Loading
  // -----------------------------
  if (isLoading) return <Spinner className="mt-10" />;

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-4">

      {/* Header */}
      <div
        className={`flex ${
          isMobile ? "flex-col space-y-2 items-center" : "items-center justify-between"
        } mb-4`}
      >
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            aria-label="Go back"
            onPress={() => navigate("/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className={isMobile ? "text-xl font-bold" : "text-2xl font-bold"}>
            {taskList?.title || "Task List"}
          </h1>
        </div>

        <Button
          variant="ghost"
          aria-label="Edit task list"
          size={isMobile ? "sm" : "md"}
          onPress={() => navigate(`/edit-task-list/${listId}`)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>

      {/* Progress */}
      <Progress value={completionPercentage} className="mb-4" />

      {/* Add Task */}
      <Button
        className="w-full mb-4"
        size={isMobile ? "sm" : "md"}
        onPress={() => navigate(`/task-lists/${listId}/new-task`)}
        startContent={<Plus className="h-4 w-4" />}
      >
        Add Task
      </Button>

      {/* Mobile View */}
      {isMobile ? (
        <div className="space-y-3">
          {tasks.map((task) => (
            <Card key={task.id} className="w-full">
              <CardBody className="p-4">

                <div className="flex justify-between items-center mb-2">
                  <Checkbox
                    aria-label="Toggle task completion"
                    isSelected={task.status === TaskStatus.CLOSED}
                    onValueChange={() => toggleStatus(task)}
                  />

                  <span className="font-semibold text-sm break-words">{task.title}</span>
                </div>

                <div className="text-xs text-gray-400 mb-2">
                  Priority: {task.priority}
                </div>

                {task.dueDate && (
                  <div className="text-xs text-gray-400 mb-2">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label="Edit task"
                    onPress={() =>
                      navigate(`/task-lists/${listId}/edit-task/${task.id}`)
                    }
                  >
                    <Edit className="h-4 w-4" /> Edit
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label="Delete task"
                    onPress={() => task.id && api.deleteTask(listId!, task.id)}
                  >
                    <Trash className="h-4 w-4" /> Delete
                  </Button>
                </div>

              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <div className="border rounded-xl overflow-hidden shadow">
          <Table aria-label="Tasks table">{/* @ts-ignore */}
            <TableHeader>
              <TableColumn>Done</TableColumn>
              <TableColumn>Title</TableColumn>
              <TableColumn>Priority</TableColumn>
              <TableColumn>Due Date</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody>{tableRows()}</TableBody>
          </Table>
        </div>
      )}

      <Spacer y={4} />

      <div className="flex justify-end">
        <Button
          color="danger"
          size={isMobile ? "sm" : "md"}
          onPress={deleteTaskList}
          startContent={<Minus />}
        >
          Delete TaskList
        </Button>
      </div>
    </div>
  );
};

export default TasksScreen;
