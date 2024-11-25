package com.ssafy.ssam.domain.user.service;

import com.ssafy.ssam.domain.classroom.entity.Board;
import com.ssafy.ssam.domain.classroom.repository.BoardRepository;
import com.ssafy.ssam.domain.user.dto.response.UserInitialInfoResponseDTO;
import com.ssafy.ssam.domain.classroom.repository.SchoolRepository;
import com.ssafy.ssam.domain.user.dto.request.UserInfoModificationRequestDTO;
import com.ssafy.ssam.domain.user.dto.response.UserInfoResponseDTO;
import com.ssafy.ssam.domain.user.entity.UserBoardRelation;
import com.ssafy.ssam.domain.user.entity.UserBoardRelationStatus;
import com.ssafy.ssam.domain.user.repository.UserBoardRelationRepository;
import com.ssafy.ssam.global.amazonS3.service.S3ImageService;
import com.ssafy.ssam.global.auth.dto.CustomUserDetails;
import com.ssafy.ssam.global.auth.entity.User;
import com.ssafy.ssam.domain.classroom.entity.School;
import com.ssafy.ssam.global.auth.entity.UserRole;
import com.ssafy.ssam.global.auth.repository.UserRepository;
import com.ssafy.ssam.global.dto.CommonResponseDto;
import com.ssafy.ssam.global.error.CustomException;
import com.ssafy.ssam.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserInfoService {

    private final UserRepository userRepository;
    private final SchoolRepository schoolRepository;
    private final S3ImageService s3ImageService;
    private final BoardRepository boardRepository;
    private final UserBoardRelationRepository userBoardRelationRepository;


    // 사용자 상세 정보 제공 로직
    public UserInfoResponseDTO getUserInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        User user = userRepository.findByUserId(userDetails.getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.UserNotFoundException));

        return UserInfoResponseDTO.builder()
                .name(user.getName())
                .profileImage(user.getImgUrl())
                .birth(user.getBirth())
                .school(Optional.ofNullable(user.getSchool()).map(School::getName).orElse(null))
                .username(user.getUsername())
                .email(user.getEmail())
                .selfPhone(user.getPhone())
                .otherPhone(user.getOtherPhone())
                .build();
    }

    // 사용자 정보 수정 로직
    public CommonResponseDto modificateUserInfo (UserInfoModificationRequestDTO requestDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        User user = userRepository.findByUserId(userDetails.getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.UserNotFoundException));

        String schoolName = requestDTO.getSchool();
        String selfPhone = requestDTO.getSelfPhone();
        String otherPhone = requestDTO.getOtherPhone();
        MultipartFile profileImage = requestDTO.getProfileImage();

        user.setSchool(schoolRepository.findSchoolByName(schoolName).orElse(null));
        user.setPhone(selfPhone);
        user.setOtherPhone(requestDTO.getOtherPhone());
        if (profileImage != null && !profileImage.isEmpty()) {
            String imagePath = s3ImageService.upload(profileImage, "profile");
            user.setImgUrl(imagePath);
        }

        userRepository.save(user);

        return new CommonResponseDto("Modificated");
    }

    public UserInitialInfoResponseDTO getInitialInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        User user = userRepository.findByUserId(userDetails.getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.Unauthorized));
        
        Board board = null;
        List<UserBoardRelation> relation;
        if(user.getRole() == UserRole.TEACHER) relation = userBoardRelationRepository.findByUserAndStatus(user, UserBoardRelationStatus.OWNER);
        else relation = userBoardRelationRepository.findByUserAndStatus(user, UserBoardRelationStatus.ACCEPTED);
        for(UserBoardRelation r : relation) if(r.getBoard().getIsDeprecated() == 0) board = r.getBoard();

        Integer teacherId = null;
        if(board != null) {
        	Optional<UserBoardRelation> tempRelation = userBoardRelationRepository.findByBoardIdAndStatus(board.getBoardId());
        	 teacherId = tempRelation.get().getUser().getUserId();
        }
        

        //Optional<UserBoardRelation> relation = Optional.of(userBoardRelationRepository.findTeacherByStudentId(user.getUserId()).orElse(null));
        
        return UserInitialInfoResponseDTO.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .name(user.getName())
                .boardId(board == null? null : board.getBoardId())
                .role(String.valueOf(user.getRole()))
                .school(Optional.ofNullable(user.getSchool()).map(School::getName).orElse(null))
                .teacherId(teacherId)
                .build();
    }

}
