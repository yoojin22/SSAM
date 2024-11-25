package com.ssafy.ssam.domain.classroom.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.ssafy.ssam.domain.classroom.entity.Board;

@Repository
public interface BoardRepository extends JpaRepository<Board, Integer> {
    boolean existsByPin(String pin);
    Optional<Board> findByBoardId(Integer boardId);
    Optional<Board> findByPin(String pin);
    
}
