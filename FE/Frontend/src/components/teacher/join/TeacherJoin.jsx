import axios from "axios";
import { useState, useEffect } from "react";
import styles from "./TeacherJoin.module.scss";
import human from "../../../assets/human.png";
import lock from "../../../assets/lock.png";
import mail from "../../../assets/mail.png";
import search from "../../../assets/search.png";
import calendar from "../../../assets/calendar.png";
import phone from "../../../assets/phone.png";
import round1 from "../../../assets/round1.png";
import round2 from "../../../assets/round2.png";
import Swal from "sweetalert2";
const apiUrl = import.meta.env.API_URL;

const TeacherJoin = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    schoolId: "",
    name: "",
    birth: "",
    phone: "",
  });

  const [schools, setSchools] = useState([]);

  // 학교 리스트 GET
  useEffect(() => {
    axios
      .get(`${apiUrl}/v1/schools`)
      .then((response) => {
        setSchools(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // 회원가입 POST
  const joinSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${apiUrl}/v1/auth/teachers`, formData)
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
    <div className={styles.joinArray}>
      <h1 className={styles.joinTitle}>회원가입</h1>
      <div className={styles.joinBackground}>
        <form onSubmit={joinSubmit} className={styles.joinForm}>
          <div>
            <img src={human} className={styles.joinIcon} alt="human" />
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
            <img src={lock} className={styles.joinIcon} alt="lock" />
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
            <img src={mail} className={styles.joinIcon} alt="mail" />
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
            <img src={search} className={styles.joinIcon} alt="search" />
            <select
              name="schoolId"
              value={formData.schoolId}
              onChange={handleChange}
              className={styles.schoolsSelect}
            >
              <option value="">학교 목록</option>
              {schools.map((school) => (
                <option key={school.schoolId} value={school.schoolId}>
                  {school.schoolName}
                </option>
              ))}
            </select>
          </div>

          <hr />
          <div>
            <img src={human} className={styles.joinIcon} alt="human" />
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
            <img src={calendar} className={styles.joinIcon} alt="calendar" />
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
            <img src={phone} className={styles.joinIcon} alt="phone" />
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
          <div className={styles.joinBtnArray}>
            <button type="submit" className={styles.joinBtn}>
              가입
            </button>
            <button
              type="button"
              className={styles.cancleBtn}
              onClick={() => window.location.replace("./")}
            >
              취소
            </button>
          </div>
        </form>
      </div>
      <img src={round1} className={styles.round1} alt="round1" />
      <img src={round2} className={styles.round2} alt="round2" />
    </div>
  );
};

export default TeacherJoin;
