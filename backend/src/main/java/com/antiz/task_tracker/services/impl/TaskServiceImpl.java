package com.antiz.task_tracker.services.impl;

import com.antiz.task_tracker.domain.entities.Task;
import com.antiz.task_tracker.domain.entities.TaskList;
import com.antiz.task_tracker.domain.entities.TaskPriority;
import com.antiz.task_tracker.domain.entities.TaskStatus;
import com.antiz.task_tracker.repository.TaskListRepository;
import com.antiz.task_tracker.repository.TaskRepository;
import com.antiz.task_tracker.services.TaskService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;


@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final TaskListRepository taskListRepository;

    public TaskServiceImpl(TaskRepository taskRepository, TaskListRepository taskListRepository) {
        this.taskRepository = taskRepository;
        this.taskListRepository = taskListRepository;
    }


    @Override
    public List<Task> listTasks(UUID tasklistId) {
        return taskRepository.findAllByTaskListId(tasklistId);
    }

    @Override
    public Task createTask(UUID tasklistId, Task task) {
        if (null != task.getId()) {
            throw new IllegalArgumentException("Task already exists");
        }
        if (null != task.getTitle() || task.getTitle().isBlank()) {
            throw new IllegalArgumentException("Task title is required");
        }
        TaskPriority taskPriority = Optional.ofNullable(task.getPriority()).orElse(TaskPriority.MEDIUM);
        TaskStatus taskStatus = TaskStatus.OPEN;

        TaskList taskList = taskListRepository.findById(tasklistId).orElseThrow(() -> new IllegalArgumentException("Invalid Task List ID provided"));

        LocalDateTime now = LocalDateTime.now();
        Task taskToSave = new Task(null, task.getTitle(), task.getDescription(), task.getDueDate(), taskStatus, taskPriority, taskList, now, now);

        return taskRepository.save(taskToSave);

    }
}
