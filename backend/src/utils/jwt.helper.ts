import loadConfig from 'src/configs';
import * as jwt from 'jsonwebtoken';

export const generateJwtToken = (payload, ttl = 60 * 60 * 24 * 7) =>
  jwt.sign(payload, loadConfig.jwt.jwtSecret, { expiresIn: ttl });

export const verifyToken = (payload) =>
  jwt.verify(payload, loadConfig.jwt.jwtSecret);
