import axios from "axios";
const apiUrl = import.meta.env.API_URL;

export const NoticeChatbot = async (content, startTime, endTime) => {
  const token = localStorage.getItem("USER_TOKEN");

  try {
    const response = await axios.post(
      `${apiUrl}/v1/chatbots/teachers/noticeupload`,
      {
        content: content,
        startTime: startTime,
        endTime: endTime,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      }
    );

    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
