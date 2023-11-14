import { userService } from '../services/users.service.js';

const getAll = async (req, res) => {
    try {
        const users = await userService.findAll();
        return res.status(200).json({ message: 'Users found', users });
    } catch (error) {
        return res.status(500).json({ error });
    }
}

const getById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userService.findOne(id);
        return res.status(200).json({ message: 'User', user });
    } catch (error) {
        return res.status(500).json({ error });
    }
}

const create = async (req, res) => {
    const userData = req.body;
    try {
        const newUser = await userService.createOne(userData);
        return res.status(200).json({ message: 'New User added', newUser });
    } catch (error) {
        return res.status(500).json({ error });
    }
}

const updateById = async (req, res) => {
    const { id } = req.params;
    const userData = req.body;
    try {
        const response = await userService.updateOne(id, userData);
        return res.status(200).json({ message: 'User updated successfully', response });
    } catch (error) {
        return res.status(500).json({ error });
    }
}

const deleteById = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await userService.deleteOne(id);
        return res.status(200).json({ message: 'User deleted successfully', response });
    } catch (error) {
        return res.status(500).json({ error });
    }
}

export default {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
}