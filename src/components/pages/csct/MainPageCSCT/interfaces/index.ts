export interface PropsMainPageCSCT {}

export interface ICSCT {
	totalAmount: number;
	accumAmount: number;
	percent: number;
	totalContracts: number;
	user: {
		fullname: string;
		code: string;
		uuid: string;
	};
	numberingDate: string;
	noticeDate: string;
	code: string;
	project: {
		code: string;
		name: string;
		created: string;
		state: number;
		leader: {
			uuid: string;
			fullname: string;
			code: string;
		};
		member: [];
		branch: {
			code: string;
			name: string;
			uuid: string;
		};
		uuid: string;
	};
	state: number;
	uuid: string;
}
