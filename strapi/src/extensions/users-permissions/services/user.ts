import { factories } from '@strapi/strapi';

export default factories.createCoreService('plugin::users-permissions.user', ({ strapi }) => ({
  async create(data) {
    // Use the users schema connection
    const userDb = strapi.db.connections.users;
    
    // Create user in the separate schema
    const user = await userDb.query('plugin::users-permissions.user').create({
      data: {
        ...data,
        provider: 'local',
        confirmed: true,
        blocked: false,
      },
    });

    return user;
  },

  async findOne(params) {
    // Use the users schema connection
    const userDb = strapi.db.connections.users;
    
    // Find user in the separate schema
    const user = await userDb.query('plugin::users-permissions.user').findOne({
      where: params,
    });

    return user;
  },

  async update(id, data) {
    // Use the users schema connection
    const userDb = strapi.db.connections.users;
    
    // Update user in the separate schema
    const user = await userDb.query('plugin::users-permissions.user').update({
      where: { id },
      data,
    });

    return user;
  },

  async delete(id) {
    // Use the users schema connection
    const userDb = strapi.db.connections.users;
    
    // Delete user from the separate schema
    const user = await userDb.query('plugin::users-permissions.user').delete({
      where: { id },
    });

    return user;
  },
})); 