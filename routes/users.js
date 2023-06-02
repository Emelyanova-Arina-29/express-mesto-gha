const userRouter = require('express').Router();
const {
  createUser, getAllUsers, getUserById, updateUser, updateUserAvatar,
} = require('../controllers/users');

userRouter.post('/', createUser);

userRouter.get('/', getAllUsers);

userRouter.get('/:userId', getUserById);

userRouter.patch('/me', updateUser);

userRouter.patch('/me/avatar', updateUserAvatar);

module.exports = userRouter;
