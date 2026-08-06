<template>
  <div id="app">

    <header class="topbar">
      <div class="logo">Instagram</div>
      <div class="icons">
        <button class="icon-btn" title="Novo post">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="4"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
        </button>
        <button class="icon-btn" title="Curtidas">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
        </button>
        <button class="icon-btn" title="Perfil">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>
        </button>
      </div>
    </header>

    <section class="profile-header">
      <div class="avatar-wrap">
        <img class="avatar" :src="user.avatar" alt="Foto de perfil">
      </div>
      <div class="profile-info">
        <div class="username-row">
          <h2>{{ user.username }}</h2>
          <button class="btn primary" v-if="!following" @click="following = true">Seguir</button>
          <button class="btn" v-else @click="following = false">Seguindo</button>
          <button class="btn">Mensagem</button>
          <button class="settings-btn" title="Configurações">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.6 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.6 1z"/></svg>
          </button>
        </div>

        <div class="stats">
          <div><b>{{ formatNumber(user.posts) }}</b> publicações</div>
          <div><b>{{ formatNumber(user.followers) }}</b> seguidores</div>
          <div><b>{{ formatNumber(user.followingCount) }}</b> seguindo</div>
        </div>

        <div class="bio">
          <div class="name">{{ user.name }}</div>
          <div>{{ user.bio }}</div>
          <a class="link" :href="'https://' + user.link" target="_blank">{{ user.link }}</a>
        </div>
      </div>
    </section>

    <div class="highlights">
      <div class="highlight" v-for="h in highlights" :key="h.title">
        <div class="circle"><img :src="h.img" alt=""></div>
        <span>{{ h.title }}</span>
      </div>
    </div>

    <nav class="tabs">
      <button class="tab" :class="{ active: activeTab === 'posts' }" @click="activeTab = 'posts'">
        <svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
        <span class="label">Publicações</span>
      </button>
      <button class="tab" :class="{ active: activeTab === 'reels' }" @click="activeTab = 'reels'">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 3v18M16 3v18M3 9h18M3 15h18"/></svg>
        <span class="label">Reels</span>
      </button>
      <button class="tab" :class="{ active: activeTab === 'tagged' }" @click="activeTab = 'tagged'">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2 2 8v13h6v-6h8v6h6V8z"/></svg>
        <span class="label">Marcadas</span>
      </button>
    </nav>

    <section class="grid" v-if="activeTab === 'posts'">
      <div class="post" v-for="post in posts" :key="post.id">
        <img :src="post.img" :alt="post.caption">
        <svg v-if="post.isVideo" class="pin" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        <div class="overlay">
          <div class="overlay-stat">
            <svg viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
            {{ formatNumber(post.likes) }}
          </div>
          <div class="overlay-stat">
            <svg viewBox="0 0 24 24"><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            {{ formatNumber(post.comments) }}
          </div>
        </div>
      </div>
    </section>

    <section v-else class="empty-state">
      <p>Nada para mostrar aqui ainda.</p>
    </section>

  </div>
</template>

<script>
export default {
  name: 'Profile',
  data() {
    return {
      following: false,
      activeTab: 'posts',
      user: {
        username: 'ana.viagens',
        name: 'Ana Ferreira',
        avatar: 'https://i.pravatar.cc/300?img=47',
        bio: '📍 Curitiba, PR\n✈️ Compartilhando roteiros e dicas de viagem\n📷 Fotografia amadora',
        link: 'ana-viagens.com',
        posts: 128,
        followers: 15400,
        followingCount: 312,
      },
      highlights: [
        { title: 'Praia', img: 'https://picsum.photos/seed/beach1/150/150' },
        { title: 'Trilhas', img: 'https://picsum.photos/seed/trail1/150/150' },
        { title: 'Comida', img: 'https://picsum.photos/seed/food1/150/150' },
        { title: 'Cidades', img: 'https://picsum.photos/seed/city1/150/150' },
        { title: 'Pets', img: 'https://picsum.photos/seed/pet1/150/150' },
      ],
      posts: Array.from({ length: 12 }).map((_, i) => ({
        id: i + 1,
        img: `https://picsum.photos/seed/post${i + 1}/500/500`,
        likes: Math.floor(Math.random() * 5000) + 100,
        comments: Math.floor(Math.random() * 200) + 5,
        isVideo: i % 4 === 0,
        caption: `Publicação ${i + 1}`,
      })),
    };
  },
  methods: {
    formatNumber(n) {
      if (n >= 1000000) return (n / 1000000).toFixed(1).replace('.0', '') + 'mi';
      if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'mil';
      return n.toString();
    },
  },
};
</script>

<style scoped>
* { box-sizing: border-box; margin: 0; padding: 0; }
#app {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background: #fafafa;
  color: #262626;
  max-width: 935px;
  margin: 0 auto;
}

/* Top bar */
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid #dbdbdb;
  background: #fff;
}
.topbar .logo { font-family: 'Brush Script MT', cursive; font-size: 24px; font-weight: 600; }
.topbar .icons { display: flex; gap: 18px; }
.icon-btn { background: none; border: none; cursor: pointer; padding: 4px; color: #262626; }
.icon-btn svg { width: 24px; height: 24px; }

/* Profile header */
.profile-header {
  display: flex;
  padding: 44px 20px 0 20px;
  gap: 8%;
  align-items: flex-start;
}
.avatar-wrap {
  flex: 0 0 auto;
  width: 150px;
  display: flex;
  justify-content: center;
}
.avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #dbdbdb;
}
.profile-info { flex: 1; min-width: 0; padding-top: 12px; }
.username-row {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.username-row h2 { font-size: 28px; font-weight: 300; }
.btn {
  padding: 7px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid #dbdbdb;
  background: #efefef;
  color: #262626;
}
.btn.primary {
  background: #0095f6;
  color: #fff;
  border: none;
}
.btn:hover { filter: brightness(0.95); }
.settings-btn { background: none; border: none; cursor: pointer; }
.settings-btn svg { width: 24px; height: 24px; }

.stats {
  display: flex;
  gap: 40px;
  margin-bottom: 20px;
  font-size: 16px;
}
.stats b { font-weight: 600; }

.bio { font-size: 14px; line-height: 1.5; white-space: pre-line; }
.bio .name { font-weight: 600; }
.bio .link { color: #00376b; font-weight: 600; text-decoration: none; }

/* Highlights */
.highlights {
  display: flex;
  gap: 24px;
  padding: 28px 20px 8px 20px;
  overflow-x: auto;
}
.highlight { text-align: center; flex: 0 0 auto; width: 84px; cursor: pointer; }
.highlight .circle {
  width: 77px;
  height: 77px;
  border-radius: 50%;
  border: 1px solid #dbdbdb;
  padding: 3px;
}
.highlight img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}
.highlight span {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #262626;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Tabs */
.tabs {
  display: flex;
  justify-content: center;
  border-top: 1px solid #dbdbdb;
  margin-top: 30px;
}
.tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 14px 24px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: #8e8e8e;
  cursor: pointer;
  border-top: 1px solid transparent;
  margin-top: -1px;
  text-transform: uppercase;
  background: none;
  border-left: none;
  border-right: none;
  border-bottom: none;
}
.tab.active { color: #262626; border-top-color: #262626; }
.tab svg { width: 12px; height: 12px; }

/* Grid */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  padding: 4px 0 60px 0;
}
.post {
  position: relative;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  cursor: pointer;
  background: #eee;
}
.post img { width: 100%; height: 100%; object-fit: cover; display: block; }
.post .overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.3);
  display: none;
  align-items: center;
  justify-content: center;
  gap: 24px;
  color: #fff;
  font-weight: 600;
}
.post:hover .overlay { display: flex; }
.overlay-stat { display: flex; align-items: center; gap: 6px; }
.overlay-stat svg { width: 18px; height: 18px; fill: #fff; }
.post .pin {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 18px;
  height: 18px;
  fill: #fff;
  filter: drop-shadow(0 0 2px rgba(0,0,0,0.6));
}

.empty-state {
  padding: 80px 20px;
  text-align: center;
  color: #8e8e8e;
}

@media (max-width: 700px) {
  .profile-header { padding: 24px 16px 0 16px; gap: 24px; }
  .avatar-wrap { width: 90px; }
  .avatar { width: 90px; height: 90px; }
  .username-row h2 { font-size: 20px; }
  .stats { gap: 22px; font-size: 14px; }
  .tab .label { display: none; }
}
</style>