//package com.ssafy.ssam.domain.webrtc.controller;
//
//import java.io.IOException;
//import java.util.Map;
//import java.util.concurrent.ConcurrentHashMap;
//
//import org.kurento.client.IceCandidate;
//import org.kurento.client.KurentoClient;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.web.bind.annotation.DeleteMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//import org.springframework.web.socket.CloseStatus;
//import org.springframework.web.socket.TextMessage;
//import org.springframework.web.socket.WebSocketSession;
//import org.springframework.web.socket.config.annotation.EnableWebSocket;
//import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
//import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
//import org.springframework.web.socket.handler.TextWebSocketHandler;
//
//import com.google.gson.JsonObject;
//import com.google.gson.JsonParser;
//import com.ssafy.ssam.domain.webrtc.dto.RoomRequest;
//import com.ssafy.ssam.domain.webrtc.model.ConsultationRoom;
//import com.ssafy.ssam.domain.webrtc.model.UserSession;
//
//@CrossOrigin(origins = {"http://localhost:3000", "https://i11e201.p.ssafy.io"}, allowedHeaders = "*", allowCredentials = "true")
//@RestController
//@RequestMapping("/v1/kurento")
//@EnableWebSocket
//public class ConsultationController extends TextWebSocketHandler implements WebSocketConfigurer {
//
//    @Autowired
//    private KurentoClient kurentoClient;
//
//    private final ConcurrentHashMap<String, ConsultationRoom> consultationRooms = new ConcurrentHashMap<>();
//    private final Map<String, Map<String, WebSocketSession>> rooms = new ConcurrentHashMap<>();
//
//    @PostMapping("/room")
//    public ResponseEntity<String> createRoom(@RequestBody RoomRequest roomRequest) {
//        System.out.println("createRoom Function Called");
//        String roomName = roomRequest.getRoomName();
//        if (consultationRooms.containsKey(roomName)) {
//            return ResponseEntity.badRequest().body("Room already exists");
//        }
//        try {
//            ConsultationRoom room = new ConsultationRoom(roomName, kurentoClient);
//            consultationRooms.put(roomName, room);
//            return ResponseEntity.ok("Room created: " + roomName);
//        } catch (IOException e) {
//            return ResponseEntity.internalServerError().body("Failed to create room: " + e.getMessage());
//        }
//    }
//
//    @Override
//    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
//        registry.addHandler(this, "/v1/kurento")
//                .setAllowedOrigins("http://localhost:3000", "https://i11e201.p.ssafy.io");
//    }
//
//    @DeleteMapping("/room/{roomName}")
//    public ResponseEntity<String> closeRoom(@PathVariable String roomName) {
//        ConsultationRoom room = consultationRooms.remove(roomName);
//        if (room == null) {
//            return ResponseEntity.notFound().build();
//        }
//        try {
//            room.closeRoom();
//            return ResponseEntity.ok("Room closed: " + roomName);
//        } catch (Exception e) {
//            return ResponseEntity.internalServerError().body("Failed to close room: " + e.getMessage());
//        }
//    }
//
//    @Override
//    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
//        JsonObject response = new JsonObject();
//        response.addProperty("id", "connectionEstablished");
//        response.addProperty("message", "WebSocket connection established successfully");
//        sendMessage(session, response.toString());
//        
//        System.out.println("New WebSocket connection established: " + session.getId());
//    }
//
//    @Override
//    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
//        String payload = message.getPayload();
//        JsonObject jsonMessage = JsonParser.parseString(payload).getAsJsonObject();
//
//        String id = jsonMessage.get("id").getAsString();
//        JsonObject params = jsonMessage.has("params") ? jsonMessage.getAsJsonObject("params") : jsonMessage;
//
//        switch (id) {
//            case "joinRoom":
//                joinRoom(params, session);
//                break;
//            case "receiveVideoFrom":
//                receiveVideoFrom(params, session);
//                break;
//            case "leaveRoom":
//                leaveRoom(params, session);
//                break;
//            case "onIceCandidate":
//                handleIceCandidate(params, session);
//                break;
//            case "chatMessage":
//                handleChatMessage(params, session);
//                break;
//            default:
//                handleError(session, "Invalid message with id " + id);
//                break;
//        }
//    }
//
//    private void joinRoom(JsonObject params, WebSocketSession session) throws IOException {
//        String roomName = params.get("room").getAsString();
//        String userName = params.get("name").getAsString();
//
//        ConsultationRoom room = consultationRooms.get(roomName);
//        if (room == null) {
//            handleError(session, "Room " + roomName + " does not exist");
//            return;
//        }
//
//        if (room.join(userName, session)) {
//            rooms.putIfAbsent(roomName, new ConcurrentHashMap<>());
//            rooms.get(roomName).put(session.getId(), session);
//
//            // 기존 참가자 목록 전송
//            JsonObject existingParticipants = new JsonObject();
//            existingParticipants.addProperty("id", "existingParticipants");
//            existingParticipants.add("data", room.getParticipantsAsJsonArray());
//            sendMessage(session, existingParticipants.toString());
//
//            // 새 참가자 알림
//            JsonObject newParticipantMsg = new JsonObject();
//            newParticipantMsg.addProperty("id", "newParticipantArrived");
//            newParticipantMsg.addProperty("name", userName);
//            broadcastToRoom(roomName, newParticipantMsg.toString(), session);
//        } else {
//            handleError(session, "Room " + roomName + " is full");
//        }
//    }
//    
//    private void receiveVideoFrom(JsonObject params, WebSocketSession session) throws IOException {
//        String senderName = params.get("sender").getAsString();
//        String receiverName = params.get("receiver").getAsString();
//        String sdpOffer = params.get("sdpOffer").getAsString();
//
//        ConsultationRoom room = getRoomForSession(session);
//        if (room != null) {
//            UserSession receiver = room.getParticipant(receiverName);
//            UserSession sender = room.getParticipant(senderName);
//            String ipSdpAnswer = receiver.receiveVideoFrom(sender, sdpOffer);
//
//            JsonObject response = new JsonObject();
//            response.addProperty("id", "receiveVideoAnswer");
//            response.addProperty("name", senderName);
//            response.addProperty("sdpAnswer", ipSdpAnswer);
//            sendMessage(receiver.getSession(), response.toString());
//        }
//    }
//    
//    private void handleIceCandidate(JsonObject params, WebSocketSession session) throws IOException {
//        String userName = params.get("name").getAsString();
//        String to = params.get("to").getAsString();
//        JsonObject candidate = params.get("candidate").getAsJsonObject();
//
//        ConsultationRoom room = getRoomForSession(session);
//        if (room != null) {
//            UserSession user = room.getParticipant(to);
//            if (user != null) {
//                JsonObject response = new JsonObject();
//                response.addProperty("id", "iceCandidate");
//                response.addProperty("name", userName);
//                response.add("candidate", candidate);
//                sendMessage(user.getSession(), response.toString());
//            }
//        }
//    }
//
//    private void leaveRoom(JsonObject params, WebSocketSession session) throws IOException {
//        String userName = params.get("name").getAsString();
//        ConsultationRoom room = getRoomForSession(session);
//        if (room != null) {
//            room.leave(userName);
//            rooms.get(room.getRoomName()).remove(session.getId());
//
//            // 참가자 퇴장 알림
//            JsonObject participantLeftMsg = new JsonObject();
//            participantLeftMsg.addProperty("id", "participantLeft");
//            participantLeftMsg.addProperty("name", userName);
//            broadcastToRoom(room.getRoomName(), participantLeftMsg.toString(), null);
//        }
//    }
//
//    private void handleChatMessage(JsonObject params, WebSocketSession session) throws IOException {
//        String roomName = params.get("room").getAsString();
//        String userName = params.get("name").getAsString();
//        String chatMessage = params.get("message").getAsString();
//
//        System.out.println("Chat message received from " + userName + " in room " + roomName + ": " + chatMessage);
//
//        JsonObject response = new JsonObject();
//        response.addProperty("jsonrpc", "2.0");
//        response.addProperty("id", "newChatMessage");
//        
//        JsonObject responseParams = new JsonObject();
//        responseParams.addProperty("room", roomName);
//        responseParams.addProperty("user", userName);
//        responseParams.addProperty("message", chatMessage);
//        response.add("params", responseParams);
//
//        String responseMessage = response.toString();
//
//        Map<String, WebSocketSession> roomSessions = rooms.get(roomName);
//        if (roomSessions != null) {
//            for (WebSocketSession clientSession : roomSessions.values()) {
//                if (clientSession.isOpen()) {
//                    sendMessage(clientSession, responseMessage);
//                }
//            }
//        }
//    }
//
//    private void handleError(WebSocketSession session, String message) throws IOException {
//        JsonObject response = new JsonObject();
//        System.out.println("Handle Error!!\n");
//        response.addProperty("id", "error");
//        response.addProperty("message", message);
//        sendMessage(session, response.toString());
//    }
//
//    private void sendMessage(WebSocketSession session, String message) throws IOException {
//        session.sendMessage(new TextMessage(message));
//    }
//
//    private void sendErrorResponse(WebSocketSession session, String errorMessage, String id) throws IOException {
//        JsonObject errorResponse = new JsonObject();
//        errorResponse.addProperty("jsonrpc", "2.0");
//        errorResponse.addProperty("id", id);
//        
//        JsonObject error = new JsonObject();
//        error.addProperty("code", -32600);
//        error.addProperty("message", errorMessage);
//        
//        errorResponse.add("error", error);
//        
//        sendMessage(session, errorResponse.toString());
//    }
//    
//    private void broadcastToRoom(String roomName, String message, WebSocketSession exclude) throws IOException {
//        Map<String, WebSocketSession> roomSessions = rooms.get(roomName);
//        if (roomSessions != null) {
//            for (WebSocketSession clientSession : roomSessions.values()) {
//                if (clientSession.isOpen() && (exclude == null || !clientSession.getId().equals(exclude.getId()))) {
//                    sendMessage(clientSession, message);
//                }
//            }
//        }
//    }
//    
//    private ConsultationRoom getRoomForSession(WebSocketSession session) {
//        for (ConsultationRoom room : consultationRooms.values()) {
//            if (room.getParticipantBySession(session) != null) {
//                return room;
//            }
//        }
//        return null;
//    }
//
//    @Override
//    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
//        for (Map<String, WebSocketSession> room : rooms.values()) {
//            room.remove(session.getId());
//        }
//        System.out.println("WebSocket connection closed: " + session.getId());
//    }
//}