import { isUserHasRole } from "../models/role.js";
const authorization = (roleName) => async (req, res, next) => {
    try {
        const userId = res.locals.userId;
        if (await isUserHasRole(userId, roleName)) {
            next();
            return;
        }
        res.status(403).json({ errors: "authorization failed" });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(403).json({ errors: err.message });
            return;
        }
        res.status(403).json({ errors: "authorization failed" });
    }
};
export default authorization;
