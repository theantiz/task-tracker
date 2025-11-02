package com.antiz.task_tracker.controllers;

import com.antiz.task_tracker.domain.dto.TaskListDto;
import com.antiz.task_tracker.mappers.TaskListMapper;
import com.antiz.task_tracker.services.TaskListService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "api/task-lists")
public class TaskListController {

    private final TaskListService taskListService;
    private final TaskListMapper taskListMapper;

    public TaskListController(TaskListService taskListService, TaskListMapper taskListMapper) {
        this.taskListService = taskListService;
        this.taskListMapper = taskListMapper;
    }

    @GetMapping
    public List<TaskListDto> listTaskLists() {

        return taskListService.listTaskLists().stream().map(taskListMapper::toDto).toList();
    }
}
