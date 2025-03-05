export interface PropsMainPageReportOverview {}

export interface IReportOverview {
	month: number;
	year: number;
	project: {
		code: string;
		name: string;
		state: number;
		uuid: string;
		leader: {
			fullname: string;
			code: string;
			uuid: string;
		};
	};
	report: {
		completeState: number;
		completed: string;
		created: string;
		totalActivity: number;
		completedActivity: number;
		title: string;
		state: number;
		status: number;
		month: number;
		year: number;
		project: {
			code: string;
			name: string;
			state: number;
			uuid: string;
		};
		reporter: {
			fullname: string;
			code: string;
			uuid: string;
		};
		uuid: string;
	};
	fund: {
		projectDTO: {
			code: string;
			name: string;
			state: number;
			uuid: string;
		};
		year: number;
		month: number;
		totalContracts: number;
		totalFunds: number;
	};
	totalInvest: number;
	reporter: {
		fullname: string;
		code: string;
		uuid: string;
	};
	updated: string;
	created: string;
	status: number;
	uuid: string;
}
