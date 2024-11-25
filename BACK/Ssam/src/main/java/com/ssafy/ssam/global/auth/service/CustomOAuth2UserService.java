package com.ssafy.ssam.global.auth.service;

import com.ssafy.ssam.global.auth.entity.CustomOAuth2User;
import com.ssafy.ssam.global.auth.entity.OAuthUser;
import com.ssafy.ssam.global.auth.entity.User;
import com.ssafy.ssam.global.auth.repository.OAuthUserRepository;
import com.ssafy.ssam.global.auth.repository.UserRepository;
import com.ssafy.ssam.global.error.CustomException;
import com.ssafy.ssam.global.error.ErrorCode;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.UUID;


@Slf4j
@RequiredArgsConstructor
@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final OAuthUserRepository oAuthUserRepository;
    private final HttpSession httpSession;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        log.info("OAuth2 User loading started");
        OAuth2User oAuth2User = super.loadUser(userRequest);
        String provider = userRequest.getClientRegistration().getRegistrationId();
        String providerId = oAuth2User.getAttribute("sub");
        String email = oAuth2User.getAttribute("email");

        log.info("Provider: {}, ProviderId: {}, Email: {}", provider, providerId, email);

        OAuthUser oAuthUser = oAuthUserRepository.findByProviderAndProviderId(provider, providerId)
                .orElse(null);

        User user;

        if (oAuthUser != null) {
            // 기존 OAuth 계정이 있는 경우
            user = oAuthUser.getUser();
            log.info("Existing OAuth user found: {}", user.getUsername());
        } else {
            // 새로운 OAuth 연결 필요
            Integer currentUserId = (Integer) httpSession.getAttribute("CURRENT_USER_ID");

            if (currentUserId != null) {
                // 현재 로그인된 사용자가 있는 경우
                user = userRepository.findByUserId(currentUserId)
                        .orElseThrow(() -> new CustomException(ErrorCode.UserNotFoundException));
                log.info("Linking new OAuth to existing user: {}", user.getUsername());
            } else {
                // 로그인되지 않은 상태에서 OAuth 로그인 시도
                user = userRepository.findByEmail(email).orElse(null);

                if (user == null) {
                    // 새 사용자 생성
                    user = createNewUser(email);
                    log.info("New user created: {}", user.getUsername());
                }
            }

            // OAuth 연결 생성
            oAuthUser = OAuthUser.builder()
                    .provider(provider)
                    .providerId(providerId)
                    .email(email)
                    .user(user)
                    .build();
            oAuthUserRepository.save(oAuthUser);
            log.info("New OAuth connection created for user: {}", user.getUsername());
        }

        httpSession.setAttribute("CURRENT_USER_ID", user.getUserId());
        return new CustomOAuth2User(user, oAuth2User.getAttributes());
    }

    private User createNewUser(String email) {
        return User.builder()
                .email(email)
                .username(generateUsername(email))
                // 필요한 다른 필드들 설정
                .build();
    }

    private String generateUsername(String email) {
        return email.split("@")[0] + "_" + UUID.randomUUID().toString().substring(0, 8);
    }
}
