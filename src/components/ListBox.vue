<script>
export default {
  render() {
    let items
    if (!this.$scopedSlots.default) {
      items = (
          <div class="non-data-stub">
            <div>Список пуст</div> <i class="non-data-icon el-icon-tickets" />
          </div>
      )
    } else {
      items = this.$scopedSlots
        .default()
        .map(node => <div class="list-item">{node}</div>)
    }

    return <div class="list">{items}</div>
  },
}
</script>

<style scoped>
  .list {
    border-radius: 4px;
    border: 1px solid var(--bd-color);
  }

  .non-data-stub {
    color: #c0c4cc;
    font-size: 1.5rem;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .non-data-icon {
    font-size: 3rem;
  }

  .list-item {
    padding: 15px 10px;
    border-bottom: 1px solid var(--bd-color);
  }

  .list-item:last-of-type {
    border-bottom: none;
  }
</style>
