package xyz.antiz.task_tracker.mappers;

import xyz.antiz.task_tracker.domain.dto.TaskDto;
import xyz.antiz.task_tracker.domain.entities.Task;

public interface TaskMapper {

    Task fromDto(TaskDto taskDto);

    TaskDto toDto(Task task);

}
