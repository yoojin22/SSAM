//package com.ssafy.ssam.domain.webrtc.model;
//
//import java.io.Closeable;
//import java.io.IOException;
//
//import org.kurento.client.IceCandidate;
//import org.kurento.client.MediaPipeline;
//import org.kurento.client.WebRtcEndpoint;
//import org.kurento.jsonrpc.JsonUtils;
//import org.springframework.web.socket.TextMessage;
//import org.springframework.web.socket.WebSocketSession;
//
//import com.google.gson.JsonObject;
//
//public class UserSession implements Closeable {
//    private final String name;
//    private final WebSocketSession session;
//    
//    private final MediaPipeline pipeline;
//    private final WebRtcEndpoint outgoingMedia;
//    private final ConsultationRoom room;
//    private final WebRtcEndpoint incomingMedia;
//
//    public UserSession(String name, WebSocketSession session, MediaPipeline pipeline, ConsultationRoom room) {
//        this.name = name;
//        this.session = session;
//        this.pipeline = pipeline;
//        this.room = room;
//        
//        this.outgoingMedia = new WebRtcEndpoint.Builder(pipeline).build();
//        this.incomingMedia = new WebRtcEndpoint.Builder(pipeline).build();
//
//        this.outgoingMedia.addIceCandidateFoundListener(event -> {
//            JsonObject response = new JsonObject();
//            response.addProperty("id", "iceCandidate");
//            response.addProperty("name", name);
//            response.add("candidate", JsonUtils.toJsonObject(event.getCandidate()));
//            try {
//                synchronized (session) {
//                    session.sendMessage(new TextMessage(response.toString()));
//                }
//            } catch (IOException e) {
//                System.err.println("Error sending ICE candidate: " + e.getMessage());
//            }
//        });
//    }
//
//    public String getName() {
//        return name;
//    }
//
//    public WebSocketSession getSession() {
//        return session;
//    }
//
//    public WebRtcEndpoint getOutgoingWebRtcPeer() {
//        return outgoingMedia;
//    }
//
//    public WebRtcEndpoint getIncomingWebRtcPeer() {
//        return incomingMedia;
//    }
//
//    public ConsultationRoom getRoom() {
//        return room;
//    }
//
//    public String receiveVideoFrom(UserSession sender, String sdpOffer) throws IOException {
//        System.out.println("USER " + this.name + ": connecting with " + sender.getName());
//
//        String ipSdpAnswer = this.getIncomingWebRtcPeer().processOffer(sdpOffer);
//        
//        this.getIncomingWebRtcPeer().gatherCandidates();
//        sender.getOutgoingWebRtcPeer().connect(this.getIncomingWebRtcPeer());
//
//        return ipSdpAnswer;
//    }
//
//    public void sendMessage(String message) throws IOException {
//        synchronized (session) {
//            session.sendMessage(new TextMessage(message));
//        }
//    }
//
//    public void addCandidate(IceCandidate candidate) {
//        this.incomingMedia.addIceCandidate(candidate);
//    }
//
//    @Override
//    public void close() throws IOException {
//        System.out.println("PARTICIPANT " + name + ": Releasing resources");
//        if (this.outgoingMedia != null) {
//            this.outgoingMedia.release();
//        }
//        if (this.incomingMedia != null) {
//            this.incomingMedia.release();
//        }
//    }
//
//    public JsonObject toJson() {
//        JsonObject result = new JsonObject();
//        result.addProperty("name", this.name);
//        return result;
//    }
//}