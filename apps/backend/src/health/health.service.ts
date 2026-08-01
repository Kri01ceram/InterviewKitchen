class HealthService {
  getStatus() {
    return {
      success: true,
      message: "InterviewKitchen API is running 🚀",
    };
  }
}

export default new HealthService();