package com.ssafy.ssam.global.auth.service;

import java.time.LocalDate;

import com.ssafy.ssam.global.auth.dto.request.JoinRequestDto;
import com.ssafy.ssam.global.auth.entity.User;
import com.ssafy.ssam.global.auth.entity.UserRole;
import com.ssafy.ssam.global.auth.jwt.JwtUtil;
import com.ssafy.ssam.global.auth.repository.OAuthUserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.ssam.domain.user.dto.response.UserDto;
import com.ssafy.ssam.global.auth.repository.UserRepository;
import com.ssafy.ssam.global.dto.CommonResponseDto;
import com.ssafy.ssam.global.error.ErrorCode;
import com.ssafy.ssam.global.error.exception.DuplicateUserNameException;

import lombok.Builder;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Builder
@Service
@Transactional
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final OAuthUserRepository oAuthUserRepository;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final JwtUtil jwtUtil;

    public CommonResponseDto teacherJoinProcess(JoinRequestDto userDto){
        if(userRepository.existsByUsername(userDto.getUsername())) throw new DuplicateUserNameException(ErrorCode.DuplicateUserName);
        User user = User.JoinRequestToUser(userDto);
        user.setPassword(bCryptPasswordEncoder.encode(userDto.getPassword()));
        user.setRole(UserRole.TEACHER);
        userRepository.save(user);

        return new CommonResponseDto("OK");
    }

    public CommonResponseDto studentJoinProcess(JoinRequestDto userDto){
        if(userRepository.existsByUsername(userDto.getUsername())) throw new DuplicateUserNameException(ErrorCode.DuplicateUserName);
        User user = User.JoinRequestToUser(userDto);
        user.setPassword(bCryptPasswordEncoder.encode(userDto.getPassword()));
        user.setRole(UserRole.STUDENT);
        userRepository.save(user);

        return new CommonResponseDto("OK");
    }

	public CommonResponseDto userGenProcess() {
		
        // Admin 사용자 생성
        UserDto admin = new UserDto();
        admin.setUsername("admin1");
        admin.setPassword(bCryptPasswordEncoder.encode("1234"));
        admin.setName("Admin User");
        admin.setEmail("admin@example.com");
        admin.setPhone("01012345678");
        admin.setRole(UserRole.ADMIN);
        admin.setBirth(LocalDate.of(2000, 1, 1));
        userRepository.save(User.toUser(admin));
        
        // Teacher 사용자 생성
        UserDto teacher = new UserDto();
        teacher.setUsername("teacher1");
        teacher.setPassword(bCryptPasswordEncoder.encode("1234"));
        teacher.setName("Teacher User");
        teacher.setEmail("teacher@example.com");
        teacher.setPhone("01023456789");
        teacher.setRole(UserRole.TEACHER);
        teacher.setBirth(LocalDate.of(1990, 1, 1));
        userRepository.save(User.toUser(teacher));
        
        // Student 사용자들 생성
        for (int i = 1; i <= 20; i++) {
            UserDto student = new UserDto();
            student.setUsername("student" + i);
            student.setPassword(bCryptPasswordEncoder.encode("1234"));
            student.setName("Student " + i);
            student.setEmail("student" + i + "@example.com");
            student.setPhone("010" + String.format("%08d", i));
            student.setRole(UserRole.STUDENT);
            student.setBirth(LocalDate.of(2005, 1, 1).plusDays(i - 1));
            userRepository.save(User.toUser(student));
        }
		
		return new CommonResponseDto("OK");
	}
}
