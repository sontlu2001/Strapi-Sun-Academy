"use strict";

/**
 * quiz-result controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::quiz-result.quiz-result",
  ({ strapi }) => ({
    submit: async (ctx) => {
      const { quizId, answers, quizResultId } = ctx.request.body;

      // Validate the answers object
      if (!answers || typeof answers !== 'object' || Object.keys(answers).length === 0) {
        return ctx.badRequest('Invalid answers data');
      }

      // Update the quiz result status to 'completed'
      await strapi.db.query("api::quiz-result.quiz-result").update({
        where: { id: quizResultId },
        data: { status: "completed" },
      });

      let correctAnswers = 0;
      // Fetch all questions for the quiz in one go
      const questionIds = Object.keys(answers);
      const questions = await strapi.db.query('api::question.question').findMany({
        where: { id: { $in: questionIds } },
        select: ['id', 'correct_answer'],
      });

      // Map through the questions and calculate correct answers, and create quiz result details
      await Promise.all(
        questions.map(async (question) => {
          const userAnswer = answers[question.id];
          const isCorrect = userAnswer === question.correct_answer;
          if (isCorrect) correctAnswers += 1;
          
          // Create a quiz result detail entry
          await strapi.db.query("api::quiz-result-detail.quiz-result-detail").create({
            data: {
              question: question.id,
              answer: userAnswer,
              quiz_result: quizResultId,
            },
          });
        })
      );

      // Update the quiz result with the number of correct answers
      const quizResult = await strapi.db.query("api::quiz-result.quiz-result").update({
        where: { id: quizResultId },
        data: { correct_answers: correctAnswers },
        select: ['correct_answers', 'total_question'],
      });

      // Return response with correct and incorrect answers
      return ctx.send({
        message: "Quiz result submitted",
        correctAnswers: quizResult.correct_answers,
        incorrectAnswers: quizResult.total_question - quizResult.correct_answers,
      });
    }
  })
);
