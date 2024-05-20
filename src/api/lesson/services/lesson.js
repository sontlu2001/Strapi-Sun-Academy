"use strict";

/**
 * lesson service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::lesson.lesson", ({ strapi }) => ({
  async getLessonByCourse(courseId) {
    const lessons = await strapi.db.query('api::lesson.lesson').findMany({
      select: ['name', 'resource', 'URL_video'],
      where: {course_id: courseId},
      orderBy: { id: 'ASC' },
      populate: { chapter_id: true, course_id: true }
    });
    const chapters = await strapi.db.query('api::chapter.chapter').findMany({
      where:  {course_id: courseId},
      orderBy: { id: 'ASC' },
    })
    return {
      chapters,
      lessons
    }
  },
}));
