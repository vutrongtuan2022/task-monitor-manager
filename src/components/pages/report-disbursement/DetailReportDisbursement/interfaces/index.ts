export interface PropsDetailReportDisbursement {}

export interface IDetailContractFund {
	project: {
		code: string;
		name: string;
		state: number;
		uuid: string;
	};
	creator: {
		fullname: string;
		code: string;
		uuid: string;
	};
	releasedMonth: number;
	releasedYear: number;
	contractCount: number;
	totalAmount: number;
	sendDate: string | null;
	state: number;
	note: string;
	rejectedReason: string | null;
	uuid: string;
}
export interface IContractFund {
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
	projectAmount: number;
	reverseAmount: number;
	releaseDate: string;
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
	contractorGroup: {
		id: number;
		code: string;
		name: string;
		isDefault: number;
		uuid: string;
	};
	code: string;
	status: number;
	uuid: string;
}
