import AppDataSource from "../config/db.js";
import { usersmodule } from "../Models/usersmodule.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const userRepo = AppDataSource.getRepository(usersmodule);

export const createUser = async (req, res) => {
    const {first_name, last_name, email, password} = req.body;

    const fullName = `${first_name} ${last_name}`;

    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({error: "All fields are required"});
    }
    if (password.length < 8) {
        return res.status(400).json({error: "Password must be at least 8 characters long"});
    }
    if (!email.includes("@") || !email.includes(".")) {
        return res.status(400).json({error: "Invalid email address"});
    }
    if (await userRepo.findOne({where: {email}})) {
        return res.status(400).json({error: "Email already exists"});
    }
    if (!password.match(/[A-Z]/) || !password.match(/\d/) || !password.match(/[^a-zA-Z0-9]/)) {
        return res.status(400).json({error: "Password must contain at least one uppercase letter, one number, and one special character"});
    }
    const password_hash = await bcrypt.hash(password, 10);
    
    const newUser = await userRepo.create({
        name: fullName,
        first_name,
        last_name,
        email,
        password_hash
    });
    await userRepo.save(newUser);
    let token = jwt.sign({userId: newUser.id}, "your-super-secret-jwt-key-2024", {expiresIn: "12h"});
    res.cookie("token", token, {httpOnly: true, secure: false, maxAge: 12 * 60 * 60 * 1000});
    return res.status(201).json({message: "User created successfully", user: newUser});
}

export const checkemailexist = async (req, res) => {
    if (!req.body.email) {
        return res.status(400).json({error: "Email is required"});
    }
    const user = await userRepo.findOne({where: {email: req.body.email}});
    if (user) {
        return res.status(400).json({error: "Email already exists"});
    }
    return res.status(200).json({success: true, message: "Email is available"});
}

export const login = async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({error: "Email and password are required"});
    }
    const user = await userRepo.findOne({where: {email: email}});
    if (user) {
        const passwordmatch = await bcrypt.compare(password, user.password_hash);
        if (passwordmatch) {
            let token = jwt.sign({userId: user.id}, "your-super-secret-jwt-key-2024", {expiresIn: "12h"});
            res.cookie("token", token, {httpOnly: true, secure: false, maxAge: 12 * 60 * 60 * 1000});
            console.log("Session after login:", req.session);
            return res.status(200).json({success: true, message: "Login successful", token: token});
        } else {
            return res.status(400).json({error: "Invalid password"});
        }
    } else {
        return res.status(400).json({error: "User not found"});
    }
}

export const logout = async (req, res) => {
    try {
        // Clear auth token cookie
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
        });

        // Destroy session if present
        if (req.session) {
            req.session.destroy(() => {});
        }

        return res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Failed to logout" });
    }
}