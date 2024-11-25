package com.ssafy.ssam.domain.consult.controller;

import com.ssafy.ssam.domain.consult.dto.response.ConsultSummaryDetailResponseDto;
import com.ssafy.ssam.domain.consult.service.ConsultService;
import com.ssafy.ssam.domain.consult.service.SummaryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/v1/consults")
public class SummaryController {
    private final SummaryService summaryService;

    @GetMapping("/teachers/{consultId}")
    public ResponseEntity<ConsultSummaryDetailResponseDto> getConsult(@PathVariable("consultId") Integer consultId) {
        return ResponseEntity.ok(summaryService.getConsultsAndSummaryDetails(consultId));
    }
}
