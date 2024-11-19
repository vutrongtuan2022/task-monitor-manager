export interface PropsMainDisbursementProgress {}

export interface IDetailProgressContractFund {
	totalContract: number;
	countRelease: number;
	totalContractAmount: number;
	categoryProjectDTO: {
		code: string;
		name: string;
		state: number;
		uuid: string;
	};
}

export interface IContractsForProject {
	code: string;
	amount: number;
	startDate: string;
	endDate: string;
	totalDayAdvantage: number;
	contractor: {
		code: string;
		name: string;
		contractorCat: {
			id: number;
			code: string;
			name: string;
			isDefault: number;
			uuid: string;
		};
		uuid: string;
	};
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
	activityName: string;
	status: number;
	uuid: string;
}
