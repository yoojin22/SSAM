package com.ssafy.ssam.domain.classroom.service;

import com.ssafy.ssam.domain.classroom.dto.response.SchoolResponseDTO;
import com.ssafy.ssam.domain.classroom.entity.School;
import com.ssafy.ssam.domain.classroom.repository.SchoolRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class SchoolService {

    private final SchoolRepository schoolRepository;

    // 학교 목록 확인
    public List<SchoolResponseDTO> getSchool() {
        return schoolRepository.findAll().stream()
                .map(this::convertToSchoolDTO)
                .collect(Collectors.toList());
    }

    // 학교 목록 검색
    public List<SchoolResponseDTO> searchSchool(String query) {
        List<School> schools = schoolRepository.findByNameContaining(query)
                .orElse(new ArrayList<>());
        return schools.stream()
                .map(school -> SchoolResponseDTO.builder()
                        .schoolId(school.getSchoolId())
                        .schoolName(school.getName())
                        .build())
                .collect(Collectors.toList());
    }

    // 학교 응답 객체 생성
    private SchoolResponseDTO convertToSchoolDTO(School school) {
        return SchoolResponseDTO.builder()
                .schoolId(school.getSchoolId())
                .schoolName(school.getName())
                .build();
    }

}
