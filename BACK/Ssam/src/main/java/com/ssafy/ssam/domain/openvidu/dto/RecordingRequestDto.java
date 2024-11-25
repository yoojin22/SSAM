package com.ssafy.ssam.domain.openvidu.dto;

import io.openvidu.java.client.Recording;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecordingRequestDto {
	private String userId;
    private String sessionId;
    private Recording.OutputMode outputMode;
    private boolean hasAudio;
    private boolean hasVideo;

    // Getters and setters
}
