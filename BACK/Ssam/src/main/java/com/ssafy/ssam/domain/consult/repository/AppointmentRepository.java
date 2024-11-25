package com.ssafy.ssam.domain.consult.repository;

import com.ssafy.ssam.domain.consult.entity.Appointment;
import com.ssafy.ssam.domain.consult.entity.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AppointmentRepository extends JpaRepository<Appointment, Integer>{
    @Query("select case when count(a) > 0 then true else false end " +
            "from Appointment a " +
            "where a.status <> 'CANCEL' " +
            "and ((:startTime between a.startTime and a.endTime) " +
            "or (:endTime between a.startTime and a.endTime) " +
            "or (a.startTime between :startTime and :endTime) " +
            "or (a.endTime between :startTime and :endTime))")
    boolean existsByStatusAndTimeRange(@Param("startTime") LocalDateTime startTime,
                                       @Param("endTime") LocalDateTime endTime);

    Optional<Appointment> findByAppointmentId(Integer id);
    Optional<List<Appointment>> findByTeacher_UserId(Integer teacherId);
    List<Appointment> findByStudent_UserIdAndTeacher_UserIdAndStatus(Integer studentId, Integer teacherId, AppointmentStatus status);
}
