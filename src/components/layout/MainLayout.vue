<template>
  <div class="main-layout">
    <header class="layout-header">
      <div class="header-left">
        <div class="logo">📷 摄像头系统</div>
      </div>
      <nav class="header-nav">
        <router-link to="/camera" class="nav-item">
          <span class="nav-icon">📷</span>
          <span class="nav-text">摄像头</span>
        </router-link>
        <router-link to="/media" class="nav-item">
          <span class="nav-icon">📁</span>
          <span class="nav-text">媒体库</span>
        </router-link>
        <router-link to="/inventory" class="nav-item">
          <span class="nav-icon">📋</span>
          <span class="nav-text">盘点管理</span>
        </router-link>
      </nav>
    </header>
    
    <main class="layout-main">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.main-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #0f0f1a;
}

.layout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 56px;
  background: #1a1a2e;
  border-bottom: 1px solid #2a2a3e;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  font-size: 18px;
  font-weight: 600;
  color: #e0e0e0;
  letter-spacing: 1px;
}

.header-nav {
  display: flex;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  color: #888;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.2s;
  font-size: 14px;

  &:hover {
    background: #252540;
    color: #e0e0e0;
  }

  &.router-link-active {
    background: rgba(64, 158, 255, 0.15);
    color: #409eff;
    font-weight: 500;
  }
}

.nav-icon {
  font-size: 16px;
}

.nav-text {
  font-size: 14px;
}

.layout-main {
  flex: 1;
  overflow: hidden;
  padding: 12px;
}
</style>
