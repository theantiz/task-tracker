package com.antiz.task_tracker.domain.dto;
import com.antiz.task_tracker.domain.entities.TaskPriority;
import com.antiz.task_tracker.domain.entities.TaskStatus;
import java.util.UUID;
import java.time.LocalDateTime;

//to represent tasks in APIs
public record TaskDto(
        UUID id,
        String title,
        String description,
        LocalDateTime dueDate,
        TaskPriority priority,
        TaskStatus status
) {}
