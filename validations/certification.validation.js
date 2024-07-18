import Joi from 'joi';

const validateCertificationData = (certificationData, schema) => {
  const { error } = schema.validate(certificationData);
  return error ? error.details[0].message : null;
}

const ULID_PATTERN = /^[0-9A-HJKMNP-TV-Z]{26}$/;

const baseSchema = Joi.object({
  id: Joi.string().pattern(ULID_PATTERN).optional().messages({
    'string.base': `"id" should be a type of 'text'`,
    'string.pattern.base': `"id" must be a valid ULID`
  }),
  userId: Joi.string().pattern(ULID_PATTERN).optional().messages({
    'string.base': `"id" should be a type of 'text'`,
    'string.pattern.base': `"id" must be a valid ULID`
  }),
  certificateId: Joi.string().pattern(ULID_PATTERN).optional().messages({
    'string.base': `"id" should be a type of 'text'`,
    'string.pattern.base': `"id" must be a valid ULID`
  }),
  grade: Joi.number().integer().optional(),
  isPublic: Joi.boolean().optional(),
  issuedAt: Joi.date().optional(),
  acceptedAt: Joi.date().optional().allow(null),
  rejectedAt: Joi.date().optional().allow(null),
  expiredAt: Joi.date().optional(),
  deletedAt: Joi.date().optional()
});

const certificationSchema = baseSchema.concat(Joi.object({
  userId: Joi.string().pattern(ULID_PATTERN).required().messages({
    'string.base': `"id" should be a type of 'text'`,
    'string.pattern.base': `"id" must be a valid ULID`
  }),
  certificateId: Joi.string().pattern(ULID_PATTERN).required().messages({
    'string.base': `"id" should be a type of 'text'`,
    'string.pattern.base': `"id" must be a valid ULID`
  })
}));

const updateCertificationSchema = baseSchema.concat(Joi.object({
  id: Joi.string().pattern(ULID_PATTERN).optional().disallow(null).messages({
    'string.base': `"id" should be a type of 'text'`,
    'string.pattern.base': `"id" must be a valid ULID`,
    'any.invalid': `"id" cannot be null`
  }),
  userId: Joi.string().pattern(ULID_PATTERN).optional().disallow(null).messages({
    'string.base': `"userId" should be a type of 'text'`,
    'string.pattern.base': `"userId" must be a valid ULID`,
    'any.invalid': `"userId" cannot be null`
  }),
  certificateId: Joi.string().pattern(ULID_PATTERN).optional().disallow(null).messages({
    'string.base': `"certificateId" should be a type of 'text'`,
    'string.pattern.base': `"certificateId" must be a valid ULID`,
    'any.invalid': `"certificateId" cannot be null`
  }),
}));

export { validateCertificationData, baseSchema, certificationSchema }
