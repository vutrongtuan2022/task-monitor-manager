export interface PropsDetailAppendices {}

export interface IDetailContract {
	accumAmountThisYear: number;
	advanceGuarantee: {
		amount: number;
		endDate: string;
		type: number;
		created: string;
		status: number;
		contUuid: string;
		uuid: string;
	};
	contractExecution: {
		amount: number;
		endDate: string;
		type: number;
		created: string;
		status: number;
		contUuid: string;
		uuid: string;
	};
	activityDTO: {
		name: number;
		state: number;
		contracts: {
			code: string;
			status: number;
			uuid: string;
		};
		uuid: string;
	};
	contractorDTO: {
		qh: {
			code: string;
			name: string;
			uuid: string;
		};
		tp: {
			code: string;
			name: string;
			uuid: string;
		};
		xa: {
			code: string;
			name: string;
			uuid: string;
		};
		address: string;
		note: string;
		status: number;
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
	parent: {
		code: string;
		state: number;
		status: number;
		uuid: string;
	};
	creator: {
		fullname: string;
		code: string;
		uuid: string;
	};
	projectDTO: {
		code: string;
		name: string;
		state: number;
		uuid: string;
	};
	totalDayAdvantage: number;
	totalContractor: number;
	totalContractorCat: number;
	amount: number;
	accumAmount: number;
	progress: number;
	startDate: string;
	endDate: string;
	updated: null;
	created: string;
	code: string;
	status: number;
	uuid: string;
	state: number;
}

export interface IContractDetailFund {
	releasedMonth: number;
	releasedYear: number;
	projectAmount: number;
	reverseAmount: number;
	amount: number;
	releasedDate: string;
	creator: {
		fullname: string;
		code: string;
		uuid: string;
	};
	created: string;
	state: number;
	note: string;
}
