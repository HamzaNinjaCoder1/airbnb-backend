import jwt from "jsonwebtoken";
import { usersmodule } from "../Models/usersmodule.js";
import AppDataSource from "../config/db.js";

const userRepo = AppDataSource.getRepository(usersmodule);

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-2024';

export const authMiddleware = async (req, res, next) => {
    try{
        console.log('Auth middleware - cookies:', req.cookies);
        const token = req.cookies.token;
        if (!token) {
            console.log('No token found in cookies');
            return res.status(401).json({error: "Unauthorized - No token"});
        }
        console.log('Token found:', token);
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Decoded token:', decoded);
        const user = await userRepo.findOne({where: {id: decoded.userId}});
        if (!user) {
            console.log('User not found for ID:', decoded.userId);
            return res.status(401).json({error: "Unauthorized - User not found"});
        }
        console.log('User found:', user.id);
        req.user = user;
        next();
    }
    catch(error){
        console.log('Auth middleware error:', error.message);
        return res.status(401).json({error: "Unauthorized - Token invalid"});
    }
}
