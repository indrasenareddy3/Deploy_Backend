import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Car from "../models/Car.js";

// Generate JWT Token
const generateToken = (userID) => {
    return jwt.sign({ id: userID }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Register User
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password || password.length < 8) {
            return res.status(400).json({ success: false, message: "Fill all fields and password must be at least 8 characters" });
        }

        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });

        const token = generateToken(user._id.toString());
        res.status(201).json({ success: true, message: "User created successfully", token });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Login User
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please provide email and password" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = generateToken(user._id.toString());
        res.json({ success: true, message: "Login successful", token });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get user data using token(jwt)
export const getUserData = async (req, res) => {
    try {
        const { user } = req; // req.user is set by JWT middleware
        res.json({ success: true, user });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all available cars
export const getCars = async (req, res) => {
    try {
        const cars = await Car.find({ isAvailable: true }); // check schema spelling
        res.json({ success: true, cars });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};



// import User from "../models/User.js";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import Car from "../models/Car.js";

// // Generate JWT Token
// const generateToken = (userID)=>{
//     const payload = userID;
//     return jwt.sign(payload, process.env.JWT_SECRET)
// }

// // Register User

// export const registerUser = async (req, res) =>{
//     try{
//         const {name, email, password} = req.body;
//         if (!name || !email || !password || password.length <8){
//             return res.json({success: false, message: 'fill all the fields'})
//         }
//         const userExist = await User.findOne({email})
//         if (userExist){
//             return res.json({success: false, message: 'user already exist'})
//         }
//         const hashedpassword = await bcrypt.hash(password, 10)
//         const user = await User.create({name, email, password: hashedpassword})

//         const token = generateToken(user._id.toString())
//         res.json({success: true, message: 'user created', token})
//     } catch (error){
//         console.log(error.message);
//         res.json({success: false, message:error.message })
        
//     }


// }

// // Login User

// export const loginUser = async (req, res) =>{
//     try{

//         const {email, password} = req.body;
//         const user = await User.findOne({email})
//         if (!user){
//             return res.json({success: false, message: "user not found"})
//         }
//         const isMatch = await bcrypt.compare(password, user.password)
//         if(!isMatch){
//              return res.json({success: false, message: "invalid Credentials"})
//         }
//         const token = generateToken(user._id.toString())
//         res.json({success: true, message: 'user created', token})

//     } catch(error){
//         console.log(error.message);
//         res.json({success: false, message:error.message })

//     }
// }

// // Get user data using token(jwt)

// export const getUserData = async (req, res) =>{
//     try {
//         const {user} = req;
//         res.json({success: true, user})
//     } catch (error) {
//         console.log(error.message);
//         res.json({success: false, message:error.message })
//     }
// }

// // get all cars for the frontend

// export const getCars = async(req, res)=>{
//     try {
//         const cars= await Car.find({isAvaliable: true})
//         res.json({success: true, cars})
//     } catch (error) {
//         console.log(error.message);
//         res.json({success: false, message:error.message })
//     }
// }