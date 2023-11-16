import { Redis } from "ioredis";
export const cache = new Redis({
    port: 6379,
    host: process.env.REDIS_HOST,
    username: process.env.REDIS_USER,
    password: process.env.REDIS_PASSWORD,
    commandTimeout: 300,
});
export async function get(key) {
    try {
        const result = await cache.get(key);
        return result;
    }
    catch (err) {
        return null;
    }
}
export async function set(key, value) {
    try {
        const result = await cache.set(key, value);
        return result;
    }
    catch (err) {
        return null;
    }
}
export async function del(key) {
    try {
        const result = await cache.del(key);
        return result;
    }
    catch (err) {
        return null;
    }
}
export const getCampaignKey = () => {
    return "campaigns";
};
