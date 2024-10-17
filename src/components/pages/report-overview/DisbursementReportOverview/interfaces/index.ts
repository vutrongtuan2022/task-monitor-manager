export interface PropsDisbursementReportOverview {}

export interface IDisbursementReportOverview {
	project: {
		code: string;
		name: string;
		state: number;
		uuid: string;
	};
	monthReport: string;
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
	note: string;
	feedback: string;
}
