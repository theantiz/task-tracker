package com.antiz.task_tracker.mappers;

import com.antiz.task_tracker.domain.dto.TaskListDto;
import com.antiz.task_tracker.domain.entities.TaskList;

public interface TaskListMapper {

    TaskList fromDto(TaskListDto taskListDto);

    TaskListDto toDto(TaskList taskList);
}
