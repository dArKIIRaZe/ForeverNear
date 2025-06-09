import { factories } from '@strapi/strapi';
import bcrypt from 'bcryptjs';

export default factories.createCoreController('api::user.user', ({ strapi }) => ({
  async register(ctx) {
    const { email, password, username, userId } = ctx.request.body;

    // Check if user already exists
    const existingUser = await strapi.db.query('api::user.user').findOne({
      where: { email },
    });

    if (existingUser) {
      return ctx.badRequest('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await strapi.db.query('api::user.user').create({
      data: {
        email,
        username,
        userId,
        password: hashedPassword,
      },
    });

    // Generate JWT token
    const token = strapi.plugins['users-permissions'].services.jwt.issue({
      id: user.id,
    });

    return {
      jwt: token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        userId: user.userId,
      },
    };
  },

  async login(ctx) {
    const { identifier, password } = ctx.request.body;

    // Find user
    const user = await strapi.db.query('api::user.user').findOne({
      where: { email: identifier },
    });

    if (!user) {
      return ctx.badRequest('Invalid credentials');
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return ctx.badRequest('Invalid credentials');
    }

    // Generate JWT token
    const token = strapi.plugins['users-permissions'].services.jwt.issue({
      id: user.id,
    });

    return {
      jwt: token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        userId: user.userId,
      },
    };
  },
})); 