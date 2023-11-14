import { productService } from "../services/products.service.js";
import { productManager } from "../DAL/DAOs/MongoDAOs/products.manager.dao.js";
import { cartsManager } from "../DAL/DAOs/MongoDAOs/carts.manager.dao.js";

const realtimeproducts = async(req,res)=>{
    const isAdmin = res.locals.user && res.locals.user.role === 'admin';
    try {
        const { info } = await productService.findAll({});
        if (!info.payload.length) {
            return res.status(404).send({ message: "Real-time Products not found" });
        }
        res.render("realTimeProducts", { products: info.payload, user:res.locals.user, onlyAdmin: isAdmin });
    } catch (error) {
        res.status(500).json({error});
    }
}
const allProducts = async(req,res)=>{
    const limit = req.query.limit;
    const isAdmin = res.locals.user && res.locals.user.role === 'admin';
    
        if(limit && isNaN(limit) || limit <= 0){
        return res.send({ message: "Invalid limit. Must be an integer"});
    }
    try {
        const { info } = await productService.findAll({limit});
        if (!info.payload.length) {
            return res.status(404).send({ message: "Products not found" });
        }
        res.render("home", { products: info.payload, user:res.locals.user, onlyAdmin: isAdmin});
    } catch (error) {
        res.status(500).json({error});
    }
}
const oneProduct = async(req,res)=>{
    const {pid} = req.params;
    try {
        const product = await productManager.findById(pid);
        if(!product){
            return res.status(404).send({ message: "Product not found"});
        };
        res.status(200).render("home", {product});
    } catch (error) {
        res.status(500).json({error});
    }
}

const viewAllProducts = async(req,res)=>{
    const cartIdUser = req.session.user ? req.session.user.cart : null
    const page = req.query.page || 1;
    const limit = 10;
    try {
        const productsData = await productService.findAll({ page, limit });
        // console.log(`PRODUCTSDATA`, productsData)
        const isAdmin = res.locals.user && res.locals.user.role === 'admin'; //si role es admin mando info para handlebars
        return res.render('productsView', { 
            products: productsData.info.payload, 
            pagination: productsData.info, 
            user:res.locals.user,
            cartId: cartIdUser,
            onlyAdmin: isAdmin, });
    } catch (error) {
        res.status(500).send({ error });
    }
}

const viewOneCart = async(req,res)=>{
    const {cid} = req.params;
    const isAdmin = res.locals.user && res.locals.user.role === 'admin';
    if(!cid){
        res.status(400).send({message: "Cart ID not found"})
    }
    try {
        const cart = await cartsManager.findById(cid);
        if (!cart) {
            return res.status(404).send("Cart not found");
        }
        res.render("cartView", { cart, user:res.locals.user, onlyAdmin: isAdmin });
    } catch (error) {
        res.status(500).send({error});
    }
}
const viewRegister = (req,res)=>{
    try {
        res.render('register')
    } catch (error) {
        res.status(500).send({error});
    }

}
const viewLogin = (req,res)=>{
    try {
        res.render('login')
    } catch (error) {
        res.status(500).send({error});
    }
}
const viewProfile = (req,res)=>{
    const isAdmin = res.locals.user && res.locals.user.role === 'admin';
    try {
        res.render('profile',{
            user: res.locals.user,
            onlyAdmin: isAdmin
        })
    } catch (error) {
        res.status(500).send({error});
    }
}

export default{
    allProducts,
    realtimeproducts,
    oneProduct,
    viewAllProducts,
    viewOneCart,
    viewRegister,
    viewLogin,
    viewProfile
}