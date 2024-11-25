package com.ssafy.ssam.global.chatbot.config;


import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestTemplate;

@Configuration
public class GPTConfig {

    @Value("${gpt.api.key}")
    private String apiKey;
    @Bean
    public RestTemplate restTemplate(){
        RestTemplate template = new RestTemplate();
        template.getInterceptors().add((request, body, execution) -> {
            request.getHeaders().add(
                    "Authorization"
                    ,"Bearer "+apiKey);
            request.getHeaders().add("Content-Type", "application/json");
            return execution.execute(request,body);
        });

        return template;

    }

}