import { userManager } from '../DAL/DAOs/MongoDAOs/users.manager.dao.js';
import { compareData } from '../utils.js';

class UserService {
    async findAll() {
        try {
            const users = await userManager.findAll();
            return users;
        } catch (error) {
            throw error;
        }
    }

    async findOne(id) {
        try {
            const user = await userManager.findById(id);
            return user;
        } catch (error) {
            throw error;
        }
    }

    async createOne(userData) {
        try {
            const passwordIsValid = await compareData(userData.password, userData.confirmPassword);
            if (!passwordIsValid) {
                throw new Error('Passwords do not match');
            }
            const newUser = await userManager.createOne(userData);
            return newUser;
        } catch (error) {
            throw error;
        }
    }

    async updateOne(id, userData) {
        try {
            if (userData.password) {
                const passwordIsValid = await compareData(userData.password, userData.confirmPassword);
                if (!passwordIsValid) {
                    throw new Error('Passwords do not match');
                }
            }

            const response = await userManager.updateOne(id, userData);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async deleteOne(id) {
        try {
            const response = await userManager.deleteOne(id);
            return response;
        } catch (error) {
            throw error;
        }
    }
}

export const userService = new UserService();