export interface PropsMainPageDetailCSCT {}
export interface IDetailCSCT {
	accumAmountInYear: number;
	status: number;
	totalAmount: number;
	accumAmount: number;
	percent: number;
	totalContracts: number;
	user: {
		fullname: string | null;
		code: string | null;
		uuid: string;
	};
	numberingDate: string | null;
	noticeDate: string | null;
	code: string;
	project: {
		code: string;
		name: string;
		created: string;
		state: number;
		leader: {
			uuid: string;
			fullname: string;
			code: string;
		};
		member: [];
		branch: {
			code: string;
			name: string;
			uuid: string;
		};
		uuid: string;
	};
	state: number;
	uuid: string;
	approvalDate: string | null;
	rejectReason: string | null;
}

export interface IContractsPN {
	contract: {
		code: string;
		state: number;
		status: number;
		parent: {
			code: string;
			state: number;
			status: number;
			uuid: string;
		};
		contractorLinks: {
			contractor: {
				code: string;
				name: string;
				state: number;
				contractorLinkUuid: string;
				contractorCat: {
					id: number;
					code: string;
					name: string;
					isDefault: number | null;
					uuid: string;
				}[];
				amount: number;
				uuid: string;
			};
			contractorCat: {
				id: number;
				code: string;
				name: string;
				isDefault: number | null;
				uuid: string;
			};
			status: number;
			uuid: string;
		}[];
		startDate: string;
		uuid: string;
	};
	contractor: {
		contractor: {
			code: string;
			name: string;
			state: number;
			contractorLinkUuid: string;
			contractorCat: {
				id: number;
				code: string;
				name: string;
				isDefault: number | null;
				uuid: string;
			}[];
			amount: number;
			uuid: string;
		};
		contractorCat: {
			id: number;
			code: string;
			name: string;
			isDefault: number | null;
			uuid: string;
		};
		status: number;
		uuid: string;
	};
	amount: number;
	accumAmount: number;
	type: number;
	note: string;
	status: number;
	uuid: string;
}
