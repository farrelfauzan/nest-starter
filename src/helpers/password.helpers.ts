import bcrypt from 'bcrypt';
/**
 * generate hash from password or string
 * @param {string} password
 * @returns {string}
 */

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export function validateHash(
  password: string | undefined,
  hash: string | undefined,
): Promise<boolean> {
  if (!password || !hash) {
    return Promise.resolve(false);
  }
  return bcrypt.compare(password, hash);
}
