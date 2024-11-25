package com.ssafy.ssam.global.chatbot.service;

import com.ssafy.ssam.domain.classroom.entity.Board;
import com.ssafy.ssam.domain.classroom.repository.BoardRepository;
import com.ssafy.ssam.global.amazonS3.service.S3ImageService;
import com.ssafy.ssam.global.auth.dto.CustomUserDetails;
import com.ssafy.ssam.global.auth.entity.User;
import com.ssafy.ssam.global.auth.repository.UserRepository;
import com.ssafy.ssam.global.chatbot.dto.Message;
import com.ssafy.ssam.global.chatbot.dto.request.*;
import com.ssafy.ssam.global.chatbot.dto.response.GPTResponse;
import com.ssafy.ssam.global.chatbot.dto.response.QuestionResponseDto;
import com.ssafy.ssam.global.chatbot.entity.ChatBot;
import com.ssafy.ssam.global.chatbot.repository.ChatbotRepository;
import com.ssafy.ssam.global.dto.CommonResponseDto;
import com.ssafy.ssam.global.error.CustomException;
import com.ssafy.ssam.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

import static com.ssafy.ssam.global.chatbot.util.AnswerPrompt;
import static com.ssafy.ssam.global.chatbot.util.imageUploadPrompt;

@Slf4j
@Service
@RequiredArgsConstructor
public class GPTChatbotService {

    private final BoardRepository boardRepository;
    private final UserRepository userRepository;
    @Value("${gpt.model}")
    private String model;
    @Value("${gpt.api.url}")
    private String apiUrl;
    @Value("${gpt.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate;
    private final S3ImageService s3ImageService;
    private final ChatbotRepository chatbotRepository;

    // 학생이 질문하기
    public QuestionResponseDto askQuestion(String question) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        User user = userRepository.findByUserId(userDetails.getUserId())
                .orElseThrow(()->new CustomException(ErrorCode.UserNotFoundException));
        Board board = boardRepository.findByBoardId(userDetails.getBoardId())
                .orElseThrow(() -> new CustomException(ErrorCode.BoardNotFoundException));

        List<String> prompts = chatbotRepository.findContentByTimeAndBoardId
                        (LocalDateTime.now(), board.getBoardId())
                .orElseThrow(()->new CustomException(ErrorCode.BoardDataNotFound));

        StringBuilder message = new StringBuilder(AnswerPrompt).append("\n----------\n");
        for(String prompt : prompts) {
            message.append(prompt).append("\n----------\n");
        }

        GPTRequest request =
                GPTRequest.builder()
                        .model(model)
                        .messages(new ArrayList<>())
                        .temperature(0.6F)
                        .maxTokens(2000)
                        .topP(0.4F)
                        .frequencyPenalty(0.2F)
                        .presencePenalty(0.15F)
                        .build();
        request.getMessages().add(new Message("system", message.toString()));
        request.getMessages().add(new Message("user", question));

        GPTResponse chatGPTResponse = restTemplate.postForObject(apiUrl, request, GPTResponse.class);

        // 답변 뱉어내기
        return QuestionResponseDto.builder()
                .content(chatGPTResponse.getChoices().get(0).getMessage().getContent())
                .build();
    }

    // 선생님의 요청 (이거 기반으로 대답해야함 ) DB에 저장하기
    public CommonResponseDto uploadNotice(NoticeRequestDto noticeRequestDto){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        User user = userRepository.findByUserId(userDetails.getUserId())
                .orElseThrow(()->new CustomException(ErrorCode.UserNotFoundException));
        Board board = boardRepository.findByBoardId(userDetails.getBoardId())
                .orElseThrow(() -> new CustomException(ErrorCode.BoardNotFoundException));

        chatbotRepository.save(ChatBot.builder()
                .board(board)
                .user(user)
                .content(noticeRequestDto.getContent())
                .startTime(noticeRequestDto.getStartTime())
                .endTime(noticeRequestDto.getEndTime())
                .build());
        return new CommonResponseDto("upload about notice to DB");
    }

    // 이미지 + 요청인 경우
    public CommonResponseDto uploadNoticeAndImage(ImageRequestDto imageRequestDto) {
        //이미지 입력 후 url 얻기
        String dataUrl = null;
        try{
            dataUrl = "data:image/jpeg;base64," + Base64.getEncoder().encodeToString(imageRequestDto.getImage().getBytes());
        } catch(Exception e) {
            throw new CustomException(ErrorCode.GPTError);
        }

        //이미지 결과 return
        String output = convertImageToText(dataUrl);
        //요약한 내용 DB에 저장
        uploadNotice(NoticeRequestDto.builder()
                .content(output)
                .startTime(imageRequestDto.getStartTime())
                .endTime(imageRequestDto.getEndTime())
                .build());
        //안내 내용 저장
        if(imageRequestDto.getContent() != null) {
            uploadNotice(NoticeRequestDto.builder()
                    .content(imageRequestDto.getContent())
                    .startTime(imageRequestDto.getStartTime())
                    .endTime(imageRequestDto.getEndTime())
                    .build());
        }
        return new CommonResponseDto("교사 요청 사진 업로드 완");
    }

    public String S3Imageupload(MultipartFile image) {
        return s3ImageService.upload(image, "gptnotice");

    }
    public String convertImageToText(String imageUrl){
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiKey);
        headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);

        JSONObject requestBody = new JSONObject()
                .put("model", model)
                .put("messages", generateMessage(imageUrl))
                .put("temperature", 0.3F)
                .put("max_tokens",10000)
                .put("top_p", 0.15F)
                .put("frequency_penalty",0.2F)
                .put("presence_penalty",0.1F);

        HttpEntity<String> requestEntity = new HttpEntity<>(requestBody.toString(), headers);
        RestTemplate restTemplate1 = new RestTemplate();
        ResponseEntity<String> responseEntity = restTemplate1.exchange(apiUrl, HttpMethod.POST, requestEntity, String.class);

        if (responseEntity.getStatusCode() == HttpStatus.OK) {
            JSONObject responseJson = new JSONObject(responseEntity.getBody());
            JSONArray choices = responseJson.getJSONArray("choices");
            if (!choices.isEmpty()) {
                return choices.getJSONObject(0).getJSONObject("message").getString("content");
            } else {
                throw new CustomException(ErrorCode.GPTError);
            }
        } else {
            throw new CustomException(ErrorCode.GPTError);
        }
    }

    private static JSONArray generateMessage(String imageUrl) {
        JSONArray messages = new JSONArray();

        JSONObject message1 = new JSONObject()
                .put("role", "system")
                .put("content", new JSONArray()
                        .put(new JSONObject()
                                .put("type", "text")
                                .put("text", imageUploadPrompt))
                );
        JSONObject message2 = new JSONObject()
                .put("role", "user")
                .put("content", new JSONArray()
                        .put(new JSONObject()
                                .put("type", "image_url")
                                .put("image_url", new JSONObject()
                                        .put("url", imageUrl)))
                );

        messages.put(message1);
        messages.put(message2);
        return messages;
    }
}