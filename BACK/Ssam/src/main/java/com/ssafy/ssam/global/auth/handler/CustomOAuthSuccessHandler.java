package com.ssafy.ssam.global.auth.handler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.ssam.global.auth.dto.CustomUserDetails;
import com.ssafy.ssam.global.auth.entity.OAuthUser;
import com.ssafy.ssam.global.auth.entity.User;
import com.ssafy.ssam.global.auth.jwt.JwtUtil;
import com.ssafy.ssam.global.auth.repository.OAuthUserRepository;
import com.ssafy.ssam.global.auth.repository.UserRepository;
import com.ssafy.ssam.global.error.CustomException;
import com.ssafy.ssam.global.error.ErrorCode;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.hibernate.CustomEntityDirtinessStrategy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@RequiredArgsConstructor
@Component
public class CustomOAuthSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final OAuthUserRepository oAuthUserRepository;
    private final HttpSession httpSession;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        // 유저의 social login 정보를 가져옴
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String providerId = oAuth2User.getAttribute("sub");
        String provider = ((OAuth2AuthenticationToken) authentication).getAuthorizedClientRegistrationId();

        // 기존의 OAuthUser 엔티티가 있는지 검색
        OAuthUser linkedOAuthUser = oAuthUserRepository.findByProviderAndProviderId(provider, providerId)
                .orElse(null);

        // 있다면 로그인 시작
        if (linkedOAuthUser != null) {
            User user = linkedOAuthUser.getUser();
            loginUser(response, user);
        }

    }

    private void loginUser(HttpServletResponse response, User user) throws IOException {
        // 로그인 구현. 토큰을 queryparameter에 보냄
        String token = jwtUtil.createJwt(user.getUsername(), user.getRole().name(), user.getUserId(), null, 3600000L);
        String redirectUrl = UriComponentsBuilder.fromUriString("https://i11e201.p.ssafy.io/auth/oauth-response/" + token)
                .build().toUriString();
        response.sendRedirect(redirectUrl);
    }
}
