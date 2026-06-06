import { baseApi } from "./baseApi.JS";

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

  // ─── Auth (Authenticated) ───────────────────────────────────────────────────

  logout() {
    return this.#http.post("/logout");
  }

  changePassword(data) {
    return this.#http.post("/change/password/student", data);
  }

  // ─── Profile (Public) ───────────────────────────────────────────────────────

  getStudentById(studentId) {
    return this.#http.get(`/studentInfo/${studentId}`);
  }

  // ─── Profile (Authenticated) ────────────────────────────────────────────────

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

  submitFeedback(data) {
    return this.#http.post("/submitFeedback", data);
  }
}

export const studentApi = new StudentApi();
