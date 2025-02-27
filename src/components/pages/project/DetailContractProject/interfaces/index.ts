export interface PropsDetailContractProject {}

export interface IDetailContract {
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
		name: string;
		state: number;
		project: {
			code: string;
			name: string;
			state: number;
			leader: {
				fullname: string;
				code: string;
				uuid: string;
			};
			branch: {
				code: string;
				name: string;
				uuid: string;
			};
			uuid: string;
		};
		contracts: {
			code: string;
			state: number;
			status: number;
			parent: {
				code: string;
				state: number;
				status: number;
				uuid: string;
			};
			uuid: string;
		};
		uuid: string;
	};
	totalContractor: number;
	totalContractorCat: number;
	contractorInfos: {
		contractorName: string;
		contractorCatName: string;
		createDate: string;
	}[];
	creator: {
		fullname: string;
		code: string;
		uuid: string;
	};
	projectDTO: {
		code: string;
		name: string;
		state: number;
		leader: {
			fullname: string;
			code: string;
			uuid: string;
		};
		branch: {
			code: string;
			name: string;
			uuid: string;
		};
		uuid: string;
	};
	contractor: {
		contractorDTO: {
			code: string;
			name: string;
			contractorLinkUuid: string;
			contractorCat: {
				id: number;
				code: string;
				name: string;
				isDefault: string;
				uuid: string;
			}[];
			amount: number;
			uuid: string;
		};
		amount: number;
	}[];
	totalDayss: number;
	accumAmountThisYear: number;
	amount: number;
	accumAmount: number;
	progress: number;
	startDate: string;
	endDateCacluator: string;
	totalDayAdvantage: number;
	endDate: string;
	updated: string;
	created: string;
	code: string;
	state: number;
	status: number;
	parent: {
		code: string;
		state: number;
		status: number;
		uuid: string;
	};
	uuid: string;
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
