package com.antiz.task_tracker.services.impl;

import com.antiz.task_tracker.domain.entities.Task;
import com.antiz.task_tracker.domain.entities.TaskList;
import com.antiz.task_tracker.domain.entities.TaskPriority;
import com.antiz.task_tracker.domain.entities.TaskStatus;
import com.antiz.task_tracker.repository.TaskListRepository;
import com.antiz.task_tracker.repository.TaskRepository;
import com.antiz.task_tracker.services.TaskService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
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

    @Transactional
    @Override
    public Task createTask(UUID tasklistId, Task task) {
        if (null != task.getId()) {
            throw new IllegalArgumentException("Task already exists");
        }
        if (null == task.getTitle() || task.getTitle().isBlank()) {
            throw new IllegalArgumentException("Task title is required");
        }
        TaskPriority taskPriority = Optional.ofNullable(task.getPriority()).orElse(TaskPriority.MEDIUM);
        TaskStatus taskStatus = TaskStatus.OPEN;

        TaskList taskList = taskListRepository.findById(tasklistId).orElseThrow(() -> new IllegalArgumentException("Invalid Task List ID provided"));

        LocalDateTime now = LocalDateTime.now();
        Task taskToSave = new Task(null, task.getTitle(), task.getDescription(), task.getDueDate(), taskStatus, taskPriority, taskList, now, now);

        return taskRepository.save(taskToSave);

    }

    @Override
    public Optional<Task> getTask(UUID taskListId, UUID taskId) {
        return taskRepository.findByIdAndTaskListId(taskId, taskListId);
    }



    @Transactional
    @Override
    public Task updateTask(UUID taskListId, UUID taskId, Task task) {

        if (task.getId() == null) {
            throw new IllegalArgumentException("Task id is required");
        }

        if (!Objects.equals(task.getId(), taskId)) {
            throw new IllegalArgumentException("Task id doesn't match");
        }

        if (task.getPriority() == null) {
            throw new IllegalArgumentException("Task priority is required");
        }
        if (task.getStatus() == null) {
            throw new IllegalArgumentException("Task status is required");
        }

        Task existingTask = taskRepository
                .findByIdAndTaskListId(taskId, taskListId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Invalid Task ID provided"));

        existingTask.setTitle(task.getTitle());
        existingTask.setDescription(task.getDescription());
        existingTask.setDueDate(task.getDueDate());
        existingTask.setPriority(task.getPriority());
        existingTask.setStatus(task.getStatus());
        existingTask.setUpdated(LocalDateTime.now());

        return taskRepository.save(existingTask);
    }


    @Transactional
    @Override
    public void deleteTask(UUID taskListId, UUID taskId) {
        taskRepository.deleteByIdAndTaskListId(taskId,  taskListId);

    }
}
