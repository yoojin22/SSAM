package com.ssafy.ssam.domain.classroom.controller;

import com.ssafy.ssam.domain.classroom.dto.response.SchoolResponseDTO;
import com.ssafy.ssam.domain.classroom.service.SchoolService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/v1")
public class SchoolController {
    
    private final SchoolService schoolService;
    
    // 학교 목록을 가져오는 컨트롤러
    @GetMapping("/schools")
    public ResponseEntity<List<SchoolResponseDTO>> getSchool() {
        return ResponseEntity.ok(schoolService.getSchool());
    }

    @GetMapping("/schools/search")
    public ResponseEntity<List<SchoolResponseDTO>> searchSchool(@RequestParam String query) {
        return ResponseEntity.ok(schoolService.searchSchool(query));
    }
}
