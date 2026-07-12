import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import UserModel from '../model/UserModel.js'
dotenv.config()

async function authMiddleware(req, res, next) {
    let token = req.cookies.token;
    
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
        
        return res.status(401).json({ success: false, message: "Not authenticated, no token provided" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ success: false, message: "User no longer exists" });
        }
        req.user = user; // full user doc (minus password) available downstream
        next();
    }
    catch (err) {
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
}

function requireRole(...allowedRoles) {
    const roles = allowedRoles.flat().map(r => r.toLowerCase());
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({ success: false, message: "Forbidden: insufficient permissions" });
        }
        if (!roles.includes(req.user.role.toLowerCase())) {
            return res.status(403).json({ success: false, message: "Forbidden: insufficient permissions" });
        }
        next();
    };
}

export { authMiddleware, requireRole };
