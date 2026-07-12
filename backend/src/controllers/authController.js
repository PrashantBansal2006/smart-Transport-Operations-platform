import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import UserModel from '../model/UserModel.js'
dotenv.config()

async function register(req,res){
    const { name , email, password, role, depotName } = req.body;
    if (!name || !email || !password || !role) {
        return res.status(400).json({ success : false, message: "Please provide all required fields" });
    }

    try{
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success : false, message: "User already exists" });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword,
            role,
            depotName
        });

        await newUser.save();
        const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7*24*60*60*1000 // 7 days
        });

        res.status(201).json({ success : true, message: "User registered successfully", token });
    }
    catch(err){
        console.log(err)
        res.status(500).json({ success : false, message: "Server error" });
    }

}

async function login(req,res){
    const { email, password } = req.body;

    try{
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success : false, message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success : false, message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7*24*60*60*1000 // 7 days
        });

        res.status(200).json({ success : true, message: "Login successful", token });
    }
    catch(err){
        console.log(err)
        res.status(500).json({ success : false, message: "Server error" });
    }   
}

async function logout(req, res) {
    try{
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        });
        res.status(200).json({
            success: true,
            message: "User logged out successfully"
        });
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export { register, login, logout }