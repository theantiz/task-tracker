package com.antiz.task_tracker.services.impl;

import com.antiz.task_tracker.domain.entities.TaskList;
import com.antiz.task_tracker.repository.TaskListRepository;
import com.antiz.task_tracker.services.TaskListService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

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

    @Override
    public Optional<TaskList> getTaskList(UUID id) {
        return taskListRepository.findById(id);
    }

    @Override
    public TaskList createTaskList(TaskList taskList) {
        if (taskList.getId() != null) {
            throw new IllegalArgumentException("Task list already exists");
        }

        if (taskList.getTitle() == null || taskList.getTitle().isBlank()) {
            throw new IllegalArgumentException("Task list title is required");
        }

        LocalDateTime now = LocalDateTime.now();

        TaskList saved = taskListRepository.save(new TaskList(null, taskList.getTitle(), taskList.getDescription(), null, now, now));

        return saved;
    }


    //from GPT
    @Transactional
    @Override
    public TaskList updateTaskList(UUID id, TaskList taskList)  {

        // Title must be provided
        if (taskList.getTitle() == null || taskList.getTitle().isBlank()) {
            throw new IllegalArgumentException("Task list title is required");
        }

        // Fetch existing list
        TaskList existing = taskListRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Task list not found"));

        // Update fields
        existing.setTitle(taskList.getTitle());
        existing.setDescription(taskList.getDescription());
        existing.setUpdated(LocalDateTime.now());

        // Save updated entity
        return taskListRepository.save(existing);
    }

    @Override
    public void deleteTaskList(UUID id) {
        taskListRepository.deleteById(id);

    }
}
