<template>
  <el-container class="main-layout-container">
    <el-aside class="side-bar">
      <router-link tag="div" to="meetings" class="logo">Meets</router-link>
      <el-menu :default-openeds="['1', '3']" class="side-nav-menu">
        <router-link class="side-menu-item" tag="div" to="users">
          <el-menu-item index="1-1">Пользователи</el-menu-item>
        </router-link>
        <router-link class="side-menu-item" tag="div" to="meetings">
          <el-menu-item index="1-2">Встречи</el-menu-item>
        </router-link>
      </el-menu>
    </el-aside>

    <el-container>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
  .main-layout-container {
    height: 100%;
  }

  .side-bar {
    width: 200px;
    border-right: 1px solid var(--bd-color);
  }

  .logo {
    height: 60px;
    padding: 20px;
    font-size: 40px;
    color: #409eff;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .side-nav-menu {
    border-right: none;
  }

  .side-menu-item {
    border-top: 1px solid var(--bd-color);
  }

  .side-menu-item:last-of-type {
    border-bottom: 1px solid var(--bd-color);
  }
</style>
