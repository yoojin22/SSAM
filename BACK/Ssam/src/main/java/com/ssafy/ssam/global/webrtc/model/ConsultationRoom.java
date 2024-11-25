//package com.ssafy.ssam.global.webrtc.model;
//
//import java.io.IOException;
//import java.util.ArrayList;
//import java.util.List;
//import java.util.concurrent.ConcurrentHashMap;
//
//import org.kurento.client.KurentoClient;
//import org.kurento.client.MediaPipeline;
//import org.kurento.client.RecorderEndpoint;
//import org.springframework.web.socket.WebSocketSession;
//
////import com.google.cloud.speech.v1.*;
////import io.grpc.stub.StreamObserver;
//
//public class ConsultationRoom {
//    private final String roomName;
//    private final MediaPipeline pipeline;
//    private final ConcurrentHashMap<String, UserSession> participants = new ConcurrentHashMap<>();
//    private RecorderEndpoint recorder;
//    //private final SpeechClient speechClient;
//    private final List<String> profanityList; // 욕설 목록
//
//    public ConsultationRoom(String roomName, KurentoClient kurentoClient) throws IOException {
//        this.roomName = roomName;
//        this.pipeline = kurentoClient.createMediaPipeline();
//        //this.speechClient = SpeechClient.create();
//        this.profanityList = loadProfanityList(); // 욕설 목록 로드
//    }
//
//    public synchronized boolean join(String userName, WebSocketSession session) throws IOException {
//        if (participants.size() >= 2) {
//            return false; // 이미 2명이 참여 중이면 거부
//        }
//
//        UserSession participant = new UserSession(userName, session, this.pipeline);
//        participants.put(userName, participant);
//
//        if (participants.size() == 2) {
//            startRecordingAndSTT();
//        }
//
//        return true;
//    }
//
//    private void startRecordingAndSTT() throws IOException {
//        // 녹화 시작
//        String recordingPath = "file:///path/to/recordings/" + roomName + ".webm";
//        recorder = new RecorderEndpoint.Builder(pipeline, recordingPath).build();
//
//        for (UserSession participant : participants.values()) {
//            participant.getOutgoingWebRtcPeer().connect(recorder);
//        }
//        recorder.record();
//
//
//        /*
//        // STT 시작
//        StreamObserver<StreamingRecognizeResponse> responseObserver = new StreamObserver<StreamingRecognizeResponse>() {
//            @Override
//            public void onNext(StreamingRecognizeResponse response) {
//                StreamingRecognitionResult result = response.getResultsList().get(0);
//                String transcript = result.getAlternativesList().get(0).getTranscript();
//                checkForProfanity(transcript);
//            }
//
//            @Override
//            public void onError(Throwable t) {
//                System.err.println("Error in STT: " + t.getMessage());
//            }
//
//            @Override
//            public void onCompleted() {
//                System.out.println("STT completed");
//            }
//        };
//
//        StreamingRecognitionConfig config = StreamingRecognitionConfig.newBuilder()
//                .setConfig(RecognitionConfig.newBuilder()
//                        .setEncoding(RecognitionConfig.AudioEncoding.LINEAR16)
//                        .setLanguageCode("ko-KR")
//                        .setSampleRateHertz(16000)
//                        .build())
//                .setInterimResults(true)
//                .build();
//
//        StreamObserver<StreamingRecognizeRequest> requestObserver = speechClient.streamingRecognizeCallable().bidiStreamingCall(responseObserver);
//
//        // Audio 스트림을 STT 서비스로 전송하는 로직 구현 필요
//        // 이 부분은 Kurento의 AudioPort를 사용하여 구현할 수 있습니다.
//        */
//    }
//
//    private void checkForProfanity(String transcript) {
//        String[] words = transcript.split("\\s+");
//        for (String word : words) {
//            if (profanityList.contains(word.toLowerCase())) {
//                sendWarningMessage("욕설이 감지되었습니다: " + word);
//                break;
//            }
//        }
//    }
//
//    private void sendWarningMessage(String message) {
//        for (UserSession participant : participants.values()) {
//            try {
//                participant.sendMessage(message);
//            } catch (IOException e) {
//                System.err.println("Failed to send warning message: " + e.getMessage());
//            }
//        }
//    }
//
//    public synchronized void leave(String userName) throws IOException {
//        UserSession leavingParticipant = participants.remove(userName);
//        if (leavingParticipant != null) {
//            leavingParticipant.close();
//        }
//
//        if (participants.isEmpty()) {
//            closeRoom();
//        }
//    }
//
//    public void closeRoom() {
//        if (recorder != null) {
//            recorder.stop();
//            recorder.release();
//        }
//        pipeline.release();
//        //speechClient.close();
//    }
//
//    private List<String> loadProfanityList() {
//        // 실제 구현에서는 파일이나 데이터베이스에서 욕설 목록을 로드합니다.
//        List<String> profanity = new ArrayList<>();
//        profanity.add("바보");
//        profanity.add("멍청이");
//        // ... 더 많은 욕설 추가
//        return profanity;
//    }
//}