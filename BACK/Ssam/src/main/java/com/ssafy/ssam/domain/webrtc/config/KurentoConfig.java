//package com.ssafy.ssam.domain.webrtc.config;
//
//import org.kurento.client.KurentoClient;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.socket.config.annotation.EnableWebSocket;
//import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
//import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
//import org.springframework.web.socket.server.standard.ServletServerContainerFactoryBean;
//import com.ssafy.ssam.domain.webrtc.controller.ConsultationController;
//import java.net.URLEncoder;
//import java.nio.charset.StandardCharsets;
//
//@Configuration
//@EnableWebSocket
//public class KurentoConfig implements WebSocketConfigurer {
//
//    @Value("${kurento.client.url:wss://i11e201.p.ssafy.io/kurento}")
//    private String kurentoUrl;
//
//    @Value("${stun.server.url:stun:stun.l.google.com:19302}")
//    private String stunServerUrl;
//
//    @Value("${turn.server.url:i11e201.p.ssafy.io:3478}")
//    private String turnServerUrl;
//
//    @Value("${turn.server.username:admin}")
//    private String turnServerUsername;
//
//    @Value("${turn.server.credential:JddU_RuEn5Iqc}")
//    private String turnServerCredential;
//
//    @Bean
//    public KurentoClient kurentoClient() {
//        String encodedIceServers = URLEncoder.encode(
//            "[{\"urls\":\"" + stunServerUrl + "\"}," +
//            "{\"urls\":\"" + turnServerUrl + "\"," +
//            "\"username\":\"" + turnServerUsername + "\"," +
//            "\"credential\":\"" + turnServerCredential + "\"}]",
//            StandardCharsets.UTF_8
//        );
//        
//        String kurentoUrlWithIceServers = kurentoUrl + "?iceServers=" + encodedIceServers;
//        return KurentoClient.create(kurentoUrlWithIceServers);
//    }
//
//    @Bean
//    public ConsultationController consultationController() {
//        return new ConsultationController();
//    }
//
//    @Bean
//    public ServletServerContainerFactoryBean createWebSocketContainer() {
//        ServletServerContainerFactoryBean container = new ServletServerContainerFactoryBean();
//        container.setMaxTextMessageBufferSize(32768);
//        container.setMaxBinaryMessageBufferSize(32768);
//        return container;
//    }
//
//    @Override
//    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
//        registry.addHandler(consultationController(), "/v1/kurento")
//                .setAllowedOrigins("http://localhost:5173", "https://i11e201.p.ssafy.io");
//    }
//}