package com.ssafy.ssam.domain.consult.entity;

import org.hibernate.annotations.ColumnDefault;

import com.ssafy.ssam.domain.consult.dto.request.SummaryRequestDto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor(access = AccessLevel.PROTECTED)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Builder
@Getter
@Setter
@Table(name = "summary")
public class Summary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "summary_id")
    private Integer summaryId;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "consult_id", nullable = false)
    private Consult consult;

    @NotNull
    @Column(name = "key_point", nullable = false)
    private String keyPoint;

    @ColumnDefault("0")
    @Column(name = "profanity_count", nullable = false)
    private int profanityCount;

    @Column(name = "profanity_level", nullable = false, length = 10)
    private String profanityLevel;

    @Column(name = "parent_concern", columnDefinition = "TEXT")
    private String parentConcern;

    @Column(name = "teacher_recommendation", columnDefinition = "TEXT")
    private String teacherRecommendation;


    public static Summary toSummary(SummaryRequestDto summaryRequestDto, Consult consult){
        return Summary.builder()
                .consult(consult)
                .keyPoint(summaryRequestDto.getKeyPoint())
                .profanityCount(summaryRequestDto.getProfanityCount())
                .profanityLevel(summaryRequestDto.getProfanityLevel())
                .parentConcern(summaryRequestDto.getParentConcern())
                .teacherRecommendation(summaryRequestDto.getTeacherRecommendation())
                .build();
    }
}
