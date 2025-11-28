import {
  Button,
  Card,
  CardBody,
  Checkbox,
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
import { TaskStatus } from "../domain/TaskStatus";
import Task from "../domain/Task";

const TasksScreen: React.FC = () => {
  const { state, api } = useAppContext();
  const { listId } = useParams<{ listId: string }>();
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 480);
  const [isLoading, setIsLoading] = useState(true);

  const taskList = state.taskLists.find((tl) => tl.id === listId);

  useEffect(() => {
    const load = async () => {
      if (!listId) return;
      setIsLoading(true);

      try {
        if (!taskList) await api.getTaskList(listId);
        await api.fetchTasks(listId);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [listId]);

  useEffect(() => {
    const r = () => setIsMobile(window.innerWidth < 480);
    window.addEventListener("resize", r);
    return () => window.removeEventListener("resize", r);
  }, []);

  const tasks = useMemo(() => {
    const taskArray = listId ? state.tasks[listId] || [] : [];
    return taskArray.sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.getTime() - b.dueDate.getTime();
    });
  }, [listId, state.tasks]);

  const completion = useMemo(() => {
    if (!tasks.length) return 0;
    const closed = tasks.filter(t => t.status === TaskStatus.CLOSED).length;
    return (closed / tasks.length) * 100;
  }, [tasks]);

  // FIXED FUNCTION: accepts Date OR string
  const formatDate = (date: string | Date) => {
    const d = date instanceof Date ? date : new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const toggleStatus = async (task: Task) => {
    if (!listId || !task.id) return;

    await api.updateTask(listId, task.id, {
      ...task,
      status:
        task.status === TaskStatus.CLOSED
          ? TaskStatus.OPEN
          : TaskStatus.CLOSED,
    });
  };

  if (isLoading) return <Spinner className="mt-10" />;

  return (
    <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl mx-auto px-4 py-4">

      {/* Header */}
      <div className="relative flex items-center justify-center mb-4">

        <Button
          variant="ghost"
          className="absolute left-0"
          onPress={() => navigate("/")}
        >
          <ArrowLeft />
        </Button>

        <h1 className="text-xl sm:text-2xl font-bold">{taskList?.title}</h1>

        <Button
          variant="ghost"
          className="absolute right-0"
          onPress={() => navigate(`/edit-task-list/${listId}`)}
        >
          <Edit />
        </Button>
      </div>

      <Progress value={completion} className="mb-4" />

      <Button
        className="w-full mb-4"
        onPress={() => navigate(`/task-lists/${listId}/new-task`)}
        startContent={<Plus />}
      >
        Add Task
      </Button>

      {/* MOBILE CARD VIEW */}
      {isMobile ? (
        <div className="space-y-3">
          {tasks.map(task => (
            <Card key={task.id}>
              <CardBody className="p-3">
                <div className="flex justify-between items-center">
                  <Checkbox
                    isSelected={task.status === TaskStatus.CLOSED}
                    onValueChange={() => toggleStatus(task)}
                  />
                  <span className="text-sm font-semibold">{task.title}</span>
                </div>

                <p className="text-xs text-gray-400">Priority: {task.priority}</p>

                {task.dueDate && (
                  <p className="text-xs text-gray-400">
                    Due: {formatDate(task.dueDate)}
                  </p>
                )}

                <div className="flex space-x-2 mt-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onPress={() =>
                      navigate(`/task-lists/${listId}/edit-task/${task.id}`)
                    }
                  >
                    <Edit size={16} /> Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onPress={() => api.deleteTask(listId!, task.id!)}
                  >
                    <Trash size={16} /> Delete
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableColumn>Done</TableColumn>
            <TableColumn>Title</TableColumn>
            <TableColumn>Priority</TableColumn>
            <TableColumn>Due</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {tasks.map(task => (
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
                  {task.dueDate && formatDate(task.dueDate)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    onPress={() =>
                      navigate(`/task-lists/${listId}/edit-task/${task.id}`)
                    }
                  >
                    <Edit />
                  </Button>

                  <Button
                    variant="ghost"
                    onPress={() => api.deleteTask(listId!, task.id!)}
                  >
                    <Trash />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Spacer y={4} />

      <Button
        color="danger"
        className="w-full sm:w-auto"
        startContent={<Minus />}
        onPress={() => {
          api.deleteTaskList(listId!);
          navigate("/");
        }}
      >
        Delete TaskList
      </Button>
    </div>
  );
};

export default TasksScreen;
