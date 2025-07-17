import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret123';

export const verifyToken = (req, res, next) => {
    console.log("🔐 Incoming request to protected route");
  const authHeader = req.headers.authorization;
    console.log("🔐 Authorization header received:", authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'Access denied' });

  const token = authHeader.split(' ')[1];

  try {
  const decoded = jwt.verify(token, JWT_SECRET);
  console.log("✅ Token verified:", decoded);
  req.user = decoded;
  next();
} catch (err) {
  console.error("❌ JWT verification failed:", err.message);
  return res.status(401).json({ message: 'Invalid or expired token' });
}

};
