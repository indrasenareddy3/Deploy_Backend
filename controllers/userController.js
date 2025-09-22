import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Car from "../models/Car.js";

// Generate JWT Token
const generateToken = (userID)=>{
    const payload = userID;
    return jwt.sign(payload, process.env.JWT_SECRET)
}

// Register User

export const registerUser = async (req, res) =>{
    try{
        const {name, email, password} = req.body;
        if (!name || !email || !password || password.length <8){
            return res.json({success: false, message: 'fill all the fields'})
        }
        const userExist = await User.findOne({email})
        if (userExist){
            return res.json({success: false, message: 'user already exist'})
        }
        const hashedpassword = await bcrypt.hash(password, 10)
        const user = await User.create({name, email, password: hashedpassword})

        const token = generateToken(user._id.toString())
        res.json({success: true, message: 'user created', token})
    } catch (error){
        console.log(error.message);
        res.json({success: false, message:error.message })
        
    }


}

// Login User

export const loginUser = async (req, res) =>{
    try{

        const {email, password} = req.body;
        const user = await User.findOne({email})
        if (!user){
            return res.json({success: false, message: "user not found"})
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
             return res.json({success: false, message: "invalid Credentials"})
        }
        const token = generateToken(user._id.toString())
        res.json({success: true, message: 'user created', token})

    } catch(error){
        console.log(error.message);
        res.json({success: false, message:error.message })

    }
}

// Get user data using token(jwt)

export const getUserData = async (req, res) =>{
    try {
        const {user} = req;
        res.json({success: true, user})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message:error.message })
    }
}

// get all cars for the frontend

export const getCars = async(req, res)=>{
    try {
        const cars= await Car.find({isAvaliable: true})
        res.json({success: true, cars})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message:error.message })
    }
}