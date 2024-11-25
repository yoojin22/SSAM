package com.ssafy.ssam.domain.consult.repository;

import com.ssafy.ssam.domain.consult.entity.Appointment;
import com.ssafy.ssam.domain.consult.entity.Consult;
import com.ssafy.ssam.domain.consult.entity.Summary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SummaryRepository extends JpaRepository<Summary, Integer>{
    // Id 기반으로 존재하는지 여부 검증 jpa
    Summary findById(int id);
    Optional<Summary> findByConsult(Consult consult);
}
