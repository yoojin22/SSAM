import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const OAuthResponse = () => {
  const { token } = useParams(); // URL에서 토큰을 추출
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      // 토큰을 localStorage에 저장
      localStorage.setItem('USER_TOKEN', "Bearer " + token);
      
      // 토큰 저장 후 원하는 페이지로 리다이렉트
      navigate('/');
      window.location.reload();

    }
  }, [token, navigate]);

  return (
    <div>
      <h1>로그인 처리 중...</h1>
    </div>
  );
};

export default OAuthResponse;
