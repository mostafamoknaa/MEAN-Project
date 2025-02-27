import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const token = req.headers["token"];

    if (!token) {
        return res.status(401).json({ message: "Access Denied: No Token Provided" });
    }

    try {
        const decodedd = jwt.verify(token, 'iti'); 
        console.log(decodedd)
        req.user = decodedd;
        next();
    } catch (e) {
        res.status(400).json({ message: "Invalid Token" });
    }
};

export default authMiddleware;
