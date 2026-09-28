import Scheme from '../../models/Scheme.js';

/**
 * SchemeService — data access for schemes.
 */

export async function getAllSchemes({ q, category, state, page = 1, limit = 20 }) {
  const filter = { isActive: true };

  if (category) filter.category = category;
  if (state) filter.state = { $in: [state, 'ALL'] };
  if (q) filter.$text = { $search: q };

  const skip = (page - 1) * limit;

  const [schemes, total] = await Promise.all([
    Scheme.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Scheme.countDocuments(filter),
  ]);

  return {
    schemes,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getSchemeById(id) {
  return Scheme.findById(id);
}

export async function getSchemesByIds(ids) {
  return Scheme.find({ _id: { $in: ids }, isActive: true });
}

export async function createScheme(data) {
  return Scheme.create(data);
}

export async function updateScheme(id, data) {
  return Scheme.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}
