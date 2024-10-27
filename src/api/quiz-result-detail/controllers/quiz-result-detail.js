'use strict';

/**
 * quiz-result-detail controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::quiz-result-detail.quiz-result-detail', ({strapi}) => ({
  getQuizResultById: async (ctx) => {
    const { quizId } = ctx.params;
    const { user } = ctx.state;

    const quiz = await strapi.db.query('api::quiz-result.quiz-result').findOne({
      where: {id: quizId},
      populate: true,
    });

    if(user.id !== quiz.users_permissions_user.id){
      return ctx.unauthorized('You do not have permission to access this resource.');
    }

    const quizResults = await strapi.entityService.findMany("api::quiz-result-detail.quiz-result-detail", {
      fields: ['answer'],
      filters: {
        quiz_result: quizId
      },
      populate: {
        question: {
          fields: ["title", "option_a", "option_b", "option_c", "option_d", "correct_answer", "explanation"]
        }
      },
    })

    return ctx.send({
      data: quizResults,
    });
  }
}));
