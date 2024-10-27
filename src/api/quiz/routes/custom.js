module.exports = {
    routes: [
      {
        method: "GET",
        path: "/quiz/generateQuestions/:quizId",
        handler: "quiz.randomQuestions",
      },
      {
        method: "GET",
        path: "/quiz/getQuizByUser",
        handler: "quiz.getQuizByUser",
      },
    ],
   };
