import { FastifyPluginAsync } from 'fastify';

import * as index from './routes';

export const v1: FastifyPluginAsync = async (instance, _opts) => {
  instance.route({
    url: '/',
    method: 'GET',
    schema: index.GET_validation_schema,
    handler: index.GET_handler,
  });

  instance.route({
    url: '/:restaurant_id',
    method: 'GET',
    schema: index.singular.GET_validation_schema,
    handler: index.singular.GET_handler,
  });

  instance.route({
    url: '/:restaurant_id/menu',
    method: 'GET',
    schema: index.singular.menu.GET_validation_schema,
    handler: index.singular.menu.GET_handler,
  });

  instance.route({
    url: '/:restaurant_id/menu/:menu_item_id',
    method: 'GET',
    schema: index.singular.menu.singular.GET_validation_schema,
    handler: index.singular.menu.singular.GET_handler,
  });
};
