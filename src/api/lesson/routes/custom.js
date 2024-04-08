module.exports = {
    routes: [
      { 
        method: 'GET',
        path: '/getLessonByCourse/:course_id', 
        handler: 'lesson.getLessonByCourse',
      },
    ]
  }