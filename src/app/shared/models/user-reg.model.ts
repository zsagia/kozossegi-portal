import { UserLoginData } from "./user-login.model";

export interface UserRegData extends UserLoginData{
  name: string;
}
