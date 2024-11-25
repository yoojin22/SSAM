package com.ssafy.ssam.domain.classroom.entity;

import com.ssafy.ssam.domain.classroom.dto.request.QuestionRequestDto;
import com.ssafy.ssam.domain.classroom.dto.response.QuestionResponseDto;
import com.ssafy.ssam.global.auth.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@AllArgsConstructor(access = AccessLevel.PROTECTED)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Getter
@Setter
@Builder
@DynamicInsert
@Table(name = "question")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "question_id")
    private Integer questionId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "board_id", nullable = false)
    private Board board;

    @Column(length = 50, nullable = false)
    private String content;

    @Column
    private String answer;

    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "content_date", columnDefinition = "TIMESTAMP", nullable = false)
    private LocalDateTime contentDate;

    @UpdateTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "answer_date", columnDefinition = "TIMESTAMP")
    private LocalDateTime answerDate;


    public static Question toQuestion(User student, Board board, QuestionRequestDto questionRequestDto) {
        return Question.builder()
                .student(student)
                .board(board)
                .content(questionRequestDto.getContent())
                .build();
    }
    public static QuestionResponseDto toQuestionResponseDto(Question question) {
        return QuestionResponseDto.builder()
                .questionId(question.getQuestionId())
                .boardId(question.getBoard().getBoardId())
                .studentId(question.getStudent().getUserId())
                .studentName(question.getStudent().getName())
                .content(question.getContent())
                .answer(question.getAnswer())
                .contentDate(question.getContentDate())
                .answerDate(question.getAnswerDate())
                .build();
    }
    public static QuestionResponseDto toAnswerResponseDto(Question question) {
        return QuestionResponseDto.builder()
                .questionId(question.getQuestionId())
                .boardId(question.getBoard().getBoardId())
                .studentId(question.getStudent().getUserId())
                .studentName(question.getStudent().getName())
                .content(question.getContent())
                .answer(question.getAnswer())
                .contentDate(question.getContentDate())
                .answerDate(question.getAnswerDate())
                .build();
    }
}
