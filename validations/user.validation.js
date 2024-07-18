import Joi from "joi";
import rolesEnum from "../enums/roleTypes.enum.js";

const validateUserData = (userData, schema) => {
  const { error } = schema.validate(userData);
  return error ? error.details[0].message : null;
}

const ulidPattern = /^[0-9A-HJKMNP-TV-Z]{26}$/;

// Base schema with common fields
const baseSchema = Joi.object({
  id: Joi.string().pattern(ulidPattern).optional().messages({
    'string.base': `"id" should be a type of 'text'`,
    'string.pattern.base': `"id" must be a valid ULID`
  }),
  firstName: Joi.string().optional(),
  middleName: Joi.string().optional().allow(null, ''),
  lastName: Joi.string().optional(),
  currentEmployer: Joi.string().optional().allow(null, ''),
  currentPosition: Joi.string().optional().allow(null, ''),
  birthYear: Joi.number().integer().min(1900).max(new Date().getFullYear()).optional(),
  country: Joi.string().optional(),
  city: Joi.string().optional(),
  zipCode: Joi.string().optional(),
  bio: Joi.string().optional(),
  websiteUrl: Joi.string().uri().optional().allow(null, ''),
  fbUrl: Joi.string().uri().optional().allow(null, ''),
  linkedinUrl: Joi.string().uri().optional().allow(null, ''),
  xUrl: Joi.string().uri().optional().allow(null, ''),
  roleId: Joi.string()
    .valid(...Object.values(rolesEnum).map(role => role._id))
    .optional()
    .messages({
      'string.base': `"roleId" should be a type of 'text'`,
      'any.required': `"roleId" is a required field`,
      'any.only': `"roleId" must be a valid role id`
    }),
});

const getUserSchema = Joi.object({
  vanitySlug: Joi.string().optional().messages({
    'string.base': `"vanitySlug" should be a type of 'text'`
  }),
  email: Joi.string().email().optional().messages({
    'string.base': `"email" should be a type of 'text'`
  }),
  id: Joi.string().pattern(ulidPattern).optional().messages({
    'string.base': `"id" should be a type of 'text'`,
    'string.pattern.base': `"id" must be a valid ULID`
  })
});

const getUserByIdSchema = Joi.object({
  id: Joi.string().pattern(ulidPattern).required().messages({
    'string.base': `"id" should be a type of 'text'`,
    'string.empty': `"id" cannot be an empty field`,
    'string.pattern.base': `"id" must be a valid ULID`,
    'any.required': `"id" is a required field`
  })
});

const createUserSchema = baseSchema.concat(Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
  vanitySlug: Joi.string().required(),
  role: Joi.string()
    .valid(...Object.values(rolesEnum).map(role => role.name))
    .required()
    .messages({
      'string.base': `"role" should be a type of 'text'`,
      'any.required': `"role" is a required field`,
      'any.only': `"role" must be a valid role id`
    }),
}));

const updateUserSchema = baseSchema.concat(Joi.object({
  email: Joi.string().email().optional(),
  password: Joi.string().min(5).optional(),
  vanitySlug: Joi.string().optional()
}));

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
});



export { baseSchema, validateUserData, createUserSchema as userSchema, loginSchema, updateUserSchema, getUserSchema, getUserByIdSchema };
