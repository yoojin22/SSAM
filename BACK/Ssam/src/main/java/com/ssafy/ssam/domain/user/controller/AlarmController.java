package com.ssafy.ssam.domain.user.controller;

import com.ssafy.ssam.domain.user.dto.request.AlarmCreateRequestDto;
import com.ssafy.ssam.domain.user.dto.response.AlarmResponseDto;
import com.ssafy.ssam.domain.user.entity.Alarm;
import com.ssafy.ssam.domain.user.service.AlarmService;
import com.ssafy.ssam.global.dto.CommonResponseDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RequestMapping("/v1/alarms")
@RestController
public class AlarmController {
    private final AlarmService alarmService;

    @GetMapping
    public ResponseEntity<List<AlarmResponseDto>> getAlarms() {
        return ResponseEntity.ok(alarmService.getAlarms());
    }

    @PutMapping("{alarmId}")
    public CommonResponseDto ReadAlarm(@PathVariable Integer alarmId) {
        alarmService.readAlarm(alarmId);
        return new CommonResponseDto("alarm read success");
    }

    @DeleteMapping("{alarmId}")
    public CommonResponseDto DeleteAlarm(@PathVariable Integer alarmId) {
        alarmService.deleteAlarm(alarmId);
        return new CommonResponseDto("alarm delete success");
    }
}
