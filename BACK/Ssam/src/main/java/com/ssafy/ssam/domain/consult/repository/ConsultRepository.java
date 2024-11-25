package com.ssafy.ssam.domain.consult.repository;

import com.ssafy.ssam.domain.consult.dto.response.ConsultSummaryDetailResponseDto;
import com.ssafy.ssam.domain.consult.entity.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.ssam.domain.consult.entity.Appointment;
import com.ssafy.ssam.domain.consult.entity.Consult;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ConsultRepository extends JpaRepository<Consult, Integer> {
    // Id 기반으로 존재하는지 여부 검증 jpa

    Optional<Consult> findByAccessCode(String accessCode);

    Optional<Consult> findByConsultId(Integer consultId);

    // Pin이 이미 존재하는지 검증
    Boolean existsByAccessCode(String accessCode);

    // 약속을 컨설트로 변환하는 jpa
    List<Consult> findByAppointmentIn(List<Appointment> appointments);

    Optional<Consult> findByAppointment(Appointment appointment);


    @Query("SELECT new com.ssafy.ssam.domain.consult.dto.response.ConsultSummaryDetailResponseDto(c.consultId, c.actualDate, c.runningTime, " +
            "c.attSchool, c.attGrade, c.attClassroom, c.videoUrl, " +
            "s.keyPoint, s.profanityCount, s.profanityLevel, s.parentConcern, s.teacherRecommendation, " +
            "a.student.userId, a.topic) " +
            "FROM Consult c " +
            "JOIN Appointment a ON a.appointmentId = c.appointment.appointmentId " +
            "JOIN Summary s ON s.consult.consultId = c.consultId " +
            "WHERE c.consultId = :consultId")
    Optional<ConsultSummaryDetailResponseDto> findConsultSummaryByConsultId(@Param("consultId") Integer consultId);

    // 학생기준 가장 빠른 상담 찾아오기
    @Query("SELECT c FROM Consult c " +
            "JOIN c.appointment a " +
            "WHERE a.student.userId = :userId " +
            "AND a.startTime > :currentDateTime " +
            "AND a.status = :status " +
            "ORDER BY a.startTime ASC")
    Optional<List<Consult>> findUpcomingConsultForStudent(
            @Param("userId") Integer userId,
            @Param("currentDateTime") LocalDateTime currentDateTime,
            @Param("status") AppointmentStatus status);

    // 선생기준 가장 빠른 상담 찾아오기
    @Query("SELECT c FROM Consult c " +
            "JOIN c.appointment a " +
            "WHERE a.teacher.userId = :userId " +
            "AND a.startTime > :currentDateTime " +
            "AND a.status = :status " +
            "ORDER BY a.startTime ASC")
    Optional<List<Consult>> findUpcomingConsultForTeacher(
            @Param("userId") Integer userId,
            @Param("currentDateTime") LocalDateTime currentDateTime,
            @Param("status") AppointmentStatus status);
}