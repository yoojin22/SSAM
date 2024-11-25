package com.ssafy.ssam.domain.consult.entity;

import lombok.Getter;

import java.util.Arrays;

@Getter
public enum AppointmentStatus {
    APPLY,
    ACCEPTED,
    DONE,
    CANCEL,
    REJECT
}
