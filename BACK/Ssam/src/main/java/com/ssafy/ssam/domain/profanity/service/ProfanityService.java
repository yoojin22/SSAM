package com.ssafy.ssam.domain.profanity.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.ssafy.ssam.domain.profanity.dto.PredictionResultDto;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class ProfanityService {
    private final RestTemplate restTemplate;
    private final String pythonServiceUrl = "http://i11e201.p.ssafy.io:8082/predict";
    private final ObjectMapper objectMapper;

    @Autowired
    public ProfanityService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public PredictionResultDto getPrediction(String message) {
        System.out.println("Starting getPrediction method with message: " + message);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        System.out.println("Headers set: " + headers);

        String requestBody = "{\"sentence\":\"" + message + "\"}";
        System.out.println("Request body created: " + requestBody);

        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);
        System.out.println("HttpEntity created: " + request);

        try {
            System.out.println("Sending request to: " + pythonServiceUrl);
            ResponseEntity<String> responseEntity = restTemplate.postForEntity(pythonServiceUrl, request, String.class);
            
            String responseBody = responseEntity.getBody();
            System.out.println("Received response body: " + responseBody);

            PredictionResultDto result = objectMapper.readValue(responseBody, PredictionResultDto.class);
            System.out.println("Parsed result: " + result);
            
            return result;
        } catch (Exception e) {
            System.out.println("Exception occurred: " + e.getMessage());
            e.printStackTrace();
            return new PredictionResultDto();
        }
    }
}