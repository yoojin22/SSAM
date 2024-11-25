package com.ssafy.ssam.domain.consult.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.ssafy.ssam.domain.consult.dto.request.SummaryRequestDto;
import com.ssafy.ssam.domain.consult.dto.response.ConsultSummaryDetailResponseDto;
import com.ssafy.ssam.domain.consult.entity.Appointment;
import com.ssafy.ssam.domain.consult.entity.Consult;
import com.ssafy.ssam.domain.consult.entity.Summary;
import com.ssafy.ssam.domain.consult.repository.AppointmentRepository;
import com.ssafy.ssam.domain.consult.repository.ConsultRepository;
import com.ssafy.ssam.domain.consult.repository.SummaryRepository;
import com.ssafy.ssam.global.amazonS3.service.S3TextService;
import com.ssafy.ssam.global.auth.dto.CustomUserDetails;
import com.ssafy.ssam.global.auth.entity.User;
import com.ssafy.ssam.global.auth.entity.UserRole;
import com.ssafy.ssam.global.auth.repository.UserRepository;
import com.ssafy.ssam.global.chatbot.service.GPTSummaryService;
import com.ssafy.ssam.global.error.CustomException;
import com.ssafy.ssam.global.error.ErrorCode;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class SummaryService {
    private final ConsultRepository consultRepository;
    private final SummaryRepository summaryRepository;
    private final AppointmentRepository appointmentRepository;
    private final GPTSummaryService gptSummaryService;
    private final UserRepository userRepository;
    private final S3TextService s3TextService;

    public ConsultSummaryDetailResponseDto getConsultsAndSummaryDetails(Integer consultId){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        User user = userRepository.findByUserIdAndRole(userDetails.getUserId(), UserRole.TEACHER)
                .orElseThrow(() -> new CustomException(ErrorCode.UserNotFoundException));
        
        Consult consult = consultRepository.findByConsultId(consultId)
        		.orElseThrow(() -> new CustomException(ErrorCode.ConsultNotFountException));
        
        Summary summary = summaryRepository.findByConsult(consult)
        		.orElse(null);
        
        if(summary != null) {
        	return consultRepository.findConsultSummaryByConsultId(consultId).orElseThrow(() -> new CustomException(ErrorCode.ConsultNotFountException));
        }
        
        String content = consult.getContent();
        System.out.println("CONTENT IS :: " + content);
        if(content == null) {
        	content = s3TextService.readText(consult.getWebrtcSessionId());
        	consult.setContent(content);
        	consultRepository.save(consult);
        }
        if(content != null) {
        	Appointment appointment = appointmentRepository.findByAppointmentId(consult.getAppointment().getAppointmentId()).orElseThrow(()->new CustomException(ErrorCode.AppointmentNotFoundException));
            SummaryRequestDto summaryRequestDto = gptSummaryService.GPTsummaryConsult(content, appointment.getTopic().toString());
            summary = Summary.toSummary(summaryRequestDto, consult);
            summaryRepository.save(summary);
        }
        
        return consultRepository.findConsultSummaryByConsultId(consultId).orElseThrow(() -> new CustomException(ErrorCode.ConsultNotFountException));
        
        
    }
}

