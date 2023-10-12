export interface User {
  /**
   * 用户 ID
   */
  id: string,
  /**
   * 账号
   */
  userAccount: string,
  /**
   * 昵称
   */
  username: string,
  /**
   * 头像 URL
   */
  avatarUrl: string,
  /**
   * 性别
   */
  gender: number,
  /**
   * 标签列表
   */
  tags: string[],
  /**
   * 个人简介
   */
  profile: string,
  /**
   * 手机
   */
  phone: string,
  /**
   * 邮箱
   */
  email: string,
  /**
   * 创建时间
   */
  createTime: string
}

export interface UserLoginSuccess {
  user: User,
  token: string
}
