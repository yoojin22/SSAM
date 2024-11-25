package com.ssafy.ssam.global.auth.controller;

import com.ssafy.ssam.global.auth.dto.request.JoinRequestDto;
import com.ssafy.ssam.global.dto.CommonResponseDto;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.ssafy.ssam.global.auth.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Controller
@ResponseBody
@RequestMapping("/v1/auth")
public class  UserController {
    private final UserService joinService;

    @GetMapping("/gen")
    public ResponseEntity<CommonResponseDto> userGenProcess(){
        return ResponseEntity.ok(joinService.userGenProcess());
    }
    
    
    @PostMapping("/students")
    public ResponseEntity<CommonResponseDto> studentJoinProcess(@Valid @RequestBody JoinRequestDto joinRequestDto){
        return ResponseEntity.ok(joinService.studentJoinProcess(joinRequestDto));
    }

    @PostMapping("/teachers")
    public ResponseEntity<CommonResponseDto> teacherJoinProcess(@Valid @RequestBody  JoinRequestDto joinRequestDto){
        return ResponseEntity.ok(joinService.teacherJoinProcess(joinRequestDto));
    }
    
}
