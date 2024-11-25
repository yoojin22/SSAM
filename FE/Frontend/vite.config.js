import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  define: {
    // Expose the API URL to the application code
    //"import.meta.env.API_URL": JSON.stringify("http://localhost:8081"),
    "import.meta.env.API_URL": JSON.stringify("https://i11e201.p.ssafy.io/api"),
  },
});
