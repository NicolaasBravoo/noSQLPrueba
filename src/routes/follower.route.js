const { Router } = require('express');
const router = Router();
const { followerController } = require('../controllers');

// POST /followers → seguir a un usuario
router.post('/', followerController.followUser);


module.exports = router;
