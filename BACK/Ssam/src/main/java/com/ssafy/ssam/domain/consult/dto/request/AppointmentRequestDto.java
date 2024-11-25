package com.ssafy.ssam.domain.consult.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentRequestDto {
    @Size(max = 50, message = "50자 이상은 입력받을 수 없습니다")
    private String description;
    @NotNull(message = "시작시간은 Null 일 수 없습니다!")
    private LocalDateTime startTime;
    @NotNull(message = "종료시간은 Null 일 수 없습니다!")
    private LocalDateTime endTime;

    @NotNull(message = "카테고리를 정해주세요")
    private String topic;

    @Override
    public String toString() {
        return this.description+" "+this.startTime+" "+this.endTime;
    }
}
