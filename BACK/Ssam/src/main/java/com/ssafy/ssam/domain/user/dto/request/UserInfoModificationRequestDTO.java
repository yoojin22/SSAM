package com.ssafy.ssam.domain.user.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoModificationRequestDTO {

    private String school;

    @NotNull
    @Pattern(regexp = "\\d{11}", message = "selfPhone must be 11 digits")
    private String selfPhone;
    private String otherPhone;
    private MultipartFile profileImage;

}
