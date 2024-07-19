import { JSONSchemaType } from 'ajv';
import { FastifySchema, RouteHandlerMethod } from 'fastify';
import { Types } from 'mongoose';
import { menu_items } from '../../../../../../db/menu_items';

export interface GetParams {
  restaurant_id: string,
  menu_item_id: string,
}

const params_schema: JSONSchemaType<GetParams> = {
  type: 'object',
  properties: {
    restaurant_id: {
      type: 'string',
      minLength: 24,
      maxLength: 24,
    },
    menu_item_id: {
      type: 'string',
      minLength: 24,
      maxLength: 24,
    },
  },
  required: [
    'restaurant_id',
    'menu_item_id',
  ],
  additionalProperties: false,
};

export const GET_validation_schema: FastifySchema = {
  params: params_schema,
};

export const GET_handler: RouteHandlerMethod = async (request, reply) => {
  const params = request.params as GetParams;

  const fetch_res = await menu_items
    .aggregate()
    .match({
      _id: new Types.ObjectId(params.menu_item_id),
      restaurant_id: params.restaurant_id,
    })
    .exec();

  reply
    .status(200)
    .send({
      exists: !!fetch_res[0],
      data: fetch_res[0],
    });
};
