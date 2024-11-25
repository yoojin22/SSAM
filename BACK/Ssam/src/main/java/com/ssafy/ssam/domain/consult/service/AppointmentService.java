package com.ssafy.ssam.domain.consult.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.ssam.domain.consult.dto.request.AppointmentRequestDto;
import com.ssafy.ssam.domain.consult.dto.response.AppointmentResponseDto;
import com.ssafy.ssam.domain.consult.entity.Appointment;
import com.ssafy.ssam.domain.consult.entity.AppointmentStatus;
import com.ssafy.ssam.domain.consult.entity.Consult;
import com.ssafy.ssam.domain.consult.repository.AppointmentRepository;
import com.ssafy.ssam.domain.consult.repository.ConsultRepository;
import com.ssafy.ssam.domain.consult.repository.SummaryRepository;
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

@Slf4j
@Builder
@Service
@Transactional
@RequiredArgsConstructor
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final ConsultRepository consultRepository;
    private final UserRepository userRepository;
    private final SummaryRepository summaryRepository;
    private final ConsultService consultService;

    @Transactional(readOnly = true)
    public List<AppointmentResponseDto> getAppointments(Integer teacherId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        User user = userRepository.findByUserId(userDetails.getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.UserNotFoundException));
        User teacher = userRepository.findByUserIdAndRole(teacherId, UserRole.TEACHER)
                .orElseThrow(() -> new CustomException(ErrorCode.UserNotFoundException));

        List<Appointment> appointments = appointmentRepository.findByTeacher_UserId(teacherId)
                .orElse(new ArrayList<>());

        List<AppointmentResponseDto> appointmentResponseDtos = new ArrayList<>();
        Consult consult = null;
        for (Appointment appointment : appointments) {
            AppointmentResponseDto responseDto = Appointment.toAppointmentDto(appointment);
            consult = consultRepository.findByAppointment(appointment).orElse(null);
            if (consult != null) {
                responseDto.setAccessCode(consult.getAccessCode());
                responseDto.setConsultId(consult.getConsultId());
            }
            appointmentResponseDtos.add(responseDto);
        }

        return appointmentResponseDtos;
    }

    public AppointmentResponseDto createAppointment(Integer teacherId, AppointmentRequestDto appointmentRequestDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        User user = userRepository.findByUserId(userDetails.getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.UserNotFoundException));
        User teacher = userRepository.findByUserIdAndRole(teacherId, UserRole.TEACHER)
                .orElseThrow(() -> new CustomException(ErrorCode.UserNotFoundException));

        // 상담예약시간이 이전에 지난 시간일 때 에러
        if (appointmentRequestDto.getStartTime().isBefore(LocalDateTime.now()))
            throw new CustomException(ErrorCode.UnavailableDate);

        // 상담예약시간에 이미 예약이 존재하면 에러
        if (appointmentRepository.existsByStatusAndTimeRange(appointmentRequestDto.getStartTime(), appointmentRequestDto.getEndTime()))
            throw new CustomException(ErrorCode.UnavailableDate);

        Appointment appointment = Appointment.toAppointment(teacher, user, appointmentRequestDto);

        // 예약자가 선생님이다 -> 예약 거부 상태 / 아니다 예약 신청
        if (teacher.getUserId().equals(user.getUserId()) && userDetails.getRole().equals(UserRole.TEACHER.toString()))
            appointment.setStatus(AppointmentStatus.REJECT);

        return Appointment.toAppointmentDto(appointmentRepository.save(appointment));
    }

    public AppointmentResponseDto updateAppointment(Integer appointmentId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        User user = userRepository.findByUserId(userDetails.getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.UserNotFoundException));
        Appointment appointment = appointmentRepository.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new CustomException(ErrorCode.AppointmentNotFoundException));


        if (appointment.getStatus().equals(AppointmentStatus.APPLY) || appointment.getStatus().equals(AppointmentStatus.ACCEPTED)){
            // 학생은 자신이 한 예약들 취소 가능
            if (userDetails.getRole().equals(UserRole.STUDENT.toString())) {
                if (!appointment.getStudent().equals(user)) throw new CustomException(ErrorCode.Unauthorized);
                appointment.setStatus(AppointmentStatus.CANCEL);
            }
            // 선생님일때는 자신 이름 앞으로 된 예약들 취소 가능함
            else if (userDetails.getRole().equals(UserRole.TEACHER.toString())) {
                if (!appointment.getTeacher().equals(user)) throw new CustomException(ErrorCode.Unauthorized);
                appointment.setStatus(AppointmentStatus.CANCEL);

            }
        }else if (appointment.getStatus().equals(AppointmentStatus.REJECT)){
            if (userDetails.getRole().equals(UserRole.TEACHER.toString())) {
                if (!appointment.getTeacher().equals(user)) throw new CustomException(ErrorCode.Unauthorized);
                appointmentRepository.delete(appointment);
            }
        }

        return Appointment.toAppointmentDto(appointment);
    }

    @Transactional
    public CommonResponseDto approveAppointment(Integer appointmentId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        User user = userRepository.findByUserIdAndRole(userDetails.getUserId(), UserRole.TEACHER)
                .orElseThrow(() -> new CustomException(ErrorCode.UserNotFoundException));
        Appointment appointment = appointmentRepository.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new CustomException(ErrorCode.AppointmentNotFoundException));

        if (!userDetails.getUserId().equals(appointment.getTeacher().getUserId()))
            throw new CustomException(ErrorCode.Unauthorized);

        if (!appointment.getStatus().equals(AppointmentStatus.APPLY))
            throw new CustomException(ErrorCode.BadApproveRequest);

        appointment.setStatus(AppointmentStatus.ACCEPTED);
        System.out.println(appointment.getAppointmentId());
        consultService.createConsultEntity(appointment);
        return new CommonResponseDto("Approved");
    }
}