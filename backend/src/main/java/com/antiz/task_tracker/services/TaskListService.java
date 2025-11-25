package com.antiz.task_tracker.services;

import com.antiz.task_tracker.domain.entities.TaskList;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TaskListService {
    List<TaskList> listTaskLists();

    Optional<TaskList> getTaskList(UUID id);

    TaskList createTaskList(TaskList taskList);

    TaskList updateTaskList(UUID id, TaskList taskList);

    void deleteTaskList(UUID id);

}
