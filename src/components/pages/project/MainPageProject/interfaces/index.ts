export interface PropsMainPageProject {}

export interface IProject {
	name: string;
	code: string;
	totalInvest: number;
	realBudget: number;
	type: number;
	manager: {
		fullname: string;
		code: string;
		uuid: string;
	};
	user: {
		fullname: string;
		code: string;
		uuid: string;
	};
	taskCat: {
		id: number;
		name: string;
		code: null;
		uuid: string;
	};
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
	state: number;
	progress: number;
	status: number;
	uuid: string;
}
