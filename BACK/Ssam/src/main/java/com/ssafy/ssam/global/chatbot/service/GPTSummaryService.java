package com.ssafy.ssam.global.chatbot.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.ssam.domain.consult.dto.request.SummaryRequestDto;
import com.ssafy.ssam.global.chatbot.dto.*;
import com.ssafy.ssam.global.chatbot.dto.request.GPTRequest;
import com.ssafy.ssam.global.chatbot.dto.response.GPTResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.ArrayList;

import static com.ssafy.ssam.global.chatbot.util.summaryPrompt;

@Slf4j
@Service
@RequiredArgsConstructor
public class GPTSummaryService {

    @Value("${gpt.model}")
    private String model;

    @Value("${gpt.api.url}")
    private String apiUrl;
    private final RestTemplate restTemplate;

    public SummaryRequestDto GPTsummaryConsult(String talk, String topic) {
    	System.out.println("TALK ::: " + talk);
        String before = summaryPrompt(topic);

        GPTRequest request =
                GPTRequest.builder()
                        .model(model)
                        .messages(new ArrayList<>())
                        .temperature(0.5F)
                        .maxTokens(500)
                        .topP(0.3F)
                        .frequencyPenalty(0.8F)
                        .presencePenalty(0.5F)
                        .build();
        request.getMessages().add(new Message("system", before));
        request.getMessages().add(new Message("user", talk));

        GPTResponse chatGPTResponse = restTemplate.postForObject(apiUrl, request, GPTResponse.class);

        System.out.println(chatGPTResponse.getChoices().get(0).getMessage().getContent());
        return jsonToSummaryRequest(chatGPTResponse.getChoices().get(0).getMessage().getContent());
    }
    public SummaryRequestDto jsonToSummaryRequest(String gptAnswer) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            if (gptAnswer.startsWith("```json\n") && gptAnswer.endsWith("```")) {
                gptAnswer = gptAnswer.substring(8, gptAnswer.length() - 3);
            }
            JsonNode jsonNode = objectMapper.readTree(gptAnswer);
        //     log.info(jsonNode.toString());
        //    log.info("{}" , jsonNode.get("요약").asText());
        //    log.info("{}" , jsonNode.get("부모 우려").asText());
        //    log.info("{}" , jsonNode.get("교사 추천").asText());
        //    log.info("{}" , jsonNode.get("욕설 횟수").asText());
        //    log.info("{}" , jsonNode.get("욕설 수준").asText());

            return SummaryRequestDto.builder()
                    .keyPoint(jsonNode.get("요약").asText())
                    .parentConcern(jsonNode.get("부모 우려").asText())
                    .teacherRecommendation(jsonNode.get("교사 추천").asText())
                    .profanityLevel(jsonNode.get("욕설 수준").asText())
                    .profanityCount(Integer.parseInt(jsonNode.get("욕설 횟수").asText()))
                    .build();

        } catch (JsonProcessingException e) {
            log.error("Error parsing GPT response JSON: {}", e.getMessage());
            return null;
        }
    }
}