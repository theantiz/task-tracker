package com.antiz.task_tracker.controllers;

import com.antiz.task_tracker.domain.dto.TaskDto;
import com.antiz.task_tracker.domain.entities.Task;
import com.antiz.task_tracker.mappers.TaskMapper;
import com.antiz.task_tracker.services.TaskService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping(path = "api/task-lists/{task_list_id}/tasks")
public class TaskController {

    private final TaskService taskService;
    private final TaskMapper taskMapper;

    public TaskController(TaskService taskService, TaskMapper taskMapper) {
        this.taskService = taskService;
        this.taskMapper = taskMapper;
    }

    //gpt
    @GetMapping
    public List<TaskDto> listTasks(@PathVariable("task_list_id") UUID taskListId) {
        return taskService.listTasks(taskListId).stream().map(taskMapper::toDto).toList();
    }

    @PostMapping
    public TaskDto createTask(@PathVariable("task_list_id") UUID taskListId, @RequestBody TaskDto taskDto) {
        Task createdTask = taskService.createTask(taskListId, taskMapper.fromDto(taskDto));
        return taskMapper.toDto(createdTask);
    }

    @GetMapping("/{task_id}")
    public TaskDto getTask(@PathVariable UUID task_id, @PathVariable UUID task_list_id) {
        return taskService.getTask(task_list_id, task_id)
                .map(taskMapper::toDto)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));
    }


    @PutMapping (path = "/{task_id}")
    public TaskDto updateTask(@PathVariable("task_id") UUID taskId,@PathVariable("task_list_id") UUID taskListId, @RequestBody TaskDto taskDto) {
       Task updatedTask =  taskService.updateTask(taskListId, taskId, taskMapper.fromDto(taskDto));
        return taskMapper.toDto(updatedTask);
    }
    @DeleteMapping("/{task_id}")
    public void deleteTask(
            @PathVariable("task_list_id") UUID taskListId,
            @PathVariable("task_id") UUID taskId) {

        taskService.deleteTask(taskListId, taskId);
    }



}
