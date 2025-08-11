export interface UserDetail{
  id: string,
  name: string,
  surname: string,
  email: string,
  roles: string[]
  phoneNumber: string,
  twoFacotrEnabled: boolean,
  phoneNumberConfirmed: boolean,
  accessFailedCount: number
}