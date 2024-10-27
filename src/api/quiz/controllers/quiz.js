"use strict";

/**
 * quiz controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::quiz.quiz", ({ strapi }) => ({
  randomQuestions: async (ctx) => {
    const { quizId } = ctx.params;

    const { list_topic } = await strapi.entityService.findOne(
      "api::quiz.quiz",
      quizId,
      {
        populate: "*",
      }
    );

    // Mapping the list of topics
    const list_topic_map = await Promise.all(
      list_topic.map(async (item) => {
        const result = await strapi.db.connection.raw(
          `SELECT cttqctl.topic_id
      FROM components_template_topic_quiz_counts_topic_links cttqctl
      WHERE cttqctl.topic_quiz_count_id = ${item.id}`
        );
        return {
          id: result.rows[0].topic_id,
          number: item.number,
          difficulty: item.difficulty,
        };
      })
    );

    // Fetching questions for each topic
    const fetchQuestions = async (item) => {
      if(item.number){
        // const { rows: questions } = await strapi.db.connection.raw(
        // `SELECT q.id, q.title, q.option_a, q.option_b, q.option_c, q.option_d
        // FROM questions q, questions_topic_links qtl
        // WHERE q.id = qtl.question_id AND qtl.topic_id = ${item.id}
        //   AND q.difficulty = INITCAP('${item.difficulty}')
        // ORDER BY RANDOM()
        // LIMIT ${item.number}`
        // );

        const questions = await strapi.db.query('api::question.question').findMany({
          where: {
            topic: item.id,
            difficulty: item.difficulty
          },
          select: ['id', 'title', 'option_a', 'option_b', 'option_c', 'option_d'],
          populate: {
            image: {
              select: ["url"]
            }
          },
          limit: item.number,
        });

        const shuffledQuestions = questions.sort(() => Math.random() - 0.5);
        return shuffledQuestions;
      }
      else {
        const questions = await strapi.db.query('api::question.question').findMany({
          where: {
            topic: {
              id: item.id,
            },
          },
          select: ['id', 'title', 'option_a', 'option_b', 'option_c', 'option_d'],
          populate: {
            image: {
              select: ["url"]
            }
          },
        });

        const shuffledQuestions = questions.sort(() => Math.random() - 0.5);
        return shuffledQuestions;
      }
    };

    // Fetching questions for each topic
    const listQuestions = await Promise.all(list_topic_map.map(fetchQuestions));
    // console.log(listQuestions, 'listQuestions');

    // create a quiz result
    const { user } = ctx.state;
    const quizResult = await strapi.db
      .query("api::quiz-result.quiz-result")
      .create({
        data: {
          quiz: quizId,
          total_question: listQuestions.flat().length,
          correct_answers: 0,
          status: "in progress",
          users_permissions_user: user.id,
        },
      });

    return ctx.send({
      message: "Questions generated successfully",
      data: {
        quizResultId: quizResult.id,
        questions: listQuestions.flat(),
      },
    });
  },

  getQuizByUser: async (ctx) => {
    const { user } = ctx.state;
    const quizResults = await strapi.db.query("api::quiz.quiz").findMany({
      select: ["id", "name", "description", "start_date", "duration"],
      where: { users_permissions_users: { id: user.id } },
      populate: true
    });

    return ctx.send({
      message: "Successfully fetched quiz results by user",
      data: quizResults,
    });
  },
}));
