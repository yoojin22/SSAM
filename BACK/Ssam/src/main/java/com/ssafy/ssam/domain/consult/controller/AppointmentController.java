package com.ssafy.ssam.domain.consult.controller;

import com.ssafy.ssam.domain.consult.dto.request.AppointmentRequestDto;
import com.ssafy.ssam.domain.consult.dto.response.AppointmentResponseDto;
import com.ssafy.ssam.domain.consult.service.AppointmentService;
import com.ssafy.ssam.global.dto.CommonResponseDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/v1/consults")
public class AppointmentController {
    private final AppointmentService appointmentService;

    @GetMapping("/{teacherId}")
    public ResponseEntity<List<AppointmentResponseDto>> getAppointments(@PathVariable Integer teacherId) {
        return ResponseEntity.ok(appointmentService.getAppointments(teacherId));
    }

    @PostMapping("/{teacherId}")
    public CommonResponseDto createAppointment (@PathVariable Integer teacherId, @Valid @RequestBody AppointmentRequestDto appointmentRequestDto) {
        appointmentService.createAppointment(teacherId, appointmentRequestDto);
        return new CommonResponseDto("ok");
    }

    @PutMapping("/{appointmentId}")
    public CommonResponseDto updateAppointment(@PathVariable Integer appointmentId) {
        appointmentService.updateAppointment(appointmentId);
        return new CommonResponseDto("ok");
    }

    @PutMapping("/{appointmentId}/approve")
    public ResponseEntity<CommonResponseDto> approveAppointment(@PathVariable Integer appointmentId) {
        return ResponseEntity.ok(appointmentService.approveAppointment(appointmentId));
    }

}
