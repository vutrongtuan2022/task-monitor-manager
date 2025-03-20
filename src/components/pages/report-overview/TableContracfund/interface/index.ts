export interface PropsTableContracFund {}

export interface IContractFund {
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
	activity: {
		name: string;
		state: number;
		contracts: {
			code: string;
			status: number;
			uuid: string;
		};
		uuid: string;
	};
	contractorInfos: {
		contractorName: string;
		contractorCatName: string;
		createDate: string;
	}[];
	releaseDate: string;
	sendDate: string;
	amount: number;
	reverseAmount: number;
	status: number;
	uuid: string;
	note: string;
	totalContractor: number;
	totalContractorCat: number;
}
