package com.ssafy.ssam.domain.classroom.dto.response;

import com.ssafy.ssam.domain.user.dto.response.StudentInfoListDTO;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BoardGetResponseDTO {
    private Integer boardId;
    private String pin;
    private String banner;
    private String bannerImg;
    private String notice;
    private Integer grade;
    private Integer classroom;
    private String consultUrl;
    private List<StudentInfoListDTO> students;

    // 학급에서 나타낼 유저, 질문을 위해 UserDTO, QuestionDTO 추가 필요
    // private List<UserDTO> users;
    // private List<QuestionDTO> questions;
}
