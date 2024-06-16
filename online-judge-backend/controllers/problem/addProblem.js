const Problem = require("../../models/Problem");
const slugify = require("slugify");

const addProblem = async (req, res) => {
  const {
    title,
    description,
    inputDescription,
    outputDescription,
    sampleInputs,
    sampleOutputs,
    difficulty,
    tags,
    testCases,
  } = req.body;

  try {
    const problem_id = slugify(title, { lower: true, strict: true });

    const newProblem = new Problem({
      title,
      problem_id,
      description,
      inputDescription,
      outputDescription,
      sampleInputs,
      sampleOutputs,
      difficulty,
      tags,
      testCases,
    });

    const savedProblem = await newProblem.save();
    res.status(201).json(savedProblem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = addProblem;
