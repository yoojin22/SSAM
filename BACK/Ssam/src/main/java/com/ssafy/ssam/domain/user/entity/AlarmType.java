package com.ssafy.ssam.domain.user.entity;

import lombok.Getter;

import java.util.Arrays;

@Getter
public enum AlarmType {
    ANSWER, // 대답
    QUESTION, //질문
    REGISTRATION, // 팔로우신청
    ACCEPT, //팔로우허락
    CONSULT
}
