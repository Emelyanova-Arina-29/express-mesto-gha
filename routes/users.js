const userRouter = require('express').Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
  getUserMe,
} = require('../controllers/users');

const {
  validationUserId,
  validationUpdateUser,
  validationUpdateUserAvatar,
} = require('../middlewares/validation');

userRouter.get('/', getAllUsers);

userRouter.patch('/me', validationUpdateUser, updateUser);

userRouter.patch('/me/avatar', validationUpdateUserAvatar, updateUserAvatar);

userRouter.get('/me', getUserMe);

userRouter.get('/:userId', validationUserId, getUserById);

module.exports = userRouter;
