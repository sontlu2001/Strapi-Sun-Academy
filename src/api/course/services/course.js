'use strict';

/**
 * course service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::course.course', ({strapi}) => ({
    async search(keyword){
        const result = await strapi.db.connection.raw(`
            select *
            from courses
            where courses.name like '%${keyword}%' or courses.slug like '%${keyword}%'
        `)
        // return list course_id   
        return result.rows || []
    }
}));
