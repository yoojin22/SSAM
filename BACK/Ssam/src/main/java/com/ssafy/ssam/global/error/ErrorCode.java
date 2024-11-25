package com.ssafy.ssam.global.error;

import com.ssafy.ssam.domain.openvidu.dto.RecordingDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

import java.io.FileNotFoundException;

@RequiredArgsConstructor
@AllArgsConstructor
@Getter
public enum ErrorCode {

//    BINDING_ERROR(HttpStatus.BAD_REQUEST),
    IllegalArgument(HttpStatus.NOT_FOUND, "잘못된 인자 값입니다."),

    // userException
    DuplicateUserName(HttpStatus.BAD_REQUEST, "이미 존재하는 사용자 아이디 입니다"),
    Unauthorized(HttpStatus.UNAUTHORIZED, "인증되지 않은 사용자입니다."),
    UserNotFoundException(HttpStatus.NOT_FOUND, "존재하지 않는 사용자입니다."),
    Forbidden(HttpStatus.FORBIDDEN, "접근 권한이 없는 사용자입니다."),
    InvalidImageType(HttpStatus.BAD_REQUEST, "잘못된 이미지 파일입니다."),
    NotFoundRegistration(HttpStatus.NOT_FOUND, "대기 중인 요청이 없습니다"),
    OAuth2AccountAlreadyLinked(HttpStatus.BAD_REQUEST, "이미 연결된 계정입니다"),
    InvalidAuthenticationException(HttpStatus.BAD_REQUEST, "올바르지 않은 계정 접근입니다"),

    // consultException
    AppointmentNotFoundException(HttpStatus.NOT_FOUND, "존재하지 않는 예약입니다"),
    ConsultNotFountException(HttpStatus.NOT_FOUND, "존재하지 않는 상담입니다"),
    UnavailableDate(HttpStatus.BAD_REQUEST, "예약이 불가능한 날짜입니다."),
    BadApproveRequest(HttpStatus.BAD_REQUEST, "승인 대기 중인 상담만 승인 가능합니다"),
    
    
    // boardException
    BoardNotFoundException(HttpStatus.NOT_FOUND, "존재하지 않는 학급입니다."),
    InvalidClassroomData(HttpStatus.BAD_REQUEST, "학급 생성에 필요한 정보가 기입되지 않았습니다"),
    BoardAccessDeniedException(HttpStatus.FORBIDDEN, "학급에 접근 권한이 없습니다."),
    BoardAlreadyExistsException(HttpStatus.BAD_REQUEST, "이미 학급이 존재합니다"),
    AlreadyRegisteredException(HttpStatus.BAD_REQUEST, "이미 요청을 보낸 학급입니다"),
    NotFoundStudentInBoardException(HttpStatus.BAD_REQUEST, "학급에 존재하지 않는 학생입니다"),

    // questionException
    QuestionNotFoundException(HttpStatus.NOT_FOUND, "존재하지 않는 질문입니다."),

    // alarmException
    AlarmNotFoundException(HttpStatus.NOT_FOUND, "존재하지 않는 알람입니다"),

    // S3Exception
    FileNotFoundException(HttpStatus.NOT_FOUND, "아마존에는 해당 파일이 없습니다"),
    AmazonError(HttpStatus.BAD_REQUEST, "아마존 요청에서 에러가 발생했습니다"),

    // GPTException
    GPTError(HttpStatus.BAD_REQUEST, "GPT 요청에서 에러가 발생했습니다"),
    BoardDataNotFound(HttpStatus.BAD_REQUEST, "해당 학급에 입력된 정보가 없습니다"),

    // Openvidu Exception
    FetchError(HttpStatus.BAD_REQUEST,"패치요청에서 에러가 발생했습니다"),
    SessionError(HttpStatus.BAD_REQUEST, "세션요청에서 에러가 발생했습니다"),
    RecordError(HttpStatus.BAD_REQUEST, "기록에 에러가 발생했습니다");

    private final HttpStatus httpStatus;
    private String errorMessage;
}
