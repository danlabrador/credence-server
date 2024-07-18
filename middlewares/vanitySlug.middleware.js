import slugify from 'slugify';
import { ulid } from 'ulid';
import User from "../models/user.model.js";

const generateUniqueSlug = async (req, res, next) => {
  const { firstName, lastName, email, vanitySlug } = req.body;

  let baseSlug = vanitySlug;

  if (!baseSlug) {
    // Generate base slug
    const baseSlugSource = firstName && lastName ? `${firstName} ${lastName}` : email.split('@')[0];
    baseSlug = slugify(baseSlugSource, {
      lower: true,
      remove: /[*+~.()'"!:@]/g,
    });
  }

  let slug = baseSlug;
  const maxAttempts = 10;
  let attempt = 0;

  // Use iterative approach to find unique slug
  while (attempt < maxAttempts) {
    try {
      const existingUser = await User.findOne({ vanitySlug: slug }).exec(); // Use exec() for better error handling
      if (!existingUser) {
        req.body.vanitySlug = slug;
        return next();
      } else {
        // Increase randomness by using a longer slice of ULID, ensuring higher uniqueness
        slug = `${baseSlug}-${ulid().slice(-12)}`; // Adjusted slice for more randomness
        attempt++;
      }
    } catch (error) {
      return next(error); // Improved error handling
    }
  }

  // If max attempts reached without finding a unique slug
  if (attempt >= maxAttempts) {
    // Enhanced user feedback
    return res.status(409).send({
      message: 'Unable to generate a unique slug after multiple attempts. Please try a different name or contact support for assistance.'
    });
  }
}

const checkVanitySlugUniqueness = async (req, res, next) => {
  let slugToCheck = req.body.vanitySlug;

  if (!slugToCheck) {
    return next();
  }

  try {
    const userWithSameSlug = await User.findOne({ vanitySlug: slugToCheck });
    if (userWithSameSlug) {
      return res.status(409).send({ message: 'Vanity slug is already taken.' });
    }
    return next();
  } catch (error) {
    return next(error);
  }
}

export { generateUniqueSlug, checkVanitySlugUniqueness };
