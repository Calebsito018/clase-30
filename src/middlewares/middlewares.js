import { userModel } from '../DAL/mongoDB/models/users.model.js'
import { cartModel } from '../DAL/mongoDB/models/carts.model.js';
//Middleware para obtener la data del usuairo y guardarla para usarla en distintos endpoints
export const getUserData = async (req, res, next) => {
    let userData = null;
    if (req.isAuthenticated()) {
        userData = req.user ? req.user.toObject() : null;
    } else {
        userData = req.session.user || null;
    }

    // // Verifica si el usuario tiene un carrito asignado
    // if (!userData.cart) {
    //     // Si el usuario no tiene un carrito, crea uno y asígnalo
    //     const newCart = new cartModel({
    //         user: userData._id,
    //         products: [], // Inicialmente, el carrito está vacío
    //     });
    //     await newCart.save();
    //     userData.cart = newCart._id; // Asigna el ID del carrito al usuario
    //     await userModel.findByIdAndUpdate(userData._id, { cart: newCart._id });
    // }

    // Almacena los datos del usuario en res.locals para usar en las vistas
    res.locals.user = userData;
    // console.log(` USER DATA ${JSON.stringify(userData)}`)
    // almaceno los datos del usuario en res.locals para que esten disponibles en las vistas
    res.locals.user = userData;
    next();
}
// Middleware para verificar la sesión, si no existe manda a login
export const checkSession = (req, res, next) => {
    // console.log(` USER DATA ${JSON.stringify(req.session.user)}`)

    if (!req.isAuthenticated() && !req.session.user) {
        console.log('Usuario no identificado');
        return res.redirect('/login')
    }
    next();
};
// Middleware para verificar role de admin, si no es manda a vista de productos
export const checkAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user && req.user.role === 'admin') {
        next();
    } else if (req.session.user && req.session.user.role === 'admin') {
        next();
    } else {
        res.redirect('/view/products')
    }
}
export const publicAcces = (req, res, next) => {
    if (req.isAuthenticated() || req.session.user) {
        return res.redirect('/view/products')
    }
    next();
}
export const privateAcces = (req, res, next) => {
    if (!req.isAuthenticated() && !req.session.user) {
        return res.redirect('/login')
    }
    next();
}



// // Middleware para obtener el CID (Carrito ID) del usuario
// export const getCartIdForUser = async (req, res, next) => {
//     if (req.isAuthenticated()) {
//         // Si el usuario estaa autenticado, obten el carrito asociado a su ID de usuario
//         const userId = req.user._id;
//         try {
//             const cart = await cartModel.findOne({ user: userId });
//             if (cart) {
//                 // Si se encontro un carrito almacena su _id en res.locals para usarlo en la ruta
//                 res.locals.cartId = cart._id;
//             }
//         } catch (error) {
//             console.error('Error al obtener el carrito del usuario:', error);
//         }
//     }
//     next();
// };


// Middleware para verificar la sesión y el rol de user
export const checkUserSession = (req, res, next) => {
    if (req.isAuthenticated() && req.user && req.user.role === 'user') {
        next(); // accede solo rol user
    } else if (req.session.user && req.session.user.role === 'user') {
        next(); // accede solo rol user
    } else {
        res.redirect('/view/products'); // manda a la vista de productos para otros usuarios
    }
};
export const checkAdminSession = (req, res, next) => {
    if (req.isAuthenticated() && req.user && req.user.role === 'admin') {
        next(); // accede solo rol admin
    } else if (req.session.user && req.session.user.role === 'admin') {
        next(); // accede solo rol admin
    } else {
        res.redirect('/view/products'); // manda a la vista de productos para otros usuarios
    }
};