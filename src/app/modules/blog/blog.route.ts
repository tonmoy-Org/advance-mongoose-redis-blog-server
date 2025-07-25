import { Router } from 'express';
import {
    createBlogHandler,
    getBlogsHandler,
    getBlogByIdHandler,
    updateBlogHandler,
    deleteBlogHandler,
} from './blog.controller';

const router = Router();

router.post('/', createBlogHandler);
router.get('/', getBlogsHandler);
router.get('/:id', getBlogByIdHandler);
router.put('/:id', updateBlogHandler);
router.delete('/:id', deleteBlogHandler);

export const BlogRoutes = router;