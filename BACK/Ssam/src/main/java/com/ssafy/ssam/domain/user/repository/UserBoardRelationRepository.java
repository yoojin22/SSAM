package com.ssafy.ssam.domain.user.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ssafy.ssam.domain.classroom.entity.Board;
import com.ssafy.ssam.domain.user.entity.UserBoardRelation;
import com.ssafy.ssam.domain.user.entity.UserBoardRelationStatus;
import com.ssafy.ssam.global.auth.entity.User;

@Repository
public interface UserBoardRelationRepository extends JpaRepository<UserBoardRelation, Integer> {
    Optional<UserBoardRelation> findByUserAndBoard(User user, Board board);
    Optional<UserBoardRelation> findByBoardAndStatus(Board board, UserBoardRelationStatus status);
    List<UserBoardRelation> findByBoardBoardIdAndStatus(Integer boardId, UserBoardRelationStatus status);
    List<UserBoardRelation> findByUserAndStatus(User user, UserBoardRelationStatus status);
    Optional<List<UserBoardRelation>> findUserBoardRelationsByUser(User user);
    Optional<UserBoardRelation> findByUserUserIdAndBoardBoardIdAndStatus(Integer userId, Integer boardId, UserBoardRelationStatus status);

    @Query("SELECT u.user FROM UserBoardRelation u WHERE u.board = :board AND u.status = :status")
    Optional<List<User>> findUsersByBoardAndStatus(@Param("board") Board board, @Param("status") UserBoardRelationStatus status);

    @Query("SELECT u FROM UserBoardRelation u WHERE u.board.boardId = :boardId AND u.status = 'OWNER'")
    Optional<UserBoardRelation> findByBoardIdAndStatus(@Param("boardId") Integer boardId);
    
    @Query("SELECT ubr2 FROM UserBoardRelation ubr1 " +
            "JOIN UserBoardRelation ubr2 ON ubr1.board.boardId = ubr2.board.boardId " +
            "WHERE ubr1.user.userId = :studentId AND ubr1.status = 'accept' " +
            "AND ubr2.status = 'owner'")
    Optional<UserBoardRelation> findTeacherByStudentId(@Param("studentId") Integer studentId);
    
    Optional<UserBoardRelation> findByUserAndBoardAndStatusIn(User user, Board board, List<UserBoardRelationStatus> statuses);
}
