import { create } from "zustand";

const useStudentsStore = create((set) => ({
  students: [], // 빈 배열로 초기화
  setStudents: (students) =>
    set({ students: Array.isArray(students) ? students : [] }), // 항상 배열로 설정
}));

export { useStudentsStore };
