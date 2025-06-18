const { Router } = require('express');
const router = Router();
const { userController } = require('../controllers');
const { userMiddleware } = require('../middlewares');

router.get("/", userController.getUsers);
router.get("/:id", userMiddleware.validObjectId, userMiddleware.existsUser, userController.getUserById);
router.post("/", userController.createUser);
router.delete("/:id", userMiddleware.validObjectId, userMiddleware.existsUser, userController.deleteUser);
router.put("/:id", userMiddleware.validObjectId, userMiddleware.existsUser, userController.updateUser);

module.exports = router;