<template>
  <div v-if="visible" class="modal-wrapper">
    <el-card class="modal">
      <template v-slot:header>
        <header class="modal-header">
          <div class="modal-title">
            <slot name="title"></slot>
          </div>
          <el-button @click="closeModal" size="mini" icon="el-icon-close" circle></el-button>
        </header>
      </template>
      <slot></slot>
      <footer class="modal-footer">
        <slot name="controls"></slot>
      </footer>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      default: false,
    },
  },

  methods: {
    closeModal() {
      this.$emit('update:visible', false)
    },
  },
}
</script>

<style scoped>
  .modal-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(51, 51, 51, 0.42);
  }

  .modal {
    background: #fff;
    min-width: 320px;
    max-width: 70%;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .modal-title {
    max-width: 300px;
  }

  .modal-footer {
    padding: 10px 10px 0;
    border-top: 1px solid var(--bd-color);
    display: flex;
    justify-content: flex-end;
  }
</style>
