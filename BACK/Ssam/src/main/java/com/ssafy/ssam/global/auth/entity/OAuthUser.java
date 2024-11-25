package com.ssafy.ssam.global.auth.entity;

import jakarta.persistence.*;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Setter
@Getter
@Table(name = "oauth_user")
@Entity
public class OAuthUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "provider", nullable = false)
    private String provider;

    @Column(name = "provider_id", nullable = false)
    private String providerId;

    @Column
    private String email;

    @OneToOne
    @JoinColumn(name = "linked_user_id", referencedColumnName = "user_id")
    private User user;
}
