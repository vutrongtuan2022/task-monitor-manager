export interface PropsMainDetailReportWork {}

export interface IDetailReportWork {
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
	note: string;
	feedback: string;
	status: number;
	uuid: string;
}
