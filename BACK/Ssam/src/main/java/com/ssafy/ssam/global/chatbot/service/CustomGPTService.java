/*
package com.ssafy.ssam.global.chatbot.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

import com.ssafy.ssam.global.amazonS3.service.S3ImageService;
import com.ssafy.ssam.global.error.CustomException;
import com.ssafy.ssam.global.error.ErrorCode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.ssafy.ssam.global.chatbot.dto.request.CustomGPTRequest;
import com.ssafy.ssam.global.chatbot.dto.request.CustomGPTRequest.ImageUrl;
import com.ssafy.ssam.global.chatbot.dto.response.GPTResponse;
import com.ssafy.ssam.global.chatbot.dto.response.GPTResponse.Choice;
import com.ssafy.ssam.global.chatbot.dto.request.ImageRequestDto;
import com.ssafy.ssam.global.chatbot.dto.Message;
import com.ssafy.ssam.global.dto.CommonResponseDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomGPTService {

    private final S3ImageService s3ImageService;
    @Value("${gpt.model}")
    private String model;

    @Value("${gpt.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate;

    public CommonResponseDto uploadImage(ImageRequestDto imageRequestDto) {
        String imageUrl = s3ImageService.upload(imageRequestDto.getImage(), "gptnotice");

        CustomGPTRequest request = CustomGPTRequest.builder()
                .model(model)
                .messages(new ArrayList<>())
                .temperature(0.5F)
                .maxTokens(500)
                .topP(0.3F)
                .frequencyPenalty(0.8F)
                .presencePenalty(0.5F)
                .build();

        try{
            String dataUrl = "data:image/jpeg;base64," + Base64.getEncoder().encodeToString(imageRequestDto.getImage().getBytes());

            List<CustomGPTRequest.Content> contents = new ArrayList<>();
            contents.add(CustomGPTRequest.Content.builder()
                    .type("image_url")
                    .image_url(CustomGPTRequest.ImageUrl.builder()
                            .url(dataUrl)
                            .build())
                    .build());

            CustomGPTRequest.Message message = CustomGPTRequest.Message.builder()
                    .role("user")
                    .content(contents)
                    .build();

            request.setMessages(List.of(message));
            GPTResponse chatGPTResponse = restTemplate.postForObject(apiUrl, request, GPTResponse.class);
        } catch(Exception e) {
        	throw new CustomException(ErrorCode.GPTError);
        }
        return new CommonResponseDto("Image uploaded and processed successfully");
    }
}*/
