package xyz.antiz.task_tracker.domain.dto;
import xyz.antiz.task_tracker.domain.entities.TaskPriority;
import xyz.antiz.task_tracker.domain.entities.TaskStatus;
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
