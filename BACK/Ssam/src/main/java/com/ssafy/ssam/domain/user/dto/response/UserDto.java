package com.ssafy.ssam.domain.user.dto.response;

import java.time.LocalDate;
import java.util.List;

import com.ssafy.ssam.domain.classroom.entity.School;
import com.ssafy.ssam.domain.user.entity.UserBoardRelation;
import com.ssafy.ssam.global.auth.entity.UserRole;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private Integer userId;
    private String name;
    private String email;
    private String phone;
    private School school;
    private UserRole role;
    private List<UserBoardRelation> boards;
    private String imgUrl;
    private LocalDate birth;
    private String otherName;
    private String otherPhone;
    private String otherRelation;

    private String username;
    private String password;
    
    @Override
    public String toString() {
        return "UserDto [userId=" + userId + ", name=" + name + ", email=" + email + ", phone=" + phone + ", school=" + school + ", role=" + role + ", boards=" + boards + ", imgUrl=" + imgUrl + ", birth=" + birth + ", otherName=" + otherName + ", otherPhone=" + otherPhone + ", otherRelation=" + otherRelation + ", username=" + username + ", password=" + password + "]";
    }
}
