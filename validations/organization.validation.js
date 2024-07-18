import Joi from "joi";

const ulidPattern = /^[0-9A-HJKMNP-TV-Z]{26}$/;

const validateOrganizationData = (certificationData, schema) => {
  const { error } = schema.validate(certificationData);
  return error ? error.details[0].message : null;
}

const baseSchema = Joi.object({
  id: Joi.string().pattern(ulidPattern).optional().messages({
    'string.base': `"id" should be a type of 'text'`,
    'string.pattern.base': `"id" must be a valid ULID`
  }),
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  email: Joi.string().email().optional(),
  logo: Joi.object({
    path: Joi.string().uri().required(),
    filename: Joi.string().required()
  }).optional(),
  website: Joi.string().uri().optional().allow(null, ''),
  deletedAt: Joi.date().optional().allow(null),
});

const createOrganizationSchema = baseSchema.concat(Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
}))

export { baseSchema, createOrganizationSchema, validateOrganizationData };