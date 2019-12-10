<template>
  <Page>
    <template v-slot:title>Встречи</template>
    <template v-slot:controls>
      <el-button type="primary" icon="el-icon-plus" @click="openAddMeetingModal">Добавить</el-button>
    </template>
    <template v-slot:content>
      <ListBox>
        <div v-for="meeting in formattedMeetings" :key="meeting.id" class="meeting-card">
          <header class="meeting-card-header">
            <div class="meeting-card-title">{{ meeting.theme }}</div>
            <div class="meeting-card-date-info">
              <i class="el-icon-watch" />
              <span class="meeting-card-date">{{ meeting.date[0] }} - {{ meeting.date[1] }}</span>
              <el-tag
                size="small"
                effect="dark"
                type="danger"
                v-if="meeting.status === 'inPast'"
              >Прошла</el-tag>
              <el-tag
                size="small"
                effect="dark"
                type="warning"
                v-else-if="meeting.status === 'inProgress'"
              >Идет</el-tag>
              <el-tag size="small" effect="dark" type="success" v-else>Запланирована</el-tag>
            </div>
          </header>
          <i class="el-icon-user" />
          {{ meeting.facilitator | fullName }} - фасилитатор,
          {{ meeting.secretary | fullName }} - секретарь,
          {{ meeting.participants.join(', ') }}
        </div>
      </ListBox>
    </template>

    <ModalBox :visible.sync="addMeetingModalVisible">
      <template v-slot:title>Новая встреча</template>
      <el-form :model="newMeetingForm" :rules="rules" ref="newMeetingForm" label-width="200px">
        <el-form-item label="Тема" prop="theme">
          <el-input v-model="newMeetingForm.theme"></el-input>
        </el-form-item>
        <el-form-item label="Время проведения" prop="date">
          <el-date-picker
            v-model="newMeetingForm.date"
            @change="checkTimeOverlapping"
            :picker-options="{
              disabledDate: disablePastDates
            }"
            format="dd.MM.yyyy HH:mm"
            type="datetimerange"
            range-separator="До"
            start-placeholder="Начало"
            end-placeholder="Конец"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="Фасилитатор" prop="facilitator">
          <el-select
            v-model="newMeetingForm.facilitator"
            @change="removeParticipant"
            placeholder="Выберите пользователя"
          >
            <el-option
              v-for="user in users"
              :key="user.id"
              :label="`${user.name} ${user.surname}`"
              :disabled="isUserUnavailable(user.id)"
              :value="user.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Секретарь" prop="secretary">
          <el-select
            v-model="newMeetingForm.secretary"
            @change="removeParticipant"
            placeholder="Выберите пользователя"
          >
            <el-option
              v-for="user in users"
              :key="user.id"
              :label="`${user.name} ${user.surname}`"
              :disabled="isUserUnavailable(user.id)"
              :value="user.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Участники" prop="participants">
          <el-checkbox-group class="modal-participants-list" v-model="newMeetingForm.participants">
            <el-checkbox
              v-for="user in users"
              :key="user.id"
              class="modal-participants-list-item"
              :disabled="isUserUnavailable(user.id)"
              :label="user.id"
            >
              {{ user.name }} {{ user.surname }}
              <span
                v-if="isUserUnavailable(user.id)"
                class="status"
              >– {{ userUnavailabilityStatus(user.id) }}</span>
            </el-checkbox>
          </el-checkbox-group>
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
import {
  isPast,
  isToday,
  areIntervalsOverlapping,
  lightFormat,
  isWithinInterval,
} from 'date-fns'
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
      addMeetingModalVisible: false,

      rules: {
        theme: [
          {
            required: true,
            message: 'Введите тему встречи',
            trigger: 'blur',
          },
        ],
        date: [
          {
            required: true,
            message: 'Выберите время встречи',
            trigger: 'blur',
          },
        ],
        facilitator: [
          {
            required: true,
            message: 'Выберите фасилитатора',
            trigger: 'blur',
          },
        ],
        secretary: [
          {
            required: true,
            message: 'Выберите секретаря',
            trigger: 'blur',
          },
        ],
      },

      newMeetingForm: {
        theme: '',
        date: null,
        secretary: '',
        facilitator: '',
        participants: [],
      },
    }
  },

  computed: {
    users() {
      return this.$store.state.users
    },

    meetings() {
      return this.$store.state.meetings
    },

    formattedMeetings() {
      return this.meetings.map((meeting) => {
        const that = this

        const participants = meeting.participants
          .map(part => that.users.find(user => part === user.id))
          .map(user => `${user.name} ${user.surname}`)

        const facilitator = this.users.find(
          user => meeting.facilitator === user.id,
        )
        const secretary = this.users.find(user => meeting.secretary === user.id)

        const date = meeting.date.map(d => lightFormat(d, 'dd.MM.yyyy, hh:mm'))

        let status
        if (
          isWithinInterval(new Date(), {
            start: meeting.date[0],
            end: meeting.date[1],
          })
        ) {
          status = 'inProgress'
        } else if (isPast(meeting.date[1])) {
          status = 'inPast'
        } else {
          status = 'inFuture'
        }

        return {
          ...meeting,
          participants,
          facilitator,
          secretary,
          date,
          status,
        }
      })
    },
  },

  methods: {
    openAddMeetingModal() {
      this.addMeetingModalVisible = true
    },

    disablePastDates(date) {
      return isPast(date) && !isToday(date)
    },

    isSecretary(userId) {
      return this.newMeetingForm.secretary === userId
    },

    isFacilitator(userId) {
      return this.newMeetingForm.facilitator === userId
    },

    isUserUnavailable(userId) {
      return (
        this.isSecretary(userId)
          || this.isFacilitator(userId)
          || this.hasOverlappingMeetings(userId)
      )
    },

    hasOverlappingMeetings(userId) {
      if (!this.newMeetingForm.date) return false

      const newMeetingDate = this.newMeetingForm.date

      return this.meetings.some((meeting) => {
        if (!meeting.participants.includes(userId)) return false

        return areIntervalsOverlapping(
          { start: meeting.date[0], end: meeting.date[1] },
          { start: newMeetingDate[0], end: newMeetingDate[1] },
        )
      })
    },

    checkTimeOverlapping(date) {
      if (date) {
        this.newMeetingForm.participants = this.newMeetingForm.participants.filter(
          id => !this.hasOverlappingMeetings(id),
        )

        if (this.hasOverlappingMeetings(this.newMeetingForm.facilitator)) {
          this.newMeetingForm.facilitator = ''
        }

        if (this.hasOverlappingMeetings(this.newMeetingForm.secretary)) {
          this.newMeetingForm.secretary = ''
        }
      }
    },

    userUnavailabilityStatus(userId) {
      if (this.hasOverlappingMeetings(userId)) {
        return 'занят во время встречи'
      }

      if (this.isSecretary(userId)) {
        return 'секретарь встречи'
      }

      if (this.isFacilitator(userId)) {
        return 'фасилитатор встречи'
      }

      return null
    },

    removeParticipant(userId) {
      this.newMeetingForm.participants = this.newMeetingForm.participants.filter(
        id => id !== userId,
      )
    },

    submitForm() {
      this.$refs.newMeetingForm.validate((valid) => {
        if (valid) {
          this.$store
            .dispatch('createMeeting', this.newMeetingForm)
            .then(() => {
              this.$notify({
                title: 'Создание встречи',
                message: `Встреча "${this.newMeetingForm.theme}" создана`,
                type: 'success',
              })

              this.resetForm()
            })

          return true
        }

        return false
      })
    },

    resetForm() {
      this.$refs.newMeetingForm.resetFields()
      this.newMeetingForm.date = null
    },

    cancelFormFill() {
      this.addMeetingModalVisible = false
      this.resetForm()
    },
  },
}
</script>

<style scoped>
  .modal-participants-list {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    max-height: 200px;
    overflow-y: auto;
  }

  .modal-participants-list-item {
    margin: 0;
  }

  .meeting-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }

  .meeting-card-title {
    font-size: 1.3rem;
    font-weight: bold;
  }

  .meeting-card-date-info {
    display: flex;
    align-items: center;
  }

  .meeting-card-date {
    margin-right: 10px;
  }
</style>
