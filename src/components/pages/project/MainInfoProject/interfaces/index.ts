export interface PropsMainInfoProject {}

export interface IDetailInfoProject {
	name: string;
	code: string;
	description: string;
	state: number;
	progress: number;
	branch: {
		code: string;
		name: string;
		uuid: string;
	};
	taskCat: {
		id: number;
		name: string;
		code: string | null;
		uuid: string;
	};
	manager: {
		fullname: string;
		code: string;
		uuid: string;
	};
	user: {
		fullname: string;
		code: string;
		uuid: string;
	}[];
	digitalFile: string;
	expectBudget: number;
	totalInvest: number;
	realBudget: number;
	reserveBudget: number;
	remainReserveBudget: number;
	accumAmount: number;
	annualAccumAmount: number;
	annualBudget: number;
	address: string;
	activity: {
		uuid: string;
		name: string;
		state: number;
		project: {
			uuid: string;
			code: string;
			name: string;
			state: number;
			leader: {
				uuid: string;
				fullname: string;
				code: string;
			};
			branch: {
				uuid: string;
				code: string;
				name: string;
			};
		};
		contracts: {
			uuid: string;
			code: string;
			state: number;
			status: number;
			parent: string;
		};
	};
	tp: {
		code: string;
		name: string;
		uuid: string;
	};
	qh: {
		code: string;
		name: string;
		uuid: string;
	};
	xa: {
		code: string;
		name: string;
		uuid: string;
	};
	expectStart: string;
	expectEnd: string;
	realStart: string;
	realEnd: string;
	created: string;
	uuid: string;
}
