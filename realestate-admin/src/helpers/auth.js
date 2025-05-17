import axios from "axios";
import { BASE_URL } from "../config";

export async function checkSession() {
  try {
    const res = await axios.get(`${BASE_URL}/api/check-session`, {
      withCredentials: true,
    });

    if (res.data) {
      return res.data
    }

    return null;
  } catch (err) {
    console.error("Auth check failed:", err);
    return null;
  }
}

export async function logout() {
   try {
    await axios.post(`${BASE_URL}/api/admin/logout`, null, {
      withCredentials: true,
    });
  } catch (err) {
    console.error("Auth check failed:", err);
  }
}
