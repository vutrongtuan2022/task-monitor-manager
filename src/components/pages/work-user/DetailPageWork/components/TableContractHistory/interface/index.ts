export interface IContractByActivity {
	code: string;
	amount: number;
	startDate: string;
	endDate: string;
	totalDayAdvantage: number;
	totalContractor: number;
	totalContractorCat: number;
	advanceGuarantee: {
		amount: number;
		endDate: string;
		type: number;
	};
	contractExecution: {
		amount: number;
		endDate: string;
		type: number;
	};
	contractorInfos: {
		contractorName: string;
		contractorCatName: string;
		createDate: string;
	}[];
	parent: any;
	user: {
		fullname: string;
		code: string;
		uuid: string;
	};
	activityName: string;
	state: number;
	status: number;
	uuid: string;
}
