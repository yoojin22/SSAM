package com.ssafy.ssam.global.auth.jwt;

import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    private SecretKey secertKey;

    public JwtUtil(@Value("${spring.jwt.secret}") String secret){
        this.secertKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), Jwts.SIG.HS256.key().build().getAlgorithm());
    }
    //1
    public String getUsername(String token){
        return Jwts.parser().verifyWith(secertKey).build().parseSignedClaims(token).getPayload().get("username", String.class);
    }//1
    public Integer getUserId(String token){
        return Jwts.parser().verifyWith(secertKey).build().parseSignedClaims(token).getPayload().get("userId", Integer.class);
    }
    //2
    public String getRole(String token){
        return Jwts.parser().verifyWith(secertKey).build().parseSignedClaims(token).getPayload().get("role", String.class);
    }    //
    public Integer getBoardId(String token){
        return Jwts.parser().verifyWith(secertKey).build().parseSignedClaims(token).getPayload().get("boardId", Integer.class);
    }
    //3
    public Boolean isExpired(String token){
        return Jwts.parser().verifyWith(secertKey).build().parseSignedClaims(token).getPayload().getExpiration().before(new Date());
    }

    // 1 2 3 토큰의 특정요소 검증

    //4
    public String createJwt(String username, String role, Integer userId, Integer boardId, Long expireMs){
        return Jwts.builder()
                .claim("username", username)
                .claim("role", role)
                .claim("userId", userId)
                .claim("boardId", boardId)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis()+expireMs))
                .signWith(secertKey)
                .compact();
    }
    // 이름, 역할, 발행시간, 종료시간, 암호화키, 를 압축하겠다
}
