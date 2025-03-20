export interface PropsMainPageDetailUser {}

export interface IDetailUser {
	birthday: string;
	qh: {
		code: string;
		name: string;
		uuid: string;
	};
	tp: {
		code: string;
		name: string;
		uuid: string;
	};
	xa: {
		code: string;
		name: string;
		uuid: string;
	};
	note: string;
	updated: string;
	created: string;
	gender: number;
	email: string;
	phone: string;
	accountUU: {
		code: string;
		name: string;
		uuid: string;
	};
	isHaveAcc: number;
	address: string;
	status: number;
	fullname: string;
	code: string;
	uuid: string;
}
