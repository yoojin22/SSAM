//package com.ssafy.ssam.domain.openvidu.controller;
//
//import java.util.List;
//
//import com.ssafy.ssam.domain.openvidu.service.SessionService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.DeleteMapping;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import com.ssafy.ssam.domain.openvidu.dto.OpenViduSessionDto;
//import com.ssafy.ssam.domain.openvidu.dto.RecordingDto;
//import com.ssafy.ssam.domain.openvidu.dto.RecordingRequestDto;
//import com.ssafy.ssam.global.dto.CommonResponseDto;
//
//// openvidu-recoding-java 백엔드 코드 기반
//// 수정 사항
//// getToken
////     - 매개변수 변경 (세션 ID => {세션 ID, 유저 이름})
////     - 유저 정보 표시 중복 제거 (json 형식 파괴됨)
////         - 수정 전 {"clientData": "유저 이름"}%/%user_data
////         - 수정 후 {"clientData": "유저 이름"}
//
//
//@RequiredArgsConstructor
//@RestController
//@RequestMapping("/v1/video")
//public class SessionController_1 {
//
//	/* openVidu: OpenVidu object as entrypoint of the SDK
//	 * mapSessions: Collection to pair session names and OpenVidu Session objects
//	 * mapSessionNamesTokens: Collection to pair session names and tokens (the inner Map pairs tokens and role associated)
//	 * sessionRecordings: Collection to pair session names and recording objects
//	 * OPENVIDU_URL: URL where our OpenVidu server is listening
//	 * SECRET: Secret shared with our OpenVidu server
//	 */
//
//
//    private final SessionService sessionService;
//
//    @PostMapping("/token")
//    public ResponseEntity<OpenViduSessionDto> getToken(@RequestBody OpenViduSessionDto requestDto) {
//        return ResponseEntity.ok(sessionService.getToken(requestDto));
//    }
//
//    @DeleteMapping("/token")
//    public ResponseEntity<CommonResponseDto> deleteToken(@RequestBody OpenViduSessionDto requestDto) {
//        return ResponseEntity.ok(sessionService.deleteToken(requestDto));
//    }
//
//    @DeleteMapping("/session")
//    public ResponseEntity<CommonResponseDto> deleteSession(@RequestBody OpenViduSessionDto requestDto) {
//        return ResponseEntity.ok(sessionService.deleteSession(requestDto));
//    }
//
//    @PostMapping("/info")
//    public ResponseEntity<OpenViduSessionDto> fetchInfo(@RequestBody OpenViduSessionDto requestDto) {
//        return ResponseEntity.ok(sessionService.fetchInfo(requestDto));
//    }
//
//    @GetMapping("/info")
//    public ResponseEntity<List<OpenViduSessionDto>> fetchAll() {
//        return ResponseEntity.ok(sessionService.fetchAll());
//    }
//
//    @DeleteMapping("/force-disconnect")
//    public ResponseEntity<CommonResponseDto> forceDisconnect(@RequestBody OpenViduSessionDto requestDto) {
//        return ResponseEntity.ok(sessionService.forceDisconnect(requestDto));
//    }
//
//    @DeleteMapping("/force-unpublish")
//    public ResponseEntity<CommonResponseDto> forceUnpublish(@RequestBody OpenViduSessionDto requestDto) {
//        return ResponseEntity.ok(sessionService.forceUnpublish(requestDto));
//    }
//
//    @PostMapping("/recording/start")
//    public ResponseEntity<RecordingDto> startRecording(@RequestBody RecordingRequestDto requestDto) {
//        return ResponseEntity.ok(sessionService.startRecording(requestDto));
//    }
//
//    @PostMapping("/recording/stop")
//    public ResponseEntity<RecordingDto> stopRecording(@RequestBody RecordingRequestDto requestDto) {
//        return ResponseEntity.ok(sessionService.stopRecording(requestDto));
//    }
//
//    @DeleteMapping("/recording")
//    public ResponseEntity<CommonResponseDto> deleteRecording(@RequestBody RecordingRequestDto requestDto) {
//        return ResponseEntity.ok(sessionService.deleteRecording(requestDto));
//    }
//
//    @GetMapping("/recording/{recordingId}")
//    public ResponseEntity<RecordingDto> getRecording(@PathVariable String recordingId) {
//        return ResponseEntity.ok(sessionService.getRecording(recordingId));
//    }
//
//    @GetMapping("/recording")
//    public ResponseEntity<List<RecordingDto>> listRecordings() {
//        return ResponseEntity.ok(sessionService.listRecordings());
//    }
//
//
//
//}
