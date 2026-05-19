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
  background: #f0f2f5;
}

.layout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 60px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.header-nav {
  display: flex;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  color: #666;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background: #f5f7fa;
    color: #333;
  }

  &.router-link-active {
    background: #ecf5ff;
    color: #409eff;
    font-weight: 500;
  }
}

.nav-icon {
  font-size: 18px;
}

.nav-text {
  font-size: 14px;
}

.layout-main {
  flex: 1;
  overflow: hidden;
  padding: 16px;
}
</style>
