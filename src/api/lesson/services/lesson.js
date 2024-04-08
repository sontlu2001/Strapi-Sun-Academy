"use strict";

/**
 * lesson service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::lesson.lesson", ({ strapi }) => ({
  async getLessonByCourse(courseId) {
    return await strapi.db.query('api::lesson.lesson').findOne();
  },
}));
