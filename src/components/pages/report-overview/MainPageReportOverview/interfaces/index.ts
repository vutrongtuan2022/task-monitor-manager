export interface PropsMainPageReportOverview {}

export interface IReportOverview {
	uuid: string;
	month: number;
	year: number;
	project: {
		uuid: string;
		code: string;
		name: string;
		state: number;
	};
	report: {
		uuid: string;
		title: string;
		state: number;
		status: number;
		project: {
			uuid: string;
			code: string;
			name: string;
			state: number;
		};
		reporter: {
			uuid: string;
			fullname: string;
			code: string;
		};
		month: number;
		year: number;
		completeState: number;
		completed: string;
		created: string;
		totalActivity: number;
		completedActivity: number;
	};
	fundReport: {
		uuid: string;
		monthReport: string;
		realeaseBudget: number;
		totalInvest: number;
		annualBudget: number;
		annualAccumAmount: number;
		projectAccumAmount: number;
		fundProgress: number;
		created: string;
		reporter: {
			uuid: string;
			fullname: string;
			code: string;
		};
		approved: number;
		status: number;
		project: {
			uuid: string;
			code: string;
			name: string;
			state: number;
		};
	};
	reporter: {
		uuid: string;
		fullname: string;
		code: string;
	};
	updated: string;
	created: string;
	status: number;
}
