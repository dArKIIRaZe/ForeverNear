// src/api/user-videos/controllers/user-videos.ts

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::user-videos.user-videos', ({ strapi }) => ({
  async create(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('You must be logged in to upload.');
    }

    ctx.request.body.data = {
      ...ctx.request.body.data,
      user: user.id,         // ✅ correct relational ID
      user_email: user.email // ✅ optional plain-text email field
    };

    const response = await super.create(ctx);
    return response;
  },
}));
