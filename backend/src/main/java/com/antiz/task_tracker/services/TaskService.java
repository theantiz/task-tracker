package com.antiz.task_tracker.services;

import com.antiz.task_tracker.domain.dto.TaskDto;
import com.antiz.task_tracker.domain.entities.Task;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TaskService {
    List<Task> listTasks(UUID tasklistId);
    Task createTask(UUID tasklistId, Task task);
    Optional<Task> getTask(UUID taskListId, UUID taskId);
    Task updateTask(UUID taskListId, UUID taskId, Task task);
    void deleteTask(UUID taskListId, UUID taskId);
}
