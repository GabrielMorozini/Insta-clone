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

  likePost(postId) {
    return api.post(`/posts/${postId}/like`);
  },

  unlikePost(postId) {
    return api.delete(`/posts/${postId}/like`);
  },

  getComments(postId) {
    return api.get(`/posts/${postId}/comments`);
  },

  addComment(postId, content) {
    return api.post(`/posts/${postId}/comments`, { content });
  },

  updateComment(commentId, content) {
    return api.put(`/comments/${commentId}`, { content });
  },

  deleteComment(commentId) {
    return api.delete(`/comments/${commentId}`);
  },
};