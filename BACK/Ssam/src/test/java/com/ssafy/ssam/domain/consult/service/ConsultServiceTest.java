package com.ssafy.ssam.domain.consult.service;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.mock.http.server.reactive.MockServerHttpRequest.post;
@SpringBootTest
@AutoConfigureMockMvc
public class ConsultServiceTest {
    @Autowired
    MockMvc mockMvc;
    ObjectMapper mapper = new ObjectMapper();

//    void test_consult_teacher() throws Exception {
//    String id = "username_teacher";
//    String password = "password";
//    mockMvc.perform(post("/login")
//
//            .content(ObjectMapper)
//    )
}