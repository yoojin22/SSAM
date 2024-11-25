import { create } from "zustand";
import axios from "axios";
const apiUrl = import.meta.env.API_URL;

const defaultPin = {
  board_id: "",
  schoolName: "",
  grade: "",
  classroom: "",
  teacherName: "",
  teacherImage: "",
};

const PinStore = create((set) => ({
  pin: { ...defaultPin },

  init: () => {
    set({ pin: { ...defaultPin } });
  },

  fetchPinData: async () => {
    try {
      const token = localStorage.getItem("USER_TOKEN");
      console.log(token);
      const response = await axios.get(
        `${apiUrl}/v1/classrooms`,
        {
          pin: "123456",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImJlb21qdW4iLCJyb2xlIjoiVEVBQ0hFUiIsInVzZXJJZCI6MjYsImlhdCI6MTcyMjY5NzAzNywiZXhwIjoxNzIyNzExNDM3fQ.zPDiLXzsac8SV2LFv2db3edElbX0rU0MznwSR38kI_k",
          },
        }
      );
      set({ pin: response.data });
      console.log("pin.jsx: ", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch pin data:", error);
      throw error;
    }
  },
}));

export default PinStore;
