export interface PropsMainDisbursementProgress {}

export interface IDetailProgressFundProject {
	countYearly: number;
	countInProject: number;
	totalYearly: number;
	totalInProject: number;
	categoryProjectDTO: {
		code: string;
		name: string;
		state: number;
		uuid: string;
	};
}

export interface IProjectFund {
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
}
