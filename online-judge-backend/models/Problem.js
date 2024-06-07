const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const problemSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    inputDescription: {
        type: String,
        required: true
    },
    outputDescription: {
        type: String,
        required: true
    },
    sampleInputs: [{
        type: String,
        required: true
    }],
    sampleOutputs: [{
        type: String,
        required: true
    }],
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true
    },
    tags: [{
        type: String
    }]
}, {
    timestamps: true
});

const Problem = mongoose.model('Problem', problemSchema);

module.exports = Problem;
