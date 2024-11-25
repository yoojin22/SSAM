package com.ssafy.ssam.global.amazonS3.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.ssafy.ssam.global.error.CustomException;
import com.ssafy.ssam.global.error.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Slf4j
@Service
public class S3ImageService {

    private final AmazonS3 amazonS3;
    private final String bucketName;

    public S3ImageService(AmazonS3 amazonS3, @Value("${cloud.aws.s3.bucketName}")String bucket) {
        this.amazonS3 = amazonS3;
        this.bucketName = bucket;
    }

    @Transactional
    public String upload(MultipartFile image, String category) {
        String s3FileName = category + "/" + UUID.randomUUID().toString() + "-" + image.getOriginalFilename();

        ObjectMetadata objectMetadata = new ObjectMetadata();
        objectMetadata.setContentLength(image.getSize());
        objectMetadata.setContentType(image.getContentType());

        try {
            amazonS3.putObject(bucketName, s3FileName, image.getInputStream(), objectMetadata);
        } catch (IOException e) {
            throw new CustomException(ErrorCode.InvalidImageType);
        }

        return amazonS3.getUrl(bucketName, s3FileName).toString();
    }


}
