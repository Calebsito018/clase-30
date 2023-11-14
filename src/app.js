import express from "express"
import { Server } from "socket.io";
import handlebars from "express-handlebars"
import { __dirname } from "./utils.js"
import messagesModel from "./DAL/mongoDB/models/messages.model.js"
import { productManager } from "./DAL/DAOs/MongoDAOs/products.manager.dao.js"
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"
import chatRouter from "./routes/chat.router.js"
import viewsRouter from "./routes/views.router.js"
import sessionRouter from "./routes/sessions.router.js"
import usersAuth from "./routes/usersAuth.router.js"
import passport from "passport";
import "./DAL/mongoDB/dbConfig.js"
import "./services/passportStrategies.js"
import session from "express-session"
import MongoStore from "connect-mongo";
import config from "./config/config.js"
import messageRouter from "./routes/messages.router.js"

const app = express()

app.use(session({
    store: new MongoStore({
        mongoUrl: config.mongo_uri,
        ttl: 3600
    }),
    secret:"secretCoder",
    resave: false,
    saveUninitialized:false
}))

//passport config
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

//handlebars config
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + "/views");

//routes
app.use("/", viewsRouter);
app.use("/chat", chatRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/products", productsRouter);
app.use("/api/session", sessionRouter);
app.use("/api/users", usersAuth)
app.use("/api/sendmessage", messageRouter)

const PORT = config.port
const httpServer = app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
})

const socketServer = new Server(httpServer)

socketServer.on("connection", (socket) => {
    // console.log(`Usuario conectado ${socket.id}`)
    // Escuchar el evento de agregar un nuevo producto
    socket.on("newProduct", async (product) => {
        try {
            const newProduct = await productManager.createOne(product);
            if (newProduct) {
                socketServer.emit("newProductAdded", newProduct);
            }
        } catch (error) {
            console.log(error)
        }
    });
    // Escuchar el evento de eliminar un producto
    socket.on("deleteProduct", async (productId) => {
        try {
            const deleteProduct = await productManager.deleteOne(productId);
            socketServer.emit("productDeleted", productId);
        } catch (error) {
            console.log(error)
        }
    });
    socket.on("disconnect",() => {
        // console.log(`Usuario desconectado ${socket.id}`);
    });
    //recibo el apodo y envio a chatApp.js para activar toast
    socket.on('newUser', (userName) => {
        socket.broadcast.emit('userConnected', userName);
    });
    //escucho y guardo mensajes en mongo que llegan del form de chatApp.js
    socket.on('chatMessage', async(messageData) => {
        const { user, message } = messageData;
        const newMessage = new messagesModel({ user, message });
        await newMessage.save();
        // Emitir esos usuarios y mensajes al chatApp.js
        socketServer.emit('returnMessage', { user, message });
    });
})
