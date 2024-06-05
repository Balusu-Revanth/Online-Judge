const Problem = require('../../models/Problem');

const addProblem = async (req, res) => {
    const { title, description, inputDescription, outputDescription, sampleInputs, sampleOutputs, difficulty, tags } = req.body;

    try {
        const newProblem = new Problem({
            title,
            description,
            inputDescription,
            outputDescription,
            sampleInputs,
            sampleOutputs,
            difficulty,
            tags
        });
        const savedProblem = await newProblem.save();
        res.status(201).json(savedProblem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = addProblem;
