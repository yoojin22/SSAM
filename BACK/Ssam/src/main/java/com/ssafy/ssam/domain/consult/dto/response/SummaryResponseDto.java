package com.ssafy.ssam.domain.consult.dto.response;

import com.ssafy.ssam.domain.consult.entity.Consult;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Date;

@Getter
@Setter
@Builder
public class SummaryResponseDto {
    private Integer summaryId;

    @NotNull
    private Consult consult;

    @NotNull
    private String keyPoint;
    @NotNull
    private int profanityCount;
    @NotNull
    private String profanityLevel;
    private String parentConcern;
    private String teacherRecommendation;
    private LocalDate followUpDate;
}
