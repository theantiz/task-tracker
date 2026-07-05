package xyz.antiz.task_tracker.mappers;

import xyz.antiz.task_tracker.domain.dto.TaskListDto;
import xyz.antiz.task_tracker.domain.entities.TaskList;

public interface TaskListMapper {

    TaskList fromDto(TaskListDto taskListDto);

    TaskListDto toDto(TaskList taskList);
}
