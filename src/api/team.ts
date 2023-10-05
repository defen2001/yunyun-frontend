import { RespList, RespObj, RespPage, RespStr } from '@/models/response'
import { Team, TeamInvitation, TeamQuery } from '@/models/team'
import { User } from '@/models/user'
import $axios from '@/utils/axios.ts'

export function createTeam(team: Team) {
  return $axios.post<RespStr>('/team', team)
}

export function joinPublicTeam(id: string, password?: string) {
  return $axios.post<RespStr>('/team/join', {
    id, password,
  })
}

export function sendTeamInvitation(teamInvitation: TeamInvitation) {
  return $axios.post<RespObj<TeamInvitation>>('/team/invite', teamInvitation)
}

export function acceptTeamInvitation(code: string) {
  return $axios.get<RespStr>('/team/join/invite', {
    params: { code },
  })
}

export function quitOrDisbandTeam(teamId: string) {
  return $axios.delete<RespStr>('/team/' + teamId)
}

export function updateTeamInfo(team: Team) {
  return $axios.put<RespStr>('/team', team)
}

export function queryByTeamId(teamId: string) {
  return $axios.get<RespObj<Team>>('/team/' + teamId)
}

export function listMyTeamInfo() {
  return $axios.get<RespList<Team>>('/team/list/mine')
}

export function listTeamInfoByUserId(userId: string) {
  return $axios.get<RespList<Team>>('/team/list/' + userId)
}

export function queryByConditionWithPagination(teamQuery: TeamQuery) {
  return $axios.get<RespPage<Team>>('/team/page', {
    params: teamQuery,
  })
}

export function listTeamMember(teamId: string) {
  return $axios.get<RespList<User>>('/team/member/' + teamId)
}

export function recommendTeams(userId: string | null, currentPage: number) {
  return $axios.get<RespPage<Team>>('/team/recommend', {
    params: { userId, currentPage },
  })
}
