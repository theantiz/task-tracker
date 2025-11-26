package com.antiz.task_tracker.controllers;

import com.antiz.task_tracker.domain.dto.TaskListDto;
import com.antiz.task_tracker.domain.entities.TaskList;
import com.antiz.task_tracker.mappers.TaskListMapper;
import com.antiz.task_tracker.services.TaskListService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

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

    @PostMapping
    public TaskListDto createTaskList(@RequestBody TaskListDto taskListDto) {
        TaskList createdTaskList = taskListService.createTaskList(taskListMapper.fromDto(taskListDto));
        return taskListMapper.toDto(createdTaskList);
    }

    @GetMapping("/{task_list_id}")
    public TaskListDto getTaskListById(@PathVariable UUID task_list_id) {
        return taskListService.getTaskList(task_list_id)
                .map(taskListMapper::toDto)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task list not found"));
    }


    @PutMapping(path = "/{task_list_id}")
    public TaskListDto updateTaskList(@PathVariable("task_list_id") UUID tasklistId, @RequestBody TaskListDto taskListDto) {
        TaskList updatedtask = taskListService.updateTaskList(tasklistId, taskListMapper.fromDto(taskListDto));
        return taskListMapper.toDto(updatedtask);
    }

    @DeleteMapping(path = "/{task_list_id}")
    public void deleteTaskList(@PathVariable("task_list_id") UUID taskListId) {
        taskListService.deleteTaskList(taskListId);

    }


}
