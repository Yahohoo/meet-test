<template>
  <Page>
    <template v-slot:title>Пользователи</template>
    <template v-slot:controls>
      <el-button type="primary" icon="el-icon-plus" @click="openAddUserModal">Добавить</el-button>
    </template>
    <template v-slot:content>
      <ListBox>
        <div v-for="user in users" :key="user.id">{{ user | fullName }}</div>
      </ListBox>
    </template>

    <ModalBox :visible.sync="addUserModalVisible">
      <template v-slot:title>Новый пользователь</template>
      <el-form :model="newUserForm" :rules="rules" ref="newUserForm" label-width="120px">
        <el-form-item label="Имя" prop="name">
          <el-input v-model="newUserForm.name"></el-input>
        </el-form-item>
        <el-form-item label="Фамилия" prop="surname">
          <el-input v-model="newUserForm.surname"></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:controls>
        <el-button size="small" type="text" @click="cancelFormFill">Отменить</el-button>
        <el-button type="primary" size="small" @click="submitForm">Создать</el-button>
      </template>
    </ModalBox>
  </Page>
</template>

<script>
import Page from '@/components/PageComp.vue'
import ModalBox from '@/components/ModalBox.vue'
import ListBox from '@/components/ListBox.vue'

export default {
  components: {
    Page,
    ModalBox,
    ListBox,
  },

  data() {
    return {
      addUserModalVisible: false,

      rules: {
        name: [
          {
            required: true,
            message: 'Введите имя',
            trigger: 'blur',
          },
        ],
        surname: [
          {
            required: true,
            message: 'Введите фамилию',
            trigger: 'blur',
          },
        ],
      },

      newUserForm: {
        name: '',
        surname: '',
      },
    }
  },

  computed: {
    users() {
      return this.$store.state.users
    },
  },

  methods: {
    openAddUserModal() {
      this.addUserModalVisible = true
    },

    submitForm() {
      this.$refs.newUserForm.validate((valid) => {
        if (valid) {
          this.$store.dispatch('createUser', this.newUserForm).then(() => {
            this.$notify({
              title: 'Создание пользователя',
              message: `Пользователь ${this.$options.filters.fullName(this.newUserForm)} создан`,
              type: 'success',
            })

            this.$refs.newUserForm.resetFields()
          })

          return true
        }

        return false
      })
    },

    resetForm() {
      console.log('formReseted')
      this.$refs.newUserForm.resetFields()
    },

    cancelFormFill() {
      this.addUserModalVisible = false
      this.resetForm()
    },
  },
}
</script>
