package com.ssafy.ssam.domain.classroom.entity;

import com.ssafy.ssam.domain.user.entity.UserBoardRelation;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor(access = AccessLevel.PROTECTED)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Setter
@Builder
@Entity
@Table(name = "board")
public class Board {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "board_id")
    private Integer boardId;

    @Column(unique = true, nullable = false, length = 6)
    private String pin;

    @Column
    private String banner;

    @Column(name = "banner_img")
    private String bannerImg;

    @Column(columnDefinition = "TEXT")
    private String notice;

    @Column(columnDefinition = "TINYINT CHECK (grade BETWEEN 1 AND 6)", nullable = false)
    private Integer grade;

    @Column(columnDefinition = "TINYINT", nullable = false)
    private Integer classroom;

    @Column(name = "consult_url")
    private String consultUrl;

    @Column(name = "is_deprecated", columnDefinition = "TINYINT(1)", nullable = false)
    private Integer isDeprecated;

    @OneToMany(mappedBy = "board", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Question> questions = new ArrayList<>();

    @OneToMany(mappedBy = "board")
    private List<UserBoardRelation> userBoardRelations = new ArrayList<>();

}
