import axios from "axios";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import styles from "./ParentsUpdate.module.scss";
import Swal from "sweetalert2";

const apiUrl = import.meta.env.API_URL;

const useProfile = () => {
  const [profileData, setProfileData] = useState({
    profileImage: null, // 기본값을 null로 설정하여 이미지가 없을 때를 명확히 처리
    name: "",
    birth: "",
    school: "",
    username: "",
    email: "",
    selfPhone: "",
    otherPhone: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("USER_TOKEN");
      try {
        console.log("Fetching profile data with token:", token);
        const response = await axios.get(`${apiUrl}/v1/users`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        const data = {
          profileImage: response.data.profileImage || null, // 프로필 이미지가 없는 경우 null로 설정
          name: response.data.name || "",
          birth: response.data.birth || "",
          school: response.data.school || "",
          username: response.data.username || "",
          email: response.data.email || "",
          selfPhone: response.data.selfPhone || "",
          otherPhone: response.data.otherPhone || "",
        };
        setProfileData(data);
        console.log("Fetched Profile Data:", data);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      }
    };

    fetchData();
  }, []);

  return { profileData, setProfileData };
};

const ParentsUpdate = () => {
  const { profileData: profile, setProfileData } = useProfile();

  const handleSave = async (e) => {
    e.preventDefault();

    console.log("Current profile state before save:", profile);

    const formData = new FormData();
    formData.append("school", profile.school || "");
    formData.append("selfPhone", profile.selfPhone || "");
    formData.append("otherPhone", profile.otherPhone || "");

    if (profile.profileImage === null) {
      formData.append("profileImage", ""); // 프로필 이미지가 null일 경우 빈 문자열로 전송
    } else if (profile.profileImage instanceof File) {
      formData.append("profileImage", profile.profileImage);
    } else if (typeof profile.profileImage === "string") {
      console.log(
        "Profile image is a string (URL), skipping form data append."
      );
    }

    console.log("FormData to be sent:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    const token = localStorage.getItem("USER_TOKEN");

    try {
      const response = await axios.put(`${apiUrl}/v1/users`, formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });
      Swal.fire({
        text: "변경사항이 성공적으로 저장되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
        customClass: {
          popup: "my-swal-popup",
          confirmButton: "my-swal-confirm-button",
        },
        width: "auto", // 기본 옵션에서 width 설정을 auto로 변경
      });

      console.log("Profile updated successfully:", response.data);
    } catch (error) {
      console.error("Profile update failed:", error);
      console.log(
        "Error details:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleCancel = () => {
    window.location.reload(); // 페이지 새로고침
  };

  const handleDeleteImage = () => {
    setProfileData({ ...profile, profileImage: null }); // 프로필 이미지를 null로 설정하여 삭제 처리
    console.log("Profile image set to null.");
  };

  return (
    <div className={styles.Container}>
      <div className={styles.menuNavbar}>
        <div className={styles.updateItem}>회원정보 수정</div>
        <NavLink to="/studentpasswordchange" className={styles.changeItem}>
          비밀번호 변경
        </NavLink>
      </div>
      <div className={styles.infoArray}>
        <form className={styles.infoForm} onSubmit={handleSave}>
          <table className={styles.tableArray}>
            <tbody>
              <tr>
                <th style={{ borderTop: 'none' }}>사진</th>
                <td className={styles.imgTd} style={{ borderTop: 'none' }}>
                  <div className={styles.profileImg}>
                    {profile.profileImage ? (
                      <img
                        src={
                          typeof profile.profileImage === "string"
                            ? profile.profileImage
                            : URL.createObjectURL(profile.profileImage)
                        }
                        alt="Profile"
                        className={styles.profileImage}
                      />
                    ) : (
                      <p>이미지 없음</p> // 이미지가 없을 때 기본 메시지 표시
                    )}
                  </div>
                  <div className={styles.btn}>
                    <input
                      type="file"
                      id="file"
                      className={styles.inputBtn}
                      onChange={(e) =>
                        setProfileData({
                          ...profile,
                          profileImage: e.target.files[0],
                        })
                      }
                    />
                    <label htmlFor="file" className={styles.updateBtn}>
                      수정
                    </label>
                    <button
                      type="button"
                      className={styles.imgBtn}
                      onClick={handleDeleteImage}
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <th>이름</th>
                <td>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    disabled
                  />
                </td>
              </tr>
              <tr>
                <th>생년월일</th>
                <td>
                  <input
                    type="date"
                    name="birth"
                    value={profile.birth}
                    disabled
                  />
                </td>
              </tr>
              <tr>
                <th>학교</th>
                <td>
                  <input
                    type="text"
                    name="school"
                    value={profile.school}
                    disabled // 학교 입력 필드를 수정 불가능하게 설정
                  />
                </td>
              </tr>
              <tr>
                <th>아이디</th>
                <td>
                  <input
                    type="text"
                    name="username"
                    value={profile.username}
                    disabled
                  />
                </td>
              </tr>
              <tr>
                <th>이메일</th>
                <td>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    disabled
                  />
                </td>
              </tr>
              <tr>
                <th>학생 전화번호</th>
                <td>
                  <input
                    type="text"
                    name="selfPhone"
                    value={profile.selfPhone}
                    onChange={(e) =>
                      setProfileData({ ...profile, selfPhone: e.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <th style={{ borderBottom: 'none' }}>학부모 전화번호</th>
                <td style={{ borderBottom: 'none' }}>
                  <input
                    type="text"
                    name="otherPhone"
                    value={profile.otherPhone}
                    onChange={(e) =>
                      setProfileData({ ...profile, otherPhone: e.target.value })
                    }
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div className={styles.formBtnArray}>
            <button type="submit" className={styles.saveBtn}>
              저장
            </button>
            <button
              type="button"
              className={styles.deleteBtn}
              onClick={handleCancel}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ParentsUpdate;
