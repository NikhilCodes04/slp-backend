const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');

router.post('/complete-lesson', progressController.completeLesson);
router.get('/completed-lessons/:userId', progressController.getCompletedLessons);
router.post('/exercise-attempt', progressController.recordExerciseAttempt);
router.get('/exercise-attempts/:userId', progressController.getUserAttempts);
router.get('/leaderboard/weekly', progressController.weeklyLeaderboard);

module.exports = router;
