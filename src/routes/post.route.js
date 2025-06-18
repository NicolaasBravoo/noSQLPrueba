const { Router } = require('express');
const router = Router();
const { postController } = require('../controllers');
const { postMiddleware } = require('../middlewares');
const upload = require('../middlewares/uploadMiddleware'); // middleware para subir imágenes

router.get('/', postController.getPosts);
router.get('/:id', postMiddleware.validObjectId, postMiddleware.existsPost, postController.getPostById);
router.get('/:id/tags', postMiddleware.validObjectId, postMiddleware.existsPost, postController.getTagsByPost);

router.post('/', upload.array('images', 5), postController.createPost);
router.post('/:id/tags', postMiddleware.validObjectId, postMiddleware.existsPost, postController.addTagsToPost);

router.delete('/:id', postMiddleware.validObjectId, postMiddleware.existsPost, postController.deletePost);
router.put('/:id', postMiddleware.validObjectId, postMiddleware.existsPost, postController.updatePost);

router.get('/:id/comments', postMiddleware.validObjectId, postMiddleware.existsPost, postController.getCommentsByPost);

module.exports = router;