import verifyJWT from "../utils/verifyJWT.js";
async function authenticate(req, res, next) {
    try {
        const tokenInHeaders = req.get("Authorization");
        const token = tokenInHeaders?.replace("Bearer ", "") || req.cookies.jwtToken;
        if (!token) {
            res.status(401).json({ errors: "invalid token" });
            return;
        }
        const decoded = await verifyJWT(token);
        res.locals.userId = decoded.userId;
        next();
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(401).json({ errors: err.message });
            return;
        }
        res.status(401).json({ errors: "authenticate failed" });
    }
}
export default authenticate;
