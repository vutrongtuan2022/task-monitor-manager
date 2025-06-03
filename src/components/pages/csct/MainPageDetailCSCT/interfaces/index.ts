export interface PropsMainPageDetailCSCT {}
export interface IDetailCSCT {}

export interface IContractsForProject {
	code: string;
	amount: number;
	accumAmount: number;
	startDate: string;
	endDate: string;
	totalDayAdvantage: number;
	totalContractor: number;
	totalContractorCat: number;
	contractor: {
		code: string;
		name: string;
		contractorCat: {
			id: number;
			code: string;
			name: string;
			isDefault: number;
			uuid: string;
		}[];
		uuid: string;
	};
	contractorInfos: {
		contractorName: string;
		contractorCatName: string;
		createDate: string;
	}[];
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
	state: number;
	parent: {
		code: string;
		state: number;
		status: number;
		uuid: string;
	};
}
