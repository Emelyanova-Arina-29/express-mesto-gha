const userRouter = require('express').Router();
const {
  createUser, getAllUsers, getUserById, updateUser, updateUserAvatar,
} = require('../controllers/users');

userRouter.post('/users', createUser);

userRouter.get('/users', getAllUsers);

userRouter.get('/users/:userId', getUserById);

userRouter.patch('/users/me', updateUser);

userRouter.patch('/users/me/avatar', updateUserAvatar);

module.exports = userRouter;
