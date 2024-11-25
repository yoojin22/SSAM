package com.ssafy.ssam.domain.user.repository;

import com.ssafy.ssam.domain.user.entity.Alarm;
import com.ssafy.ssam.global.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AlarmRepository extends JpaRepository<Alarm, Integer> {
    Optional<List<Alarm>> findByUser_UserId(Integer userId);
    Optional<Alarm> findByAlarmId(Integer alarmId);
}
