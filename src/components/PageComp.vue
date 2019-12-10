<template>
  <div class="page">
    <header class="page-header">
      <h2 class="page-heading">
        <slot name="title"></slot>
      </h2>
      <div class="page-controls">
        <slot name="controls"></slot>
      </div>
    </header>
    <article class="page-content">
      <slot name="content"></slot>
    </article>
    <slot></slot>
  </div>
</template>

<style scoped>
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
