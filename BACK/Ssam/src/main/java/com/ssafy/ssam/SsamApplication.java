package com.ssafy.ssam;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class SsamApplication {

    public static void main(String[] args) {
        System.out.println("start");
        SpringApplication.run(SsamApplication.class, args);
    }

}
