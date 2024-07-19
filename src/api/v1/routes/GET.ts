import { JSONSchemaType } from 'ajv';
import { FastifySchema, RouteHandlerMethod } from 'fastify';
import { restaurants } from '../../../db/restaurants';

export interface GetQuery {
  skip: number,
  limit: number,
}

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
};

export const GET_handler: RouteHandlerMethod = async (request, reply) => {
  const query = request.query as GetQuery;

  const fetch_res = await restaurants
    .aggregate()
    .sort({
      createdAt: 1,
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
