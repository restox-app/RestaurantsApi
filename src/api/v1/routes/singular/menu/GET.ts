import { JSONSchemaType } from 'ajv';
import { FastifySchema, RouteHandlerMethod } from 'fastify';
import { menu_items } from '../../../../../db/menu_items';

export interface GetParams {
  restaurant_id: string,
}

export interface GetQuery {
  skip: number,
  limit: number,
}

const params_schema: JSONSchemaType<GetParams> = {
  type: 'object',
  properties: {
    restaurant_id: {
      type: 'string',
      minLength: 24,
      maxLength: 24,
    },
  },
  required: [
    'restaurant_id',
  ],
  additionalProperties: false,
};

const query_schema: JSONSchemaType<GetQuery> = {
  type: 'object',
  properties: {
    skip: {
      type: 'number',
      minimum: 0,
      maximum: 1000,
      default: 0,
    },
    limit: {
      type: 'number',
      minimum: 1,
      maximum: 100,
      default: 10,
    },
  },
  required: [
    'limit',
    'skip',
  ],
  additionalProperties: false,
};

export const GET_validation_schema: FastifySchema = {
  querystring: query_schema,
  params: params_schema,
};

export const GET_handler: RouteHandlerMethod = async (request, reply) => {
  const params = request.params as GetParams;
  const query = request.query as GetQuery;

  const fetch_res = await menu_items
    .aggregate()
    .match({
      restaurant_id: params.restaurant_id,
    })
    .sort({
      name: 1,
    })
    .skip(query.skip)
    .limit(query.limit + 1)
    .exec();

  const has_more = fetch_res.length > query.limit;

  reply
    .status(200)
    .send({
      has_more,
      data: fetch_res.slice(0, has_more ? -1 : fetch_res.length),
    });
};
