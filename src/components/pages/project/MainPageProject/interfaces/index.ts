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
	state: number;
	progress: number;
	status: number;
	uuid: string;
}
