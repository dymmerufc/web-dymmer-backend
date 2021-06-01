const userModel = require('../models/user');
const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (params = {}) => {
    return jwt.sign(params, process.env.SECRET_KEY, {
        expiresIn: 86400,
    });
}

const register = async (req, res) => {
    const { email } = req.body;

    try {
        if (await userModel.findOne({ email }))
            return res.status(400).send({ error: 'User already exists' });

        const newUser = await userModel.create(req.body);

        // so that the password is not shown on return
        newUser.password = undefined;

        return res.status(200).send({
            user: newUser,
            token: generateToken({ id: newUser.id })
        });
    } catch (err) {
        return res.status(400).send({ error: 'Registration failed' });
    }
}

const authenticate = async (req, res) => {
    const { email, password } = req.body;

    const loggedUser = await userModel.findOne({ email }).select('+password');

    if (!loggedUser)
        return res.status(400).send({ error: 'User not found' });

    if (!await bycrypt.compare(password, loggedUser.password))
        return res.status(400).send({ error: 'Invalid password' });

    // so that the password is not shown on return
    loggedUser.password = undefined;

    return res.status(200).send({
        user: loggedUser,
        token: generateToken({ id: loggedUser.id })
    });
}

const list = async (req, res) => {
    try {
        const users = await userModel.find();

        return res.status(200).send({ users });
    } catch (err) {
        return res.status(400).send({ error: 'Error loading users' });
    }
}

const get = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.userId);

        return res.status(200).send({ user });
    } catch (err) {
        return res.status(400).send({ error: 'Error loading user' });
    }
}

const remove = async (req, res) => {
    try {
        await userModel.findByIdAndDelete(req.params.userId);

        res.status(200).send({ message: 'User has removed' });
    } catch (err) {
        res.status(400).send({ error: 'Error removing user' });
    }
}

module.exports = { register, authenticate, list, get, remove };
