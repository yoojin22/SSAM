package com.ssafy.ssam.domain.profanity.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PredictionResultDto {
    private String normal;
    private String offensive;
    private String hate;
    private String category;
}
