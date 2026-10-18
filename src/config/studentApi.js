import { baseApi } from "./baseApi";

class StudentApi {
  #http = baseApi.instance;

  // ─── Auth (Public) ──────────────────────────────────────────────────────────

  register(data) {
    return this.#http.post("/student", data);
  }

  login(data) {
    return this.#http.post("/student/login", data);
  }

  forgotPassword(data) {
    return this.#http.post("/forgot_password/student", data);
  }

  verifyAccount(token) {
    return this.#http.get(`/verify/student/${token}`);
  }

  verifyResetToken(token) {
    return this.#http.get(`/reset_password/student/verify/${token}`);
  }

  resetPassword(token, data) {
    return this.#http.post(`/reset_password/student/${token}`, data);
  }

  // Google sign-in: trades the one-time code from /callback for the login
  // token and profile, so the token never appears in a URL
  exchangeGoogleCode(code) {
    return this.#http.post("/auth/google/exchange", { code });
  }

  // ─── Auth (Authenticated) ───────────────────────────────────────────────────

  logout() {
    // Fails fast offline, so Logout's cleanup (in finally) runs straight away
    return this.#http.post("/logout", {}, { silent: true, timeout: 5000 });
  }

  changePassword(data) {
    return this.#http.post("/change/password/student", data);
  }

  // ─── Profile (Authenticated) ────────────────────────────────────────────────

  // The signed-in student's own profile, read from the token
  getMyProfile() {
    return this.#http.get("/studentInfo");
  }

  updateProfile(data) {
    return this.#http.post("/studentUpdate", data);
  }

  uploadImage(formData) {
    return this.#http.post("/uploadImage", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  deleteImage() {
    return this.#http.delete("/deleteImage");
  }

  // ─── Subjects (Authenticated) ───────────────────────────────────────────────

  addSubject(data) {
    return this.#http.post("/addSubject", data);
  }

  removeSubject(data) {
    return this.#http.put("/removeSubject", data);
  }

  getNotEnrolledSubjects() {
    return this.#http.get("/notEnrolledSubjects");
  }

  // ─── Rating & Feedback (Authenticated) ─────────────────────────────────────

  updateRating(data) {
    return this.#http.put("/myRating", data);
  }

  submitFeedback() {
    return this.#http.put("/students/feedback");
  }
  myMockTest() {
    return this.#http.get("mock-tests/my-tests");
  }
}

export const studentApi = new StudentApi();
