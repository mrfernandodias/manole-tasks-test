import bcrypt from "bcryptjs";

export async function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

export async function comparePassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}
