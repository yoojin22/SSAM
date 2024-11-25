//src/store/ReservationTimeStore.jsx

import { create } from "zustand";

const useReservationTimeStore = create((set, get) => ({
  reservationsByDate: {},

  setReservationsForDate: (date, reservations) =>
    set((state) => ({
      reservationsByDate: {
        ...state.reservationsByDate,
        [date]: reservations,
      },
    })),

  toggleAvailabilityForDate: (date, index) =>
    set((state) => {
      const reservations = state.reservationsByDate[date] || [];
      const updatedReservations = reservations.map((reservation, i) =>
        i === index
          ? { ...reservation, available: !reservation.available }
          : reservation
      );
      return {
        reservationsByDate: {
          ...state.reservationsByDate,
          [date]: updatedReservations,
        },
      };
    }),

  getAvailableCountForDate: (date) => {
    const reservations = get().reservationsByDate[date] || [];
    return reservations.filter((reservation) => reservation.available).length;
  },
}));

export default useReservationTimeStore;
