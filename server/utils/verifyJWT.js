import jwt from "jsonwebtoken";
import { z } from "zod";
const JWT_KEY = process.env.JWT_KEY || "";
const DecodedSchema = z.object({
    userId: z.number(),
});
export default function verifyJWT(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_KEY, (err, decoded) => {
            try {
                if (err)
                    reject(err);
                const result = DecodedSchema.parse(decoded);
                resolve(result);
            }
            catch (err) {
                reject(new Error("invalid decoded value"));
            }
        });
    });
}
