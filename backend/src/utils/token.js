import jwt from "jsonwebtoken";

/**
 * Creates a signed JWT with the public user identity used by the API.
 *
 * @param {{ id: number, name: string, email: string }} user
 * @returns {string}
 */
export function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    },
  );
}
