export interface PropsMainPageReportDisbursement {}

export interface IReportDisbursement {
	uuid: string;
	project: {
		uuid: string;
		code: string;
		name: string;
		state: number;
	};
	creator: {
		uuid: string;
		fullname: string;
		code: string;
	};
	releasedMonth: number;
	releasedYear: number;
	totalAmount: number;
	sendDate: string | null;
	state: number;
	yearlyBudget: number | null;
	totalBudget: number;
	projectAmount: number;
	reverseAmount: number;
}
