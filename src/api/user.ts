import { Message } from '@/models/message'
import { RespList, RespObj, RespPage, RespStr } from '@/models/response'
import { User, UserLoginSuccess } from '@/models/user.d'
import $axios from '@/utils/axios.ts'

export function sendVerificationCode(phoneNumber?: string) {
  if (!phoneNumber) {
    return $axios.post<RespStr>('/user/account/code')
  }
  return $axios.post<RespStr>('/user/code', {
    phoneNumber,
  })
}

export function userRegister(userAccount: string, userPassword: string, checkPassword: string) {
  return $axios.post<RespObj<UserLoginSuccess>>('/user/register', {
    userAccount, userPassword, checkPassword,
  })
}

export function loginByPassword(userAccount: string, userPassword: string) {
  return $axios.post<RespObj<UserLoginSuccess>>('/user/login', {
    userAccount, userPassword,
  })
}

export function getAccountInfo() {
  return $axios.get<RespObj<User>>('/user/get/login')
}

export function updatePassword(password: string, oldPassword: string, confirmPassword: string) {
  return $axios.put<RespStr>('/user/password', {
    password, oldPassword, confirmPassword,
  })
}

export function updateAvatar(file: File) {
  let formData = new FormData()
  formData.append('file', file)
  return $axios.post<RespStr>('/file/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }, transformRequest: [ () => formData ],
  })
}

export function updateBasicInfo(user: User) {
  return $axios.put<RespStr>('/user/update/my', user)
}

export function updateTags(tags: string[]) {
  return $axios.put<RespStr>('/user/add/tags', tags)
}

export function queryByUserId(userId: string) {
  return $axios.get<RespObj<User>>('/user/' + userId)
}

export function queryByTagsWithPagination(tags: string, currentPage: number) {
  return $axios.get<RespPage<User>>('/user/tags', {
    params: { tags, currentPage },
  })
}

export function queryHotTags() {
  return $axios.get<RespList<string>>('/user/tags/hot')
}

export function recommendUsers(userId: string | null, currentPage: number) {
  return $axios.get<RespPage<User>>('/user/recommend', {
    params: { userId, currentPage },
  })
}

export function queryByUsernameWithPagination(username: string, currentPage: number) {
  return $axios.get<RespPage<User>>('/user/name', {
    params: { username, currentPage },
  })
}

export function getUnreadMessageCount() {
  return $axios.get<RespObj<number>>('/user/message/unread')
}

export function getMessageWithScrolling(scrollId: string) {
  return $axios.get<RespList<Message>>('/user/message', {
    params: { scrollId },
  })
}
