package com.antiz.task_tracker.mappers;

import com.antiz.task_tracker.domain.dto.TaskDto;
import com.antiz.task_tracker.domain.entities.Task;

public interface TaskMapper {

    Task fromDto(TaskDto taskDto);

    TaskDto toDto(Task task);

}
