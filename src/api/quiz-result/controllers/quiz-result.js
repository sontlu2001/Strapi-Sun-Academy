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
      const { user } = ctx.state;

      // update status a quiz result
      await strapi.db.query("api::quiz-result.quiz-result").update({
        where: { id: quizId },
        data: {
          status: "completed",
        },
      });

      // calculate correct answers
      const questions = await Promise.all(
        Object.keys(answers).map(async (question_id) => {
          const { rows: question } = await strapi.db.connection.raw(
            `SELECT q.id, q.title, q.option_a, q.option_b, q.option_c, q.option_d, q.correct_answer
                FROM questions q
                WHERE q.id = ${question_id} `
          );
           // create a entry quiz result detail
           await strapi.db
           .query("api::quiz-result-detail.quiz-result-detail")
           .create({
             data: {
               question: question[0].id,
               answer: answers[question_id],
               quiz_result: quizResultId,
             },
           });
          return {
            ...question[0],
            answer: answers[question_id],
          };
        })
      );

      return ctx.send({
        message: "Quiz result submitted",
        questions: questions,
      });
    },
  })
);
