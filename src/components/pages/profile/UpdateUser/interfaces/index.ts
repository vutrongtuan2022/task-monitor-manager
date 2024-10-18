export interface PropsUpdateUser {
	onClose: () => void;
}

export interface IUpdateUser {
	uuid: string;
	fullName: string;
	email: string;
	gender: number;
	phone: string;
	birthday: Date | null;
	address: string;
	matp: string;
	maqh: string;
	xaid: string;
	note: string;
}
