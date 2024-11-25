package com.ssafy.ssam.domain.openvidu.dto;

import java.time.LocalDateTime;

import io.openvidu.java.client.Session;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OpenViduSessionDto {
	private String accessCode;
	private String webrtcSessionId;
    private String sessionId;
    private String userId;
    private String token;
    private String connectionId;
    private String streamId;
    private String clientData;
    private String serverData;
    private Long createdAt;
    private String customSessionId;
    private boolean recording;
    private String mediaMode;
    private String recordingMode;

    public static OpenViduSessionDto convertSessionToDto(Session session) {
        return OpenViduSessionDto.builder()
                .sessionId(session.getSessionId())
                .createdAt(session.createdAt())
                .customSessionId(session.getProperties().customSessionId())
                .recording(session.isBeingRecorded())
                .mediaMode(session.getProperties().mediaMode().name())
                .recordingMode(session.getProperties().recordingMode().name())
                .build();
    }
}
