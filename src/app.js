const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const userRoutes = require('./routes/userRoutes');
app.use('/user', userRoutes);

const lessonRoutes = require('./routes/lessonRoutes');
app.use('/api', lessonRoutes);

const progressRoutes = require('./routes/progressRoutes');
app.use('/progress', progressRoutes);

app.get('/', (req, res) => {
    res.send('Sanskrit Learning Platform API');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
