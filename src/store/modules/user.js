import firebase from 'firebase/app'
import 'firebase/auth'
import { currentUser } from '../../constants/config'
import axios from 'axios';

export default {
  state: {
    currentUser: localStorage.getItem('user') != null ? JSON.parse(localStorage.getItem('user')) : null,
    loginError: null,
    processing: false,
    forgotMailSuccess:null,
    resetPasswordSuccess:null
  },
  getters: {
    currentUser: state => state.currentUser,
    processing: state => state.processing,
    loginError: state => state.loginError,
    forgotMailSuccess: state => state.forgotMailSuccess,
    resetPasswordSuccess:state => state.resetPasswordSuccess,
  },
  mutations: {
    setUser(state, payload) {
      state.currentUser = payload;
      state.processing = false;
      state.loginError = null
    },
    setLogout(state) {
      // lúc đầu gán NULL nhưng lỗi warning
      state.currentUser = {};
      state.processing = false;
      state.loginError = null
    },
    setProcessing(state, payload) {
      state.processing = payload;
      state.loginError = null
    },
    setError(state, payload) {
      state.loginError = payload;
      state.currentUser = null;
      state.processing = false
    },
    setForgotMailSuccess(state) {
      state.loginError = null;
      state.currentUser = null;
      state.processing = false;
      state.forgotMailSuccess=true
    },
    setResetPasswordSuccess(state) {
      state.loginError = null;
      state.currentUser = null;
      state.processing = false;
      state.resetPasswordSuccess=true
    },
    clearError(state) {
      state.loginError = null
    }
  },
  actions: {
    login({ commit }, payload) {
      commit('clearError');
      commit('setProcessing', true);
      axios.post("http://127.0.0.1:8000/api/login", {email: payload.email, password: payload.password})
        .then(response => {
          // If there's user data in response
          if(response.data.userData) {
            localStorage.setItem('user', JSON.stringify(response.data.userData));
            commit('setUser', response.data.userData)
          }else {
            commit('setError', "Email hoặc mật khẩu không đúng!")
          }

        })
        .catch(error => { commit('setError', error) })
    },
    forgotPassword({ commit }, payload) {
      commit('clearError');
      commit('setProcessing', true);
      firebase
        .auth()
        .sendPasswordResetEmail(payload.email)
        .then(
          user => {
            commit('clearError');
            commit('setForgotMailSuccess')
          },
          err => {
            commit('setError', err.message);
            setTimeout(() => {
              commit('clearError')
            }, 3000)
          }
        )
    },
    resetPassword({ commit }, payload) {
      commit('clearError');
      commit('setProcessing', true);
      firebase
        .auth()
        .confirmPasswordReset(payload.resetPasswordCode,payload.newPassword)
        .then(
          user => {
            commit('clearError');
            commit('setResetPasswordSuccess')
          },
          err => {
            commit('setError', err.message);
            setTimeout(() => {
              commit('clearError')
            }, 3000)
          }
        )
    },



    /*
       return await auth.(resetPasswordCode, newPassword)
        .then(user => user)
        .catch(error => error);
    */
    signOut({ commit }) {
      localStorage.removeItem('user');
      commit('setLogout')
      // firebase
      //   .auth()
      //   .signOut()
      //   .then(() => {
      //     localStorage.removeItem('user')
      //     commit('setLogout')
      //   }, _error => { })
    }
  }
}
