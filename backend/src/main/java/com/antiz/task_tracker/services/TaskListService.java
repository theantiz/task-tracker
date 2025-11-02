package com.antiz.task_tracker.services;

import com.antiz.task_tracker.domain.entities.TaskList;

import java.util.List;

public interface TaskListService {
    List<TaskList> listTaskLists();

}
