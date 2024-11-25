//package com.ssafy.ssam.domain.openvidu.service;
//
//import com.ssafy.ssam.domain.consult.service.ConsultService;
//import com.ssafy.ssam.domain.openvidu.OpenViduProperties;
//import com.ssafy.ssam.domain.openvidu.dto.OpenViduSessionDto;
//import com.ssafy.ssam.domain.openvidu.dto.RecordingDto;
//import com.ssafy.ssam.domain.openvidu.dto.RecordingRequestDto;
//import com.ssafy.ssam.global.dto.CommonResponseDto;
//import com.ssafy.ssam.global.error.CustomException;
//import com.ssafy.ssam.global.error.ErrorCode;
//import io.openvidu.java.client.*;
//import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.RequiredArgsConstructor;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.core.annotation.Order;
//import org.springframework.http.ResponseEntity;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//import org.springframework.web.bind.annotation.RequestBody;
//
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//import java.util.concurrent.ConcurrentHashMap;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//public class SessionService {
//    private final ConsultService consultService;
//    private final OpenViduProperties openViduProperties;
////    @Value("${openvidu.secret:JddU_RuEn5Iqc}")
////    private String openviduUrl;
////    @Value("${openvidu.url:https://i11e201.p.ssafy.io:8443/}")
////    private String secret;
//
//    public OpenVidu openVidu = new OpenVidu(openViduProperties.getOpenviduUrl(), openViduProperties.getSecret());
//
//    public Map<String, Session> mapSessions = new ConcurrentHashMap<>();
//    public Map<String, Map<String, OpenViduSessionDto>> sessionUserMapping = new ConcurrentHashMap<>();
//    public Map<String, Boolean> sessionRecordings = new ConcurrentHashMap<>();
//
//    public OpenViduSessionDto getToken(OpenViduSessionDto requestDto){
//        String accessCode = requestDto.getAccessCode();
//        String userId = requestDto.getUserId();
//
//        // AccessCode로 Consult 엔티티 조회
////        Optional<Consult> consults = consultRepository.findByAccessCode(accessCode);
////
////        if (consults.isEmpty()) {
////        	System.out.println("OMG NOT FOUND!!!!");
////            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
////        }
//
//        String serverData = "{\"userId\":\"" + userId + "\"}";
//        ConnectionProperties connectionProperties = new ConnectionProperties.Builder()
//                .type(ConnectionType.WEBRTC)
//                .role(OpenViduRole.PUBLISHER)
//                .data(serverData)
//                .build();
//
//        try {
//            Session session = mapSessions.computeIfAbsent(accessCode, k -> {
//                try {
//                    return openVidu.createSession();
//                } catch (Exception e) {
//                    throw new RuntimeException("Error creating session", e);
//                }
//            });
//            Connection c = session.createConnection(connectionProperties);
//            System.out.println("SESSION ID::::: " + session.getSessionId());
//            OpenViduSessionDto responseDto = OpenViduSessionDto.builder()
//                    .userId(userId)
//                    .accessCode(accessCode)
//                    .sessionId(session.getSessionId())
//                    .token(c.getToken())
//                    .connectionId(c.getConnectionId())
//                    .createdAt(c.createdAt())
//                    .serverData(serverData)
//                    .build();
//
//            sessionUserMapping.computeIfAbsent(accessCode, k -> new ConcurrentHashMap<>()).put(userId, responseDto);
//
//            consultService.startConsult(accessCode, session.getSessionId());
//
//            return responseDto;
//        } catch (Exception e) {
//            throw new CustomException(ErrorCode.SessionError);
//        }
//    }
//    public CommonResponseDto deleteToken(OpenViduSessionDto requestDto){
//        String accessCode = requestDto.getAccessCode();
//        String userId = requestDto.getUserId();
//
//        Map<String, OpenViduSessionDto> sessionUsers = sessionUserMapping.getOrDefault(accessCode, new HashMap<>());
//        if (sessionUsers != null) {
//            sessionUsers.remove(userId);
//            if (sessionUsers.isEmpty()) {
//                mapSessions.remove(accessCode);
//                sessionUserMapping.remove(accessCode);
//            }
//        }
//        consultService.endConsult(requestDto.getSessionId());
//
//        return new CommonResponseDto("Token successfully deleted");
//    }
//
//    public CommonResponseDto deleteSession (OpenViduSessionDto requestDto){
//        try {
//            String accessCode = requestDto.getAccessCode();
//            Session session = mapSessions.remove(requestDto.getAccessCode());
//            session.close();
//            sessionUserMapping.remove(accessCode);
//            sessionRecordings.remove(accessCode);
//            return new CommonResponseDto("Session successfully closed and removed");
//        } catch (Exception e) {
//            throw new CustomException(ErrorCode.SessionError);
//        }
//    }
//
//    public OpenViduSessionDto fetchInfo(OpenViduSessionDto requestDto){
//        try {
//            Session session = mapSessions.get(requestDto.getAccessCode());
//            session.fetch();
//            return OpenViduSessionDto.convertSessionToDto(session);
//        } catch (Exception e) {
//            throw new CustomException(ErrorCode.FetchError);
//        }
//    }
//
//    public List<OpenViduSessionDto> fetchAll() {
//        try { openVidu.fetch();}
//        catch (Exception e){ throw new CustomException(ErrorCode.FetchError); }
//        return openVidu.getActiveSessions().stream()
//                .map(OpenViduSessionDto::convertSessionToDto)
//                .collect(Collectors.toList());
//    }
//
//    public RecordingDto startRecording(@RequestBody RecordingRequestDto requestDto) {
//        try {
//            System.out.println("START RECORDING AT SESSION ID ::: " + requestDto.getSessionId());
//            RecordingProperties properties = new RecordingProperties.Builder()
//                    .outputMode(requestDto.getOutputMode())
//                    .hasAudio(requestDto.isHasAudio())
//                    .hasVideo(false)
//                    .build();
//
//            Recording recording = this.openVidu.startRecording(requestDto.getSessionId(), properties);
//            this.sessionRecordings.put(requestDto.getSessionId(), true);
//            return RecordingDto.convertRecordingToDto(recording);
//        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
//            throw new CustomException(ErrorCode.RecordError);
//        }
//    }
//
//    public CommonResponseDto forceDisconnect(OpenViduSessionDto requestDto) {
//        try {Session session = mapSessions.get(requestDto.getSessionId());
//            session.forceDisconnect(requestDto.getConnectionId());
//            return new CommonResponseDto("Connection forcefully disconnected");
//        } catch (Exception e) {
//            throw new CustomException(ErrorCode.SessionError);
//        }
//    }
//
//    public CommonResponseDto forceUnpublish(OpenViduSessionDto requestDto) {
//        try {
//            Session session = mapSessions.get(requestDto.getSessionId());
//            session.forceUnpublish(requestDto.getStreamId());
//            return new CommonResponseDto("Stream forcefully unpublished");
//        } catch (Exception e) {
//            throw new CustomException(ErrorCode.SessionError);
//        }
//    }
//
//    public RecordingDto stopRecording(RecordingRequestDto requestDto) {
//        try {
//            System.out.println("STOP RECORDING AT SESSION ID ::: " + requestDto.getSessionId());
//            Recording recording = this.openVidu.stopRecording(requestDto.getSessionId());
//            this.sessionRecordings.remove(requestDto.getSessionId());
//            return RecordingDto.convertRecordingToDto(recording);
//        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
//            throw new CustomException(ErrorCode.RecordError);
//        }
//    }
//
//    public CommonResponseDto deleteRecording(RecordingRequestDto requestDto) {
//        try {
//            this.openVidu.deleteRecording(requestDto.getSessionId());
//            return new CommonResponseDto("Recording deleted");
//        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
//            throw new CustomException(ErrorCode.RecordError);
//        }
//    }
//    public RecordingDto getRecording(String recordingId) {
//        try {
//            Recording recording = this.openVidu.getRecording(recordingId);
//            return RecordingDto.convertRecordingToDto(recording);
//        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
//            throw new CustomException(ErrorCode.RecordError);
//        }
//    }
//    public List<RecordingDto> listRecordings () {
//        try {
//            List<Recording> recordings = this.openVidu.listRecordings();
//            return recordings.stream()
//                    .map(RecordingDto::convertRecordingToDto)
//                    .collect(Collectors.toList());
//        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
//            throw new CustomException(ErrorCode.RecordError);
//        }
//    }
//}
