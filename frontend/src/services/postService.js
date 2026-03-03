import api from './api';

const postService = {
  getAllPosts: async (pageNo = 0, pageSize = 10, sortBy = 'createdAt', sortDir = 'desc') => {
    const response = await api.get('/posts', {
      params: { pageNo, pageSize, sortBy, sortDir },
    });
    return response.data;
  },

  getPostBySlug: async (slug) => {
    const response = await api.get(`/posts/${slug}`);
    return response.data;
  },

  getPostById: async (id) => {
    const response = await api.get(`/posts/id/${id}`);
    return response.data;
  },

  getPostsByUser: async (userId, pageNo = 0, pageSize = 10) => {
    const response = await api.get(`/posts/user/${userId}`, {
      params: { pageNo, pageSize },
    });
    return response.data;
  },

  getPostsByCategory: async (categoryId, pageNo = 0, pageSize = 10) => {
    const response = await api.get(`/posts/category/${categoryId}`, {
      params: { pageNo, pageSize },
    });
    return response.data;
  },

  searchPosts: async (keyword, categoryId = null, pageNo = 0, pageSize = 10) => {
    const response = await api.get('/posts/search', {
      params: { keyword, categoryId, pageNo, pageSize },
    });
    return response.data;
  },

  createPost: async (postData) => {
    const response = await api.post('/posts', postData);
    return response.data;
  },

  updatePost: async (id, postData) => {
    const response = await api.put(`/posts/${id}`, postData);
    return response.data;
  },

  deletePost: async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },
};

export default postService;