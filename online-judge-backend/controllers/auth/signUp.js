const User = require('../../models/User');

const signInOrSignUp = async (req, res) => {
    const { uid, email } = req.user;
    const { firstName, lastName } = req.body;

    try {
        let user = await User.findOne({ uid });

        if (user) {
            res.status(200).json(user);
        } else {
            user = new User({ uid, firstName, lastName, email });
            const savedUser = await user.save();
            res.status(201).json(savedUser);
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = signInOrSignUp;
