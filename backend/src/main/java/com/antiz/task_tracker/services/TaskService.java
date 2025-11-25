package com.antiz.task_tracker.services;

import com.antiz.task_tracker.domain.dto.TaskDto;
import com.antiz.task_tracker.domain.entities.Task;

import java.util.List;
import java.util.UUID;

public interface TaskService {
    List<Task> listTasks(UUID tasklistId);
    Task createTask(UUID tasklistId, Task task);
}
