package com.ssafy.ssam.domain.classroom.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class BoardCreateRequestDTO {

    @NotNull
    @Min(1)
    @Max(6)
    private Integer grade;

    @NotNull
    private Integer classroom;
}
