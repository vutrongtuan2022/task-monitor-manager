export interface PropsUpdateProfile {
	onClose: () => void;
}

export interface IUpdateProfile {
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
