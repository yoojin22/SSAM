package com.ssafy.ssam.domain.classroom.repository;

import com.ssafy.ssam.domain.classroom.entity.School;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SchoolRepository extends JpaRepository<School, Integer> {

    Optional<School> findSchoolByName (String schoolName);
    Optional<List<School>> findByNameContaining(String query);

}
