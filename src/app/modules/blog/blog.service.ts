import { Blog } from '../blog.model';
import { IBlog, IBlogCreate, IBlogUpdate } from './blog.interface';
import { setCache, getCache, connectRedis } from '../../config/redis';

const CACHE_EXPIRATION = 3600; // 1 hour

async function clearBlogCaches(): Promise<void> {
    // Note: Without direct client access, we can't clear by pattern
    // This is a limitation of the current Redis wrapper
    // Consider either:
    // 1. Exporting the client from redis config, or
    // 2. Adding a clearCacheByPattern function to your redis wrapper
    console.warn('Cache clearance not implemented - need Redis client access');
}

export const createBlog = async (blogData: IBlogCreate): Promise<IBlog> => {
    const blog = await Blog.create(blogData);
    await clearBlogCaches();
    return blog;
};

export const getBlogs = async (filters: {
    category?: string;
    search?: string;
    sort?: string;
    page?: number;
    limit?: number;
}): Promise<{ total: number; blogs: IBlog[] }> => {
    const { category, search, sort = '-createdAt', page, limit } = filters;
    const cacheKey = `blogs:${category || 'all'}:${search || 'none'}:${sort}:${page || 'all'}:${limit || 'all'}`;

    const cachedData = await getCache(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    const query: any = {};
    if (category) query.category = category;
    if (search) query.$text = { $search: search };

    const mongoQuery = Blog.find(query).sort(sort).select('-__v');

    if (page && limit) {
        mongoQuery.skip((page - 1) * limit).limit(limit);
    }

    const blogs = await mongoQuery.lean();
    const total = await Blog.countDocuments(query);

    const result = { total, blogs };
    await setCache(cacheKey, result, CACHE_EXPIRATION);

    return result;
};

export const getBlogById = async (id: string): Promise<IBlog | null> => {
    const cacheKey = `blog:${id}`;
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    const blog = await Blog.findOne({ title_id: id }).lean();
    if (blog) {
        await setCache(cacheKey, blog, CACHE_EXPIRATION);
    }
    return blog;
};

export const updateBlog = async (
    id: string,
    updateData: IBlogUpdate
): Promise<IBlog | null> => {
    const blog = await Blog.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    });

    if (blog) {
        await clearBlogCaches();
    }

    return blog;
};

export const deleteBlog = async (id: string): Promise<void> => {
    await Blog.findByIdAndDelete(id);
    await clearBlogCaches();
};