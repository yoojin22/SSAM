package com.ssafy.ssam.domain.user.service;

import com.ssafy.ssam.domain.classroom.entity.Board;
import com.ssafy.ssam.domain.classroom.repository.BoardRepository;
import com.ssafy.ssam.domain.consult.dto.response.ConsultSummaryDTO;
import com.ssafy.ssam.domain.consult.entity.Appointment;
import com.ssafy.ssam.domain.consult.entity.AppointmentStatus;
import com.ssafy.ssam.domain.consult.entity.Consult;
import com.ssafy.ssam.domain.consult.repository.AppointmentRepository;
import com.ssafy.ssam.domain.consult.repository.ConsultRepository;
import com.ssafy.ssam.domain.user.dto.request.AlarmCreateRequestDto;
import com.ssafy.ssam.domain.user.dto.response.StudentInfoDetailDTO;
import com.ssafy.ssam.domain.user.dto.response.StudentRegistInfoDTO;

import com.ssafy.ssam.domain.user.entity.AlarmType;
import com.ssafy.ssam.domain.user.entity.UserBoardRelation;
import com.ssafy.ssam.domain.user.entity.UserBoardRelationStatus;
import com.ssafy.ssam.domain.user.repository.UserBoardRelationRepository;
import com.ssafy.ssam.global.auth.dto.CustomUserDetails;
import com.ssafy.ssam.global.auth.entity.User;
import com.ssafy.ssam.global.auth.repository.UserRepository;
import com.ssafy.ssam.global.dto.CommonResponseDto;
import com.ssafy.ssam.global.error.CustomException;
import com.ssafy.ssam.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.aspectj.apache.bcel.classfile.ConstantInteger;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Transactional
@RequiredArgsConstructor
@Service
public class UserBoardRelationService {

    private final UserRepository userRepository;
    private final UserBoardRelationRepository userBoardRelationRepository;
    private final ConsultRepository consultRepository;
    private final AppointmentRepository appointmentRepository;
    private final BoardRepository boardRepository;
    private final AlarmService alarmService;

    // 학급에 보낸 등록 요청을 반환하는 함수
    public List<StudentRegistInfoDTO> getRegistRequestList() {
        CustomUserDetails userDetails = findCustomUserDetails();
        Integer boardId = userDetails.getBoardId();
        Integer userId = userDetails.getUserId();

        List<UserBoardRelation> relations = userBoardRelationRepository.findByBoardBoardIdAndStatus(boardId, UserBoardRelationStatus.WAITING);

        return relations != null ? relations.stream()
                .map(relation -> StudentRegistInfoDTO.builder()
                        .studentId(relation.getUser().getUserId())
                        .name(relation.getUser().getName())
                        .username(relation.getUser().getUsername())
                        .followDate(relation.getFollowDate().toLocalDate())
                        .build())
                .collect(Collectors.toList()) : null;
    }

    // 등록 요청을 수락하는 함수
    public CommonResponseDto approveRegist(Integer studentId) {
        CustomUserDetails userDetails = findCustomUserDetails();
        Integer boardId = userDetails.getBoardId();

        UserBoardRelation relation = userBoardRelationRepository.findByUserUserIdAndBoardBoardIdAndStatus(studentId, boardId, UserBoardRelationStatus.WAITING)
                .orElseThrow(() -> new CustomException(ErrorCode.NotFoundRegistration));

        AlarmCreateRequestDto studentAlarmCreateRequestDto
                = AlarmCreateRequestDto.builder()
                .userId(relation.getUser().getUserId())
                .alarmType(AlarmType.ACCEPT)
                .build();

        alarmService.creatAlarm(studentAlarmCreateRequestDto);

        relation.setStatus(UserBoardRelationStatus.ACCEPTED);
        userBoardRelationRepository.save(relation);
        return new CommonResponseDto("Approved");
    }

    // 등록 요청을 거절하는 함수
    public CommonResponseDto rejectRegist(Integer studentId) {
        CustomUserDetails userDetails = findCustomUserDetails();
        Integer boardId = userDetails.getBoardId();

        UserBoardRelation relation = userBoardRelationRepository.findByUserUserIdAndBoardBoardIdAndStatus(studentId, boardId, UserBoardRelationStatus.WAITING)
                .orElseThrow(() -> new CustomException(ErrorCode.NotFoundRegistration));

        relation.setStatus(UserBoardRelationStatus.BLOCKED);
        userBoardRelationRepository.save(relation);
        return new CommonResponseDto("Rejected");
    }

    // 학생 상세 정보를 제공하는 로직
    public StudentInfoDetailDTO getStudentDetail(Integer studentId) {
        User student = userRepository.findByUserId(studentId)
                .orElseThrow(() -> new CustomException(ErrorCode.UserNotFoundException));
        CustomUserDetails userDetails = findCustomUserDetails();
        Integer teacherId = userDetails.getUserId();

        List<Appointment> appointments = appointmentRepository.findByStudent_UserIdAndTeacher_UserIdAndStatus(studentId, teacherId, AppointmentStatus.DONE);
        List<Consult> consults =  consultRepository.findByAppointmentIn(appointments);

        return StudentInfoDetailDTO.builder()
                .studentId(student.getUserId())
                .name(student.getName())
                .birth(student.getBirth())
                .studentImage(student.getImgUrl())
                .consultList(consultSummaryListToDTO(consults))
                .build();
    }

    // 학급에서 학생을 삭제하는 로직
    public CommonResponseDto deleteStudentFromBoard(Integer studentId) {
        CustomUserDetails userDetails = findCustomUserDetails();
        Board board = boardRepository.findByBoardId(userDetails.getBoardId())
                .orElseThrow(() -> new CustomException(ErrorCode.BoardNotFoundException));

        UserBoardRelation relation = userBoardRelationRepository.findByUserUserIdAndBoardBoardIdAndStatus(studentId, board.getBoardId(), UserBoardRelationStatus.ACCEPTED)
                .orElseThrow(() -> new CustomException(ErrorCode.NotFoundStudentInBoardException));

        userBoardRelationRepository.delete(relation);

        return new CommonResponseDto("Delete Completed");
    }

    // CustomUserDetail을 반환하는 함수
    public CustomUserDetails findCustomUserDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (CustomUserDetails) authentication.getPrincipal();
    }

    // consult를 consultSummaryDTO로 변환하는 로직
    private List<ConsultSummaryDTO> consultSummaryListToDTO (List<Consult> consults) {
        return consults.stream()
                .map(consult -> ConsultSummaryDTO.builder()
                                .consultId(consult.getConsultId())
                                .date(consult.getActualDate().toLocalDate())
                                .runningTime(consult.getRunningTime())
                                .consultType(consult.getAppointment().getTopic().toString())
                                .build()
                )
                .collect(Collectors.toList());
    }

}
