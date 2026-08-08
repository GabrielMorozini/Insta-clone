import { RouterLink, useRouter } from 'vue-router';

const router = useRouter();

function handleLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/login');
}

function handleCreate() {
  router.push('/posts/new');
}