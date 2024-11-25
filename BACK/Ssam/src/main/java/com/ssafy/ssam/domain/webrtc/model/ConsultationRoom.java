//package com.ssafy.ssam.domain.webrtc.model;
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
//import com.google.gson.JsonArray;
//import com.google.gson.JsonObject;
//
//public class ConsultationRoom {
//    private final String roomName;
//    private final MediaPipeline pipeline;
//    private final ConcurrentHashMap<String, UserSession> participants = new ConcurrentHashMap<>();
//    private RecorderEndpoint recorder;
//    private final List<String> profanityList;
//
//    public ConsultationRoom(String roomName, KurentoClient kurentoClient) throws IOException {
//        this.roomName = roomName;
//        this.pipeline = kurentoClient.createMediaPipeline();
//        this.profanityList = loadProfanityList();
//    }
//
//    public synchronized boolean join(String userName, WebSocketSession session) throws IOException {
//        if (participants.size() >= 2) {
//            return false;
//        }
//
//        UserSession participant = new UserSession(userName, session, this.pipeline, this);
//        participants.put(userName, participant);
//
//        if (participants.size() == 2) {
//            startRecordingAndSTT();
//        }
//
//        return true;
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
//    }
//
//    public UserSession getParticipant(String userName) {
//        return participants.get(userName);
//    }
//
//    public JsonArray getParticipantsAsJsonArray() {
//        JsonArray participantArray = new JsonArray();
//        for (String userName : participants.keySet()) {
//            participantArray.add(userName);
//        }
//        return participantArray;
//    }
//
//    public UserSession getParticipantBySession(WebSocketSession session) {
//        for (UserSession userSession : participants.values()) {
//            if (userSession.getSession().equals(session)) {
//                return userSession;
//            }
//        }
//        return null;
//    }
//
//    private void startRecordingAndSTT() throws IOException {
//        String recordingPath = "file:///path/to/recordings/" + roomName + ".webm";
//        recorder = new RecorderEndpoint.Builder(pipeline, recordingPath).build();
//        
//        for (UserSession participant : participants.values()) {
//            participant.getOutgoingWebRtcPeer().connect(recorder);
//        }
//        recorder.record();
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
//    private List<String> loadProfanityList() {
//        List<String> profanity = new ArrayList<>();
//        profanity.add("바보");
//        profanity.add("멍청이");
//        // 더 많은 욕설 추가 가능
//        return profanity;
//    }
//
//    public String getRoomName() {
//        return roomName;
//    }
//
//    public MediaPipeline getPipeline() {
//        return pipeline;
//    }
//}