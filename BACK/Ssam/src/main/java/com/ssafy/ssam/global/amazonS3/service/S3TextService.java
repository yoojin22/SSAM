package com.ssafy.ssam.global.amazonS3.service;


import java.io.IOException;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.AmazonS3Exception;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.ssafy.ssam.global.error.CustomException;
import com.ssafy.ssam.global.error.ErrorCode;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class S3TextService {
    private final AmazonS3 amazonS3;
    @Value("${cloud.aws.s3.bucketName}")
    private String bucket;

    @Transactional
    public String readText(String sessionId){
    	String key = "recordings/" + sessionId + "/" + sessionId + ".txt";
        try {
            S3Object o = amazonS3.getObject(bucket, key);
            try (S3ObjectInputStream ois = o.getObjectContent()) {
                String text = new String(ois.readAllBytes(), StandardCharsets.UTF_8);
                System.out.println("S3 readText:: " + text);
                return text;
            }
        } catch (AmazonS3Exception e) {
            throw new CustomException(ErrorCode.AmazonError);
        } catch (IOException e) {
            throw new CustomException(ErrorCode.FileNotFoundException);
        }
    }


}
