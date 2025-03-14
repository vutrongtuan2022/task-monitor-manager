export interface PropsUpdateDisbursementProgress {}

export interface IDetailProgressContractFund {
	totalContract: number;
	countRelease: number;
	totalContractAmount: number;
	totalAccumAmountThisYear: number;
	categoryProjectDTO: {
		code: string;
		name: string;
		state: number;
		leader: {
			fullname: string;
			code: string;
			uuid: string;
		};
		uuid: string;
	};
}

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
	state: number;
	status: number;
	uuid: string;
	parent: {
		code: string;
		state: number;
		status: number;
		uuid: string;
	};
	activityDTO: {
		name: string;
		state: number;
		project: {
			code: string;
			name: string;
			state: number;
			uuid: string;
		};
		contracts: {
			code: string;
			state: number;
			status: number;
			uuid: string;
		};
		uuid: string;
	};
}
