import { cache } from "../utils/cache.js";
const QUOTA = Number(process.env.RATE_LIMITER_QUOTA) || 1000;
const WINDOW = Number(process.env.RATE_LIMITER_WINDOW) || 60;
async function isExcessQuota(token) {
    const results = await cache
        .multi()
        .set(token, 0, "EX", WINDOW, "NX")
        .incr(token)
        .exec();
    const count = results?.[1][1];
    if (typeof count === "number" && count > QUOTA) {
        return true;
    }
    return false;
}
const rateLimiter = async (req, res, next) => {
    try {
        const token = req.ip;
        if (await isExcessQuota(token)) {
            res.status(429).send(`Quota of ${QUOTA} per ${WINDOW}sec exceeded`);
            return;
        }
        next();
    }
    catch (e) {
        console.error(e);
        next();
    }
};
export default rateLimiter;
