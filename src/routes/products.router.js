import { Router } from 'express';
import ProductController from '../controllers/products.controller.js';

const router = Router();

router.get('/', ProductController.getAll);
router.get('/:id', ProductController.getById);
router.post('/', ProductController.create);
router.put('/:id', ProductController.updateById);
router.delete('/:id', ProductController.deleteById);

export default router;