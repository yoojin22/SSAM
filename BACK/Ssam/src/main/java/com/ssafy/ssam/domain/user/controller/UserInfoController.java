package com.ssafy.ssam.domain.user.controller;

import com.ssafy.ssam.domain.user.dto.request.UserInfoModificationRequestDTO;
import com.ssafy.ssam.domain.user.dto.response.UserInfoResponseDTO;
import com.ssafy.ssam.domain.user.dto.response.UserInitialInfoResponseDTO;
import com.ssafy.ssam.domain.user.service.UserInfoService;
import com.ssafy.ssam.global.dto.CommonResponseDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RequestMapping("/v1/users")
@RestController
public class UserInfoController {

    private final UserInfoService userInfoService;

    // 사용자의 상세 정보를 제공하는 컨트롤러
    @GetMapping
    public ResponseEntity<UserInfoResponseDTO> getUserInfo () {
        return ResponseEntity.ok(userInfoService.getUserInfo());
    }

    @PutMapping
    public ResponseEntity<CommonResponseDto> modificateUserInfo (@Valid UserInfoModificationRequestDTO requestDTO) {
        return ResponseEntity.ok(userInfoService.modificateUserInfo(requestDTO));
    }

    @GetMapping("/initial")
    public ResponseEntity<UserInitialInfoResponseDTO> getUserInitialInfo () {
        return ResponseEntity.ok(userInfoService.getInitialInfo());
    }

}
