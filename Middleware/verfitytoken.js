import jwt from "jsonwebtoken"


export const verifyToken = (req, res, next) => {

    let token = req.headers["token"]
    jwt.verify(token, "iti", async(err, decoaded) => {
        if (err) {
            res.status(401).json({ message: "Invalid token" })
        } else {
            req.user = decoaded
            next()
        }

    })


}