package com.ssafy.ssam.global.error.exception;

import com.ssafy.ssam.global.error.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class BindingException extends RuntimeException{
    final ErrorCode errorCode;
    final String message;
}
