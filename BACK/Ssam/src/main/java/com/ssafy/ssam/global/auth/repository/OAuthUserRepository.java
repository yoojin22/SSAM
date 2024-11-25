package com.ssafy.ssam.global.auth.repository;

import com.ssafy.ssam.global.auth.entity.OAuthUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OAuthUserRepository extends JpaRepository<OAuthUser, Integer> {
    Optional<OAuthUser> findByProviderAndProviderId(String provider, String providerId);
}
