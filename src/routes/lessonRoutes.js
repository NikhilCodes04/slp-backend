const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');

router.post('/lessons', lessonController.createLesson);
router.get('/lessons', lessonController.getLessons);
router.post('/exercises', lessonController.createExercise);
router.get('/lessons/:lessonId/exercises', lessonController.getExercisesByLesson);

module.exports = router;
