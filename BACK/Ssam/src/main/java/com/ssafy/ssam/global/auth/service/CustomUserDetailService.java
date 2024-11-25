package com.ssafy.ssam.global.auth.service;

import com.ssafy.ssam.domain.user.entity.UserBoardRelation;
import com.ssafy.ssam.domain.user.entity.UserBoardRelationStatus;
import com.ssafy.ssam.domain.user.repository.UserBoardRelationRepository;
import com.ssafy.ssam.global.auth.dto.CustomUserDetails;
import com.ssafy.ssam.global.auth.entity.User;
import com.ssafy.ssam.global.auth.repository.UserRepository;
import com.ssafy.ssam.global.error.CustomException;
import com.ssafy.ssam.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserDetailService implements UserDetailsService {
    private final UserRepository userRepository;
    private final UserBoardRelationRepository userBoardRelationRepository;
    @Override
    public UserDetails loadUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new CustomException(ErrorCode.UserNotFoundException));
        List<UserBoardRelation> userBoardRelations = userBoardRelationRepository.findUserBoardRelationsByUser(user)
                .orElse(new ArrayList<>());

        for(UserBoardRelation relation : userBoardRelations){
            if(!relation.getStatus().equals(UserBoardRelationStatus.ACCEPTED)
                    && !relation.getStatus().equals(UserBoardRelationStatus.OWNER)) continue;
            if(relation.getBoard().getIsDeprecated().equals("1")) continue;
            return new CustomUserDetails(user.getUserId(), relation.getBoard().getBoardId(),
                user.getUsername(), user.getPassword(), user.getRole().toString());
        }

        return new CustomUserDetails(user.getUserId(), null,
                user.getUsername(), user.getPassword(), user.getRole().toString());
    }
}
