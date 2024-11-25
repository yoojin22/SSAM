package com.ssafy.ssam.domain.classroom.service;

import com.ssafy.ssam.domain.classroom.entity.Board;
import com.ssafy.ssam.domain.classroom.repository.BoardRepository;
import com.ssafy.ssam.domain.classroom.dto.request.AnswerRequestDto;
import com.ssafy.ssam.domain.classroom.dto.request.QuestionRequestDto;
import com.ssafy.ssam.domain.classroom.dto.response.QuestionResponseDto;
import com.ssafy.ssam.domain.classroom.entity.Question;
import com.ssafy.ssam.domain.classroom.repository.QuestionRepository;
import com.ssafy.ssam.domain.user.dto.request.AlarmCreateRequestDto;
import com.ssafy.ssam.domain.user.entity.AlarmType;
import com.ssafy.ssam.domain.user.entity.UserBoardRelation;
import com.ssafy.ssam.domain.user.entity.UserBoardRelationStatus;
import com.ssafy.ssam.domain.user.repository.UserBoardRelationRepository;
import com.ssafy.ssam.domain.user.service.AlarmService;
import com.ssafy.ssam.global.auth.dto.CustomUserDetails;
import com.ssafy.ssam.global.auth.entity.User;
import com.ssafy.ssam.global.auth.entity.UserRole;
import com.ssafy.ssam.global.auth.repository.UserRepository;
import com.ssafy.ssam.global.dto.CommonResponseDto;
import com.ssafy.ssam.global.error.CustomException;
import com.ssafy.ssam.global.error.ErrorCode;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Builder
@Transactional
@Service
public class QuestionService {
    private final QuestionRepository questionRepository;
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;
    private final UserBoardRelationRepository userBoardRelationRepository;
    private final AlarmService alarmService;

    @Transactional(readOnly = true)
    public List<QuestionResponseDto> getQuestions(Integer boardId){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails details = (CustomUserDetails) authentication.getPrincipal();

        User user = userRepository.findByUserId(details.getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.UserNotFoundException));

        Board board = null;
        List<UserBoardRelation> relations;

        if(user.getRole() == UserRole.TEACHER){
            relations = userBoardRelationRepository.findByUserAndStatus(user, UserBoardRelationStatus.OWNER);
        }
        else {
            relations = userBoardRelationRepository.findByUserAndStatus(user, UserBoardRelationStatus.ACCEPTED);
        }

        for (UserBoardRelation relation : relations) {
            if(relation.getBoard().getIsDeprecated() == 0) {
                board  = relation.getBoard();
            }
        }
        if (board == null) {
            throw new CustomException(ErrorCode.BoardNotFoundException);
        }

        // 사용자가 학급에 접근할 수 있는 권한이 있는지 검증
        if(!board.getBoardId().equals(boardId)) throw new CustomException(ErrorCode.IllegalArgument);

        List<QuestionResponseDto> list = new ArrayList<>();
        List<Question> questions = questionRepository.findByBoard_BoardId(boardId).orElse(new ArrayList<>());
        for(Question question : questions){
            list.add(Question.toQuestionResponseDto(question));
        }

        return list;
    }
    public QuestionResponseDto createQuestion(Integer boardId, QuestionRequestDto questionRequestDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails details = (CustomUserDetails) authentication.getPrincipal();

        // 사용자가 학급에 접근할 수 있는 권한이 있는지 검증
        if(!details.getBoardId().equals(boardId)) throw new CustomException(ErrorCode.IllegalArgument);

        // 사용자 존재여부 검증
        User student = userRepository.findByUsername(authentication.getName())
            .orElseThrow(() -> new CustomException(ErrorCode.UserNotFoundException));
        // 반 존재여부 검증, 반 이름이랑 요청이랑 맞는지 한 번 더 검증
        Board board = boardRepository.findByBoardId(boardId)
                .orElseThrow(() -> new CustomException(ErrorCode.BoardNotFoundException));

        Question question = Question.toQuestion(student, board, questionRequestDto);

        User teacher = userBoardRelationRepository.findUsersByBoardAndStatus(board, UserBoardRelationStatus.OWNER)
                .orElseThrow(()-> new CustomException(ErrorCode.UserNotFoundException)).get(0);

        // 알람 생성
        AlarmCreateRequestDto teacherAlarmCreateRequestDto
                = AlarmCreateRequestDto.builder()
                .userId(teacher.getUserId())
                .alarmType(AlarmType.QUESTION)
                .build();
        alarmService.creatAlarm(teacherAlarmCreateRequestDto);

        return Question.toQuestionResponseDto(questionRepository.save(question));
    }

    public CommonResponseDto deleteQuestion(Integer questionId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails details = (CustomUserDetails) authentication.getPrincipal();

        // 사용자 존재여부 검증
        User user = userRepository.findByUsername(details.getUsername())
                .orElseThrow(() -> new CustomException(ErrorCode.UserNotFoundException));
        // 질문의 존재여부 검증
        Question question = questionRepository.findByQuestionId(questionId)
                .orElseThrow(() -> new CustomException(ErrorCode.QuestionNotFoundException));
        // 질문을 지울 권한이 있는 사용자인지 확인
        // 1) 같은 반 선생님 2) 작성자 본인

        log.info("Question Delete");
        log.info("{}", question.getBoard().getBoardId());
        if(details.getRole().equals(UserRole.TEACHER.toString()) && !question.getBoard().getBoardId().equals(details.getBoardId()))
            throw new CustomException(ErrorCode.IllegalArgument);
        else if(details.getRole().equals(UserRole.STUDENT.toString()) && !details.getUserId().equals(question.getStudent().getUserId()))
            throw new CustomException(ErrorCode.IllegalArgument);

        questionRepository.delete(question);

        return new CommonResponseDto("ok");
    }

    @Transactional
    public QuestionResponseDto putAnswer(Integer questionId, AnswerRequestDto answerRequestDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails details = (CustomUserDetails) authentication.getPrincipal();

        // 질문의 존재여부 검증
        Question question = questionRepository.findByQuestionId(questionId)
                .orElseThrow(() -> new CustomException(ErrorCode.QuestionNotFoundException));
        // 질문의 학급 == 요청된 학급 == 사용자가 포함된 학급 확인
        if(!question.getBoard().getBoardId().equals(details.getBoardId()))
            throw new CustomException(ErrorCode.IllegalArgument);
        if(!question.getBoard().getBoardId().equals(answerRequestDto.getBoardId()))
            throw new CustomException(ErrorCode.IllegalArgument);
        question.setAnswer(answerRequestDto.getAnswer());

        // 알람 생성
        AlarmCreateRequestDto teacherAlarmCreateRequestDto
                = AlarmCreateRequestDto.builder()
                .userId(question.getStudent().getUserId())
                .alarmType(AlarmType.ANSWER)
                .build();

        alarmService.creatAlarm(teacherAlarmCreateRequestDto);
        return Question.toAnswerResponseDto(question);
    }



}
