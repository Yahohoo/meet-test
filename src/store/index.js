import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import createMutationsSharer from 'vuex-shared-mutations'

Vue.use(Vuex)

function uuid(a) {
  // eslint-disable-next-line no-bitwise
  return a ? (0 | (Math.random() * 16)).toString(16) : `${1e7}${-1e3}${-4e3}${-8e3}${-1e11}`.replace(/1|0/g, uuid)
}

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      rehydrated: (store) => {
        store.commit('updateRehydratedDates')
      },
    }),
    createMutationsSharer({ predicate: ['addUser', 'addMeeting'] }),
  ],

  state: {
    users: [],
    meetings: [],
  },

  mutations: {
    addUser: (state, userData) => {
      state.users.push(userData)
    },

    addMeeting: (state, meetingData) => {
      const fixedMeetingData = {
        ...meetingData,
        // хак для того, чтобы расшаренная мутация сохраняла даты не в строках
        date: meetingData.date.map(date => (typeof date === 'string' ? new Date(date) : date)),
      }

      state.meetings.push(fixedMeetingData)
    },

    updateRehydratedDates: (state) => {
      state.meetings = state.meetings.map(meeting => ({ ...meeting, date: meeting.date.map(date => new Date(date)) }))
    },
  },

  actions: {
    createUser: async ({ commit }, userData) => commit('addUser', { ...userData, id: uuid() }),

    createMeeting: async ({ commit }, meetingData) => commit('addMeeting', { ...meetingData, id: uuid() }),
  },
})
