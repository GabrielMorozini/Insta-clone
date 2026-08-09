import api from './api';

export const postService = {
  getFeed(page = 1, perPage = 10) {
    return api.get('/feed', {
      params: { page, per_page: perPage },
    });
  },

  getUserPosts(userId, page = 1, perPage = 10) {
    return api.get(`/users/${userId}/posts`, {
      params: { page, per_page: perPage },
    });
  },

  createPost(formData) {
    return api.post('/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  deletePost(id) {
    return api.delete(`/posts/${id}`);
  },
};