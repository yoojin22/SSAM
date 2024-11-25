package com.ssafy.ssam.global.error;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class ErrorResponse {
    private HttpStatus status;
    private String errorMessage;

    public ErrorResponse(ErrorCode errorCode) {
        this.status = errorCode.getHttpStatus();
        this.errorMessage = errorCode.getErrorMessage();
    }
}
