package com.ssafy.ssam.domain.user.service;

import com.ssafy.ssam.domain.user.dto.request.AlarmCreateRequestDto;
import com.ssafy.ssam.domain.user.dto.response.AlarmResponseDto;
import com.ssafy.ssam.domain.user.entity.Alarm;
import com.ssafy.ssam.domain.user.repository.AlarmRepository;
import com.ssafy.ssam.global.auth.dto.CustomUserDetails;
import com.ssafy.ssam.global.auth.entity.User;
import com.ssafy.ssam.global.auth.repository.UserRepository;
import com.ssafy.ssam.global.error.CustomException;
import com.ssafy.ssam.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
@Transactional
public class AlarmService {
    private final AlarmRepository alarmRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<AlarmResponseDto> getAlarms() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        List<Alarm> alarms = alarmRepository.findByUser_UserId(userDetails.getUserId()).orElse(new ArrayList<>());
        List<AlarmResponseDto> list = new ArrayList<>();

        for(Alarm alarm : alarms) {
            list.add(Alarm.toAlarmResponseDto(alarm));
        }
        return list;
    }

    public AlarmResponseDto creatAlarm(AlarmCreateRequestDto alarmCreateRequestDto) {
        User user = userRepository.findByUserId(alarmCreateRequestDto.getUserId())
                .orElseThrow(()-> new CustomException(ErrorCode.UserNotFoundException));

        Alarm alarm = Alarm.builder()
                .user(user)
                .alarmType(alarmCreateRequestDto.getAlarmType())
                .content(alarmCreateRequestDto.getAccessCode())
                .build();

        log.info("creat alarm");
        return Alarm.toAlarmResponseDto(alarmRepository.save(alarm));
    }

    public AlarmResponseDto readAlarm(Integer alarmId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        Alarm alarm = alarmRepository.findByAlarmId(alarmId)
                .orElseThrow(() -> new CustomException(ErrorCode.QuestionNotFoundException));

        if(!userDetails.getUserId().equals(alarm.getUser().getUserId()))
            throw new CustomException(ErrorCode.IllegalArgument);

        log.info("read alarm");
        alarm.setState(1);
        return Alarm.toAlarmResponseDto(alarm);
    }

    public void deleteAlarm(Integer alarmId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        Alarm alarm = alarmRepository.findByAlarmId(alarmId)
                .orElseThrow(() -> new CustomException(ErrorCode.AlarmNotFoundException));

        if(!alarm.getUser().getUserId().equals(userDetails.getUserId()))
            throw new CustomException(ErrorCode.IllegalArgument);

        alarmRepository.delete(alarm);
    }

}
