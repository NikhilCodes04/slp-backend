const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Mark lesson as completed for a user
exports.completeLesson = async (req, res) => {
    const { userId, lessonId } = req.body;
    if (!userId || !lessonId) {
        return res.status(400).json({ error: 'userId and lessonId required' });
    }
    try {
        const progress = await prisma.userLessonProgress.create({
            data: {
                userId,
                lessonId,
                completedAt: new Date()
            }
        });
        res.status(201).json(progress);
    } catch (err) {
        res.status(500).json({ error: 'Failed to mark lesson complete' });
    }
};

// Get completed lessons for a user
exports.getCompletedLessons = async (req, res) => {
    const { userId } = req.params;
    try {
        const completed = await prisma.userLessonProgress.findMany({
            where: { userId: Number(userId) },
            include: { lesson: true }
        });
        res.json(completed);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch completed lessons' });
    }
};

// Record an exercise attempt and update XP, streak, and last activity
exports.recordExerciseAttempt = async (req, res) => {
    const { userId, exerciseId, isCorrect } = req.body;
    if (!userId || !exerciseId || typeof isCorrect !== 'boolean') {
        return res.status(400).json({ error: 'userId, exerciseId, isCorrect required' });
    }
    try {
        // XP logic
        const xpAwarded = isCorrect ? 10 : 0;
        // Get user
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ error: 'User not found' });
        // Streak logic
        const today = new Date();
        let newStreak = user.current_streak || 0;
        let lastDate = user.last_activity_date ? new Date(user.last_activity_date) : null;
        if (lastDate) {
            const diff = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
            if (diff === 1) newStreak += 1;
            else if (diff > 1) newStreak = 1;
        } else {
            newStreak = 1;
        }
        // Update user XP, streak, last activity
        await prisma.user.update({
            where: { id: userId },
            data: {
                xp: { increment: xpAwarded },
                current_streak: newStreak,
                last_activity_date: today
            }
        });
        // Record attempt
        const attempt = await prisma.exerciseAttempt.create({
            data: {
                userId,
                exerciseId,
                isCorrect,
                attemptedAt: today,
                xpAwarded
            }
        });
        res.status(201).json(attempt);
    } catch (err) {
        res.status(500).json({ error: 'Failed to record attempt' });
    }
};

// Get all attempts for a user
exports.getUserAttempts = async (req, res) => {
    const { userId } = req.params;
    try {
        const attempts = await prisma.exerciseAttempt.findMany({
            where: { userId: Number(userId) },
            include: { exercise: true }
        });
        res.json(attempts);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch attempts' });
    }
};

// Weekly leaderboard by XP
exports.weeklyLeaderboard = async (req, res) => {
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);
    try {
        const users = await prisma.user.findMany({
            orderBy: { xp: 'desc' },
            select: { id: true, name: true, xp: true }
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
};
