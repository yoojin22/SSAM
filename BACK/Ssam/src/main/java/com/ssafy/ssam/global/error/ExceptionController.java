package com.ssafy.ssam.global.error;

import com.ssafy.ssam.global.error.exception.BindingException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Objects;

@RestControllerAdvice
public class ExceptionController {

//    @ExceptionHandler(BindingException.class)
//    public ResponseEntity<Object> bindingError(BindingException e) {
//        ErrorCode errorCode = e.getErrorCode();
//        return handleExceptionBinding(errorCode,e.getMessage());
//    }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        BindingResult result = ex.getBindingResult();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse(HttpStatus.BAD_REQUEST, Objects.requireNonNull(result.getFieldError()).getDefaultMessage()) );
    }

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ErrorResponse> customExceptionHandler(CustomException e) {
        ErrorResponse response = new ErrorResponse(e.getErrorCode().getHttpStatus(),
                e.getErrorCode().getErrorMessage());
        return ResponseEntity.status(e.getErrorCode().getHttpStatus()).body(response);
    }

    private ResponseEntity<Object> handleExceptionBinding(ErrorCode errorCode,String message) {
        return ResponseEntity
                .status(errorCode.getHttpStatus())
                .body(new ErrorResponse(errorCode.getHttpStatus(), message));
    }
}
