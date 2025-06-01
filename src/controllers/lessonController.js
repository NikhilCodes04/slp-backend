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
    const { lessonId, type, prompt, options, expectedAnswer } = req.body;
    if (!lessonId || !type || !prompt || !options || !expectedAnswer) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    try {
        const exercise = await prisma.exercise.create({
            data: {
                lessonId,
                type,
                prompt,
                options: JSON.stringify(options),
                expectedAnswer: JSON.stringify(expectedAnswer)
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
