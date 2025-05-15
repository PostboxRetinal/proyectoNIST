import { Role } from "../constants/roles";

export interface UserData {
	id: string;
	email: string;
	role: Role;
};
