package com.antiz.task_tracker.services.impl;

import com.antiz.task_tracker.domain.entities.TaskList;
import com.antiz.task_tracker.repository.TaskListRepository;
import com.antiz.task_tracker.services.TaskListService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskListServiceImpl implements TaskListService {

    private final TaskListRepository taskListRepository;

    public TaskListServiceImpl(TaskListRepository taskListRepository) {
        this.taskListRepository = taskListRepository;
    }

    @Override
    public List<TaskList> listTaskLists() {
        return taskListRepository.findAll();
    }
}
