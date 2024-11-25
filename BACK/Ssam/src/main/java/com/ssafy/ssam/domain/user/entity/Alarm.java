package com.ssafy.ssam.domain.user.entity;

import com.ssafy.ssam.domain.user.dto.response.AlarmResponseDto;
import com.ssafy.ssam.global.auth.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Builder
@EntityListeners(AuditingEntityListener.class)
@AllArgsConstructor(access = AccessLevel.PROTECTED)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Getter
@Setter
@DynamicInsert // null 배제하고 날려도 되는
@Table(name = "alarm")
public class Alarm {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "alarm_id")
    private Integer alarmId;

    @Enumerated(EnumType.STRING)
    @Column(name = "alarm_type", nullable = false)
    private AlarmType alarmType;

    @Column
    private String content;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    @ColumnDefault("0")
    @Column(nullable = false, columnDefinition = "TINYINT(1)")
    private Integer state;

    @CreatedDate
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "alarm_time", columnDefinition = "TIMESTAMP", nullable = false)
    private LocalDateTime alarmTime;

    static public AlarmResponseDto toAlarmResponseDto (Alarm alarm){
        return AlarmResponseDto.builder()
                .alarmId(alarm.getAlarmId())
                .alarmType(alarm.getAlarmType())
                .state(alarm.getState())
                .alarmTime(alarm.getAlarmTime())
                .build();
    }
}
