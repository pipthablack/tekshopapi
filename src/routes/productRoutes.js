import express from 'express'
import { createProduct, 
    getAllProducts, 
    updateProduct, 
    deleteProduct,
     getProductById
 } from '../controllers/productController.js'
 import { isAuthenticated, isAdmin  } from '../middleware/authHelpers.js';


const router = express.Router();

router.route('/').post(isAuthenticated, isAdmin, createProduct);
router.route('/all').get(isAuthenticated, isAdmin, getAllProducts)
router.route('/:id').get(isAuthenticated, isAdmin, getProductById)
router.route('/:id').put(isAuthenticated, isAdmin, updateProduct)
router.route('/:id').delete(isAuthenticated, isAdmin, deleteProduct)




export default router;