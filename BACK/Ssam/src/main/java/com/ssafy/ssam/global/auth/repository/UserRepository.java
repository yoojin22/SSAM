package com.ssafy.ssam.global.auth.repository;

import com.ssafy.ssam.global.auth.entity.User;
import com.ssafy.ssam.global.auth.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    // username 기반으로 존재하는지 여부 검증 jpa

    boolean existsByUsername(String username);
    boolean existsByUserIdAndRole(int id, UserRole role);

    // username 기반 DB에 존재하는 User 가져오는 jpa
    Optional<User> findByUsername(String username);
    Optional<User> findByUserId(int id);
    Optional<User> findByUserIdAndRole(int id, UserRole role);

    Optional<User> findByEmail(String email);
}
