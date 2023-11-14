import { Router } from "express";
import viewController from '../controllers/views.controller.js'
import { getUserData, checkSession, checkAdmin, publicAcces, privateAcces} from '../middlewares/middlewares.js'

const router = Router();

router.get('/', checkAdmin, getUserData, viewController.allProducts);
router.get('/realtimeproducts', checkSession, checkAdmin, getUserData, viewController.realtimeproducts);
router.get('/product/:pid', viewController.oneProduct);
router.get('/view/products', getUserData, viewController.viewAllProducts),
router.get('/view/carts/:cid', getUserData, viewController.viewOneCart);
router.get('/register', publicAcces, viewController.viewRegister);
router.get('/login', publicAcces, viewController.viewLogin);
router.get('/profile', privateAcces, getUserData, viewController.viewProfile);

export default router
