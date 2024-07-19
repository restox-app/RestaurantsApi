import { JSONSchemaType } from 'ajv';
import { FastifySchema, RouteHandlerMethod } from 'fastify';
import { Types } from 'mongoose';
import { restaurants } from '../../../../db/restaurants';

export interface GetParams {
  restaurant_id: string,
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

export const GET_validation_schema: FastifySchema = {
  params: params_schema,
};

export const GET_handler: RouteHandlerMethod = async (request, reply) => {
  const params = request.params as GetParams;

  const fetch_res = await restaurants
    .aggregate()
    .match({
      _id: new Types.ObjectId(params.restaurant_id),
    })
    .exec();

  reply
    .status(200)
    .send({
      exists: !!fetch_res[0],
      data: fetch_res[0],
    });
};
