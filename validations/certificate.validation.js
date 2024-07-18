import Joi from 'joi';

const ulidPattern = /^[0-9A-HJKMNP-TV-Z]{26}$/;

const baseSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  criteria: Joi.array().items(Joi.string()).optional(),
  skills: Joi.array().items(Joi.string()).optional(),
});

const getCertificateSchema = baseSchema.concat(Joi.object({
  id: Joi.string().pattern(ulidPattern).required().messages({
    'string.base': `"id" should be a type of 'text'`,
    'string.empty': `"id" cannot be an empty field`,
    'string.pattern.base': `"id" must be a valid ULID`
  }),
}));

const addCertificateSchema = baseSchema.concat(Joi.object({
  name: Joi.string().required()
}));

const validateCertificateData = (certificateData, type = '') => {
  let validationOutcome, error; // Declare error here for block scope
  switch (type) {
    case 'getCertificateSchema':
      validationOutcome = getCertificateSchema.validate(certificateData);
      error = validationOutcome.error;
      break;
    case 'addCertificateSchema':
      validationOutcome = addCertificateSchema.validate(certificateData);
      error = validationOutcome.error;
      break;
    default:
      validationOutcome = baseSchema.validate(certificateData);
      error = validationOutcome.error;
  }
  return error ? error.details[0].message : null;
}

export { validateCertificateData };
