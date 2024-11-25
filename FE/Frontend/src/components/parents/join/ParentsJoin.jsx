import axios from "axios";
import { useState } from "react";
import join from "./ParentsJoin.module.scss";
import human from "../../../assets/human.png";
import lock from "../../../assets/lock.png";
import mail from "../../../assets/mail.png";
import calendar from "../../../assets/calendar.png";
import phone from "../../../assets/phone.png";
import round1 from "../../../assets/round1.png";
import round2 from "../../../assets/round2.png";
import Swal from "sweetalert2";

const apiUrl = import.meta.env.API_URL

const ParentsJoin = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    name: "",
    birth: "",
    phone: "",
  });

  // 입력값이 변경될 때 상태를 업데이트하는 함수
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 회원가입 POST
  const joinSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${apiUrl}/v1/auth/students`, formData)
      .then((response) => {
        console.log("axios 성공", response);
        Swal.fire({
          title: "성공!",
          text: "회원가입이 완료되었습니다",
          icon: "success",
        }).then(function (isConfirm) {
          if (isConfirm) {
            window.location.replace("./teacherlogin");
          }
        });
      })
      .catch((error) => {
        console.error("axios 실패", error);
        alert("실패", error);
      });
  };

  return (
    <div className={join.joinArray}>
      <h1 className={join.joinTitle}>회원가입</h1>
      <div className={join.joinBackground}>
        <form onSubmit={joinSubmit} className={join.joinForm}>
          <div>
            <img src={human} className={join.joinIcon} alt="human" />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="아이디"
              required
            />
          </div>
          <hr />
          <div>
            <img src={lock} className={join.joinIcon} alt="lock" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호"
              required
            />
          </div>
          <hr />
          <div>
            <img src={mail} className={join.joinIcon} alt="mail" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="이메일"
              required
            />
          </div>
          <hr />
          <div>
            <img src={human} className={join.joinIcon} alt="human" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="이름"
              required
            />
          </div>
          <hr />
          <div>
            <img src={calendar} className={join.joinIcon} alt="calendar" />
            <input
              type="text"
              name="birth"
              value={formData.birth}
              onChange={handleChange}
              placeholder="생년월일 [YYYY-MM-DD]"
              required
            />
          </div>
          <hr />
          <div>
            <img src={phone} className={join.joinIcon} alt="phone" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="휴대전화 [01012345678]"
              required
            />
          </div>
          <hr />
          <div className={join.joinBtnArray}>
            <button type="submit" className={join.joinBtn}>
              가입
            </button>
            <button
              type="button"
              className={join.cancleBtn}
              onClick={() => window.location.replace("./")}
            >
              취소
            </button>
          </div>
        </form>
      </div>
      <img src={round1} className={join.round1} alt="round1" />
      <img src={round2} className={join.round2} alt="round2" />
    </div>
  );
};

export default ParentsJoin;
