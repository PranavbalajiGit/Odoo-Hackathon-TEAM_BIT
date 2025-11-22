const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { z } = require('zod');
const { User } = require('../models');

const signupSchema = z.object({
  loginId: z.string().min(6).max(12),
  email: z.string().email(),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
});

const loginSchema = z.object({
  loginIdOrEmail: z.string(),
  password: z.string(),
});

class AuthController {
  static async signup(req, res) {
    try {
      const { loginId, email, password } = signupSchema.parse(req.body);

      const existingUser = await User.findOne({
        where: { [require('sequelize').Op.or]: [{ loginId }, { email }] },
      });
      if (existingUser) {
        return res.status(400).json({ error: 'Login ID or email already exists' });
      }

      const user = await User.create({ loginId, email, passwordHash: password }); // passwordHash will be hashed by User.beforeCreate hook
      const token = jwt.sign({ id: user.id, loginId: user.loginId, email: user.email, role: user.role }, process.env.JWT_SECRET);

      res.status(201).json({ 
        token,
        user: {
          id: user.id,
          loginId: user.loginId,
          email: user.email,
          role: user.role,
        }
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async login(req, res) {
    try {
      const { loginIdOrEmail, password } = loginSchema.parse(req.body);

      const user = await User.findOne({
        where: { [require('sequelize').Op.or]: [{ loginId: loginIdOrEmail }, { email: loginIdOrEmail }] },
      });
      if (!user || !user.isActive || !(await user.checkPassword(password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id, loginId: user.loginId, email: user.email, role: user.role }, process.env.JWT_SECRET);
      res.json({ 
        token,
        user: {
          id: user.id,
          loginId: user.loginId,
          email: user.email,
          role: user.role,
        }
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = AuthController;