package com.antiz.task_tracker.repository;

import com.antiz.task_tracker.domain.entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {
    List<Task> findAllByTaskListId(UUID taskListId);
    Optional<Task> findByIdAndTaskListId(UUID id, UUID taskListId);
    void deleteByIdAndTaskListId(UUID id, UUID taskListId);

}
