import { Request, Response } from 'express';
import {
    createBlog,
    getBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
} from './blog.service';
import { IBlogCreate, IBlogUpdate } from './blog.interface';

export const createBlogHandler = async (req: Request, res: Response) => {
    try {
        const blogData: IBlogCreate = req.body;
        const blog = await createBlog(blogData);
        res.status(201).json({
            message: 'Blog created successfully',
            blog,
        });
    } catch (error: any) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'A blog with this title already exists' });
        }
        res.status(500).json({
            error: 'Failed to create blog',
            details: error.message,
        });
    }
};

export const getBlogsHandler = async (req: Request, res: Response) => {
    try {
        const { category, search, sort = '-createdAt', page, limit } = req.query;
        const result = await getBlogs({
            category: category as string,
            search: search as string,
            sort: sort as string,
            page: page ? parseInt(page as string) : undefined,
            limit: limit ? parseInt(limit as string) : undefined,
        });
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({
            error: 'Failed to fetch blogs',
            details: error.message,
        });
    }
};

export const getBlogByIdHandler = async (req: Request, res: Response) => {
    try {
        const blog = await getBlogById(req.params.id);
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        res.status(200).json(blog);
    } catch (error: any) {
        res.status(500).json({
            error: 'Failed to fetch blog',
            details: error.message,
        });
    }
};

export const updateBlogHandler = async (req: Request, res: Response) => {
    try {
        const blog = await updateBlog(req.params.id, req.body);
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        res.status(200).json({
            message: 'Blog updated successfully',
            blog,
        });
    } catch (error: any) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'A blog with this title already exists' });
        }
        res.status(500).json({
            error: 'Failed to update blog',
            details: error.message,
        });
    }
};

export const deleteBlogHandler = async (req: Request, res: Response) => {
    try {
        await deleteBlog(req.params.id);
        res.status(200).json({
            message: 'Blog deleted successfully',
        });
    } catch (error: any) {
        res.status(500).json({
            error: 'Failed to delete blog',
            details: error.message,
        });
    }
};