const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new lesson
exports.createLesson = async (req, res) => {
    const { title, level, topic } = req.body;
    if (!title || !level || !topic) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    try {
        const lesson = await prisma.lesson.create({
            data: { title, level, topic }
        });
        res.status(201).json(lesson);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create lesson' });
    }
};

// Get all lessons
exports.getLessons = async (req, res) => {
    try {
        const lessons = await prisma.lesson.findMany();
        res.json(lessons);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch lessons' });
    }
};

// Create a new exercise for a lesson
exports.createExercise = async (req, res) => {
    const { lessonId, type, prompt, data } = req.body;
    if (!lessonId || !type || !prompt || !data) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    // Validate data structure based on type
    if (type === 'MCQ') {
        if (!Array.isArray(data.options) || !Array.isArray(data.expectedAnswer)) {
            return res.status(400).json({ error: 'MCQ data must have options and expectedAnswer arrays' });
        }
    } else if (type === 'FILL_BLANK') {
        if (!Array.isArray(data.expectedAnswer)) {
            return res.status(400).json({ error: 'FILL_BLANK data must have expectedAnswer array' });
        }
    } else if (type === 'MATCH') {
        if (!Array.isArray(data.pairs)) {
            return res.status(400).json({ error: 'MATCH data must have pairs array' });
        }
    }
    try {
        const exercise = await prisma.exercise.create({
            data: {
                lessonId,
                type,
                prompt,
                data
            }
        });
        res.status(201).json(exercise);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create exercise' });
    }
};

// Get all exercises for a lesson
exports.getExercisesByLesson = async (req, res) => {
    const { lessonId } = req.params;
    try {
        const exercises = await prisma.exercise.findMany({
            where: { lessonId: Number(lessonId) }
        });
        res.json(exercises);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch exercises' });
    }
};
