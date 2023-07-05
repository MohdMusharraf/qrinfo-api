import http from "http";
import app from "./app.js";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import QRCode from "qrcode";

const allowCors = (fn) => async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

const server = http.createServer(app);

dotenv.config({ path: "./config.env" });

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors({
    origin: ["http://localhost:3000", "https://qr-info-client.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true
}));

app.get("/", (req, res) => {
    res.send("Hello to QR Code Generator API");
    }
);

const DB = process.env.CONNECTION_URL;

const PORT = process.env.PORT || 5000;

mongoose.set("strictQuery", true);

mongoose
    .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    .catch((error) => console.log(error.message));

const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    contact: String,
    age: String,
    compName: String,
    jobDes: String,
    address: String,
    website: String,
    twitter: String,
    linkedin: String,
    github: String,
    instagram: String,
    facebook: String,
    title: String,
    note: String,
});

const User = mongoose.model("User", userSchema);

app.get("/users", allowCors((req, res) => {
    User.find(function (err, users) {
        if (err) {
            console.log(err);
        } else {
            res.json(users);
        }
    });

    console.log("Users fetched");
}));

app.post("/users", allowCors((req, res) => {
    const user = new User({
        fullName: req.body.fullName,
        email: req.body.email,
        contact: req.body.contact,
        age: req.body.age,
        compName: req.body.compName,
        jobDes: req.body.jobDes,
        address: req.body.address,
        website: req.body.website,
        twitter: req.body.twitter,
        linkedin: req.body.linkedin,
        github: req.body.github,
        instagram: req.body.instagram,
        facebook: req.body.facebook,
        title: req.body.title,
        note: req.body.note,
    });
    user.save();
    console.log("User saved");
}));

app.get("/users/:infoID", allowCors((req, res) => {
    User.findOne({_id: req.params.infoID}, function(err, foundUser){
        if(foundUser){
            res.send(foundUser);
        }
        else{
            res.send("No User Found");
        }
    });
}));

app.get("/qrcode", allowCors((req, res) =>{
    QRCode.toDataURL ('https://qr-info-client.vercel.app/userinfo',{scale: "10"}, function (err, url){
                if(err) throw err
                res.send(url)
    });
    console.log("QR fetched");
}));

// Rest of the code remains unchanged
// ...
