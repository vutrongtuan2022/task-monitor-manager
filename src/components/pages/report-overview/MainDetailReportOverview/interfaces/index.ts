export interface PropsMainDetailReportOverview {}

export interface IDetailReportOverview {
	nextYear: number;
	nextMonth: number;
	month: number;
	year: number;
	project: {
		code: string;
		name: string;
		state: number;
		uuid: string;
	};
	report: {
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
		month: number;
		year: number;
		completeState: number | null;
		completed: number | null;
		created: string;
		totalActivity: number;
		completedActivity: number;
		title: string;
		state: number;
		status: number;
		uuid: string;
	};
	fundReport: {
		project: {
			code: string;
			name: string;
			state: number;
			uuid: string;
		};
		monthReport: string | null;
		realeaseBudget: number;
		totalInvest: number;
		annualBudget: number;
		annualAccumAmount: number;
		projectAccumAmount: number;
		fundProgress: number;
		created: string;
		reporter: {
			fullname: string;
			code: string;
			uuid: string;
		};
		approved: number;
		status: number;
		uuid: string;
	};
	reporter: {
		fullname: string;
		code: string;
		uuid: string;
	};
	updated: string | null;
	created: string;
	status: number;
	uuid: string;
}
