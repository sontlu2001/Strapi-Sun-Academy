"use strict";

/**
 * lesson controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::lesson.lesson", ({ strapi }) => ({
  async getLessonByCourse(ctx) {
    const {course_id} = ctx.params;
    console.log(course_id,'course_id');
    const lessons = await strapi.service("api::lesson.lesson").getLessonByCourse(course_id);
    ctx.send(lessons);
  },
}));
