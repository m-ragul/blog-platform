import api from './api';

const likeService = {
  toggleLike: async (postId) => {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  },

  getLikeStatus: async (postId) => {
    const response = await api.get(`/posts/${postId}/like/status`);
    return response.data;
  },

  getLikesCount: async (postId) => {
    const response = await api.get(`/posts/${postId}/likes/count`);
    return response.data;
  },
};

export default likeService;