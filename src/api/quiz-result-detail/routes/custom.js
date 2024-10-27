module.exports = {
  routes: [
    {
      method: "GET",
      path: "/quiz-result/:quizId",
      handler: "quiz-result-detail.getQuizResultById",
    },
  ],
 };
