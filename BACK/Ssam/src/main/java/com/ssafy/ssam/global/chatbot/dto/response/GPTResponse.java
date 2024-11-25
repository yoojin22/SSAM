package com.ssafy.ssam.global.chatbot.dto.response;

import com.ssafy.ssam.global.chatbot.dto.Message;
import lombok.*;

import java.util.List;

@RequiredArgsConstructor
@Setter
@Getter
@Builder
@AllArgsConstructor
public class GPTResponse {

    private List<Choice> choices;

    @RequiredArgsConstructor
    @Setter
    @Getter
    @Builder
    @AllArgsConstructor
    public static class Choice {
        //gpt 대화 인덱스 번호
        private int index;
        // 지피티로 부터 받은 메세지
        // 여기서 content는 유저의   아닌 gpt로부터 받은 response
        private Message message;

    }

}