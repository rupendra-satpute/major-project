const mongoose= require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(()=> {
    console.log("MongoDB connected successfully");

})
.catch((err)=> {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

//pahle vala sara data delete krne k liye 
const initDB = async() =>{
    await Listing.deleteMany({});   //koi condition nhi diya sare data delete krne k liye
    initData.data =initData.data.map((obj) => ({...obj, owner: "69d894bd9f6c17e022911fb8"}))  //data ke sath owner ka id bhi add kr diya
    await Listing.insertMany(initData.data); //data insert krne k liye
    console.log("Database was initialized ");
};

initDB(); //function call kr denge