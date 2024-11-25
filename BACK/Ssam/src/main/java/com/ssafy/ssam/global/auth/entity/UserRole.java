package com.ssafy.ssam.global.auth.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Set;

@RequiredArgsConstructor
@Getter
public enum UserRole {
    STUDENT("ROLE_STUDENT"),
    TEACHER("ROLE_TEACHER"),
    ADMIN("ROLE_ADMIN"),
    GUEST("ROLE_GUEST");

    private final String key;
    public Set<SimpleGrantedAuthority> getGrantedAuthorities() {
        return Set.of(new SimpleGrantedAuthority(this.getKey()));
    }
//    STUDENT("STUDENT", "1"),
//    TEACHER("TEACHER", "2"),
//    ADMIN("ADMIN", "3");
//
//    private String desc;
//    private String legacyCode;
//
//    UserRole(String desc, String legacyCode) {
//        this.desc = desc;
//        this.legacyCode = legacyCode;
//    }
//
//    public static UserRole ofLegacyCode(String legacyCode) {
//
//        return Arrays.stream(UserRole.values())
//                .filter(v -> v.getLegacyCode().equals(legacyCode))
//                .findAny()
//                .orElseThrow(() -> new IllegalArgumentException(String.format("상태코드에 legacyCode=[%s]가 존재하지 않습니다.", legacyCode)));
//    }
}
