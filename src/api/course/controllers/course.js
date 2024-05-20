"use strict";

/**
 * course controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::course.course", ({ strapi }) => ({
  async search(ctx) {
    const { keyword } = ctx.query;

    if (!keyword) {
      return ctx.badRequest("Missing keyword parameter");
    }

    try {
      return await strapi.service("api::course.course").search(keyword);
    } catch (err) {
        console.log(err);
      ctx.badRequest("Failed to search courses");
    }
  },
}));
