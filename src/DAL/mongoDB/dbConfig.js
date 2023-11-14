import mongoose from "mongoose";
import config from "../../config/config.js";

const URI = config.mongo_uri;

mongoose.connect(URI)
.then(() => console.log("Connected to Database"))
.catch(error => console.log(error))