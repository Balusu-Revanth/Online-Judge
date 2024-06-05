const Problem = require('../../models/Problem');

const getAllProblems = async (req, res) => {
    try {
        const problems = await Problem.find();
        res.status(200).json(problems);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = getAllProblems;
