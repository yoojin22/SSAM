package com.ssafy.ssam.global.auth.entity;

import com.ssafy.ssam.domain.classroom.entity.School;
import com.ssafy.ssam.domain.user.entity.UserBoardRelation;
import com.ssafy.ssam.domain.consult.entity.Appointment;
import com.ssafy.ssam.domain.user.entity.Alarm;
import com.ssafy.ssam.domain.classroom.entity.Question;
import com.ssafy.ssam.domain.user.dto.response.UserDto;
import com.ssafy.ssam.global.auth.dto.request.JoinRequestDto;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;

    @NotNull
    @Column(name = "name", length = 22, nullable = false)
    private String name;

    @NotNull
    @Email
    @Column(name = "email", length = 45, nullable = false)
    private String email;

    @NotNull
    @Column(name = "phone", length = 11, nullable = false)
    private String phone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_id")
    private School school;

    @Column(name = "img_url")
    private String imgUrl;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @NotNull
    @Temporal(TemporalType.DATE)
    @Column(nullable = false, columnDefinition = "TIMESTAMP")
    private LocalDate birth;

    @Column(name = "other_name")
    private String otherName;

    @Column(name = "other_phone")
    private String otherPhone;

    @Column(name = "other_relation", length = 1)
    private String otherRelation;

    @NotNull
    @Column(nullable = false, unique = true, length = 20)
    private String username;

    @NotNull
    @Column(nullable = false)
    private String password;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<UserBoardRelation> boards = new ArrayList<>();

    @OneToMany(mappedBy = "student")
    private List<Question> questions = new ArrayList<>();

    @OneToMany(mappedBy = "student")
    private List<Appointment> studentAppointments = new ArrayList<>();

    @OneToMany(mappedBy = "teacher")
    private List<Appointment> teacherAppointments = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<Alarm> alarms = new ArrayList<>();

    public UserDto toUserDto(User userEntity) {
        return UserDto.builder()
                .userId(userEntity.userId)
                .name(userEntity.name)
                .email(userEntity.email)
                .phone(userEntity.phone)
                .school(userEntity.school)
//                .boards(userEntity.boards)
                .imgUrl(userEntity.imgUrl)
                .role(userEntity.role)
                .birth(userEntity.birth)
                .otherName(userEntity.otherName)
                .otherPhone(userEntity.otherPhone)
                .otherRelation(userEntity.otherRelation)
                .username(userEntity.username)
                .password(userEntity.password)
                .build();
    }

    public static User toUser(UserDto ssamUserDto) {
        return User.builder()
                .userId(ssamUserDto.getUserId())
                .name(ssamUserDto.getName())
                .email(ssamUserDto.getEmail())
                .phone(ssamUserDto.getPhone())
                .school(ssamUserDto.getSchool())
                .boards(ssamUserDto.getBoards())
                .imgUrl(ssamUserDto.getImgUrl())
                .role(ssamUserDto.getRole())
                .birth(ssamUserDto.getBirth())
                .otherName(ssamUserDto.getOtherName())
                .otherPhone(ssamUserDto.getOtherPhone())
                .otherRelation(ssamUserDto.getOtherRelation())
                .username(ssamUserDto.getUsername())
                .password(ssamUserDto.getPassword())
                .build();
    }

    public static User JoinRequestToUser(JoinRequestDto requestDto){
        return User.builder()
                .name(requestDto.getName())
                .email(requestDto.getEmail())
                .phone(requestDto.getPhone())
                .birth(requestDto.getBirth())
                .username(requestDto.getUsername())
                .password(requestDto.getPassword())
                .build();
    }

    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

}
