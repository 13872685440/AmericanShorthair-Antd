import { axios } from '@/utils/request'
import qs from 'qs'

export function init() {
  return axios({
    url: '/system/init/index',
    method: 'get'
  })
}

export function initdata() {
  return axios({
    url: '/system/init/initdata',
    method: 'post'
  })
}

export function login(parameter) {
  return axios({
    url: '/system/auth/login',
    method: 'post',
    data: parameter
  })
}

export function getInfo() {
  return axios({
    url: '/system/info/user',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export const getRouters = (roles) => {
  return axios({
    url: '/system/info/router',
    method: 'post',
    data: roles
  })
}

export function logout(token) {
  return axios({
    url: '/system/auth/logout?token=' + token + "&type=web",
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function makepwd(parameter) {
  const param = qs.stringify(parameter, { arrayFormat: 'repeat' });
  return axios({
    url: '/system/postinformation/makepwd?' + param,
    method: 'post'
  })
}

