import { User } from '@/models/user'

export interface Team {
  /**
   * 队伍 ID
   */
  id: string,
  /**
   * 队伍名称
   */
  name: string,
  /**
   * 队伍描述
   */
  description: string,
  /**
   * 队长
   */
  leader: User,
  /**
   * 队伍类型 (0 - 公开, 1 - 私密)
   */
  type: 0 | 1,
  /**
   * 加入密码
   */
  password: string,
  /**
   * 拥有加入密码
   */
  hasPassword: boolean,
  /**
   * 成员人数
   */
  memberCount: number,
  /**
   * 人数限制
   */
  memberLimit: number,
  /**
   * 过期时间
   */
  expireTime: string,
  /**
   * 创建时间
   */
  createTime: string
}

export interface TeamQuery {
  /**
   * 当前页数
   */
  currentPage: number,
  /**
   * 搜索关键字
   */
  searchText: string,
  /**
   * 仅查看无密码队伍
   */
  onlyNoPassword: boolean
}

export interface TeamInvitation {
  /**
   * 队伍 ID
   */
  teamId: string,
  /**
   * 邀请者 ID
   */
  inviter: string,
  /**
   * 受邀者 ID
   */
  invitee: string,
  /**
   * 邀请码
   */
  invitationCode: string
}
