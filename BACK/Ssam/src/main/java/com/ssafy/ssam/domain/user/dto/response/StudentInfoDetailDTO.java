package com.ssafy.ssam.domain.user.dto.response;

import com.ssafy.ssam.domain.consult.dto.response.ConsultSummaryDTO;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentInfoDetailDTO {

    private Integer studentId;
    private String name;
    private LocalDate birth;
    private String studentImage;

    // 상담 - 간단한 정보만 담고 있는 리스트
    private List<ConsultSummaryDTO> consultList;

    // 상담 요약 관련 정보 추가 필요
//    private Summary summary;
}
