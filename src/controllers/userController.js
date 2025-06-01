const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

// Register a new user (mocked password hash)
exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    try {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return res.status(409).json({ error: 'Email already registered' });
        const hashedPassword = await bcrypt.hash(password, 8);
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword }
        });
        res.status(201).json({ id: user.id, name: user.name, email: user.email });
    } catch (err) {
        res.status(500).json({ error: 'Registration failed' });
    }
};

// Login (mocked, no JWT)
exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
        // Mocked session: just return user info
        res.json({ id: user.id, name: user.name, email: user.email });
    } catch (err) {
        res.status(500).json({ error: 'Login failed' });
    }
};

// Get profile info
exports.profile = async (req, res) => {
    const { userId } = req.body; // In real app, get from session/JWT
    if (!userId) return res.status(400).json({ error: 'userId required' });
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                xp: true,
                current_streak: true,
                last_activity_date: true
            }
        });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};
