export interface PropsDetailPageWork {}
export interface IDetailActivityContract {
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
		uuid: string;
	};
	contracts: {code: string; state: number; status: number; uuid: string};
	uuid: string;
}
export interface IContractByActivity {
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
	user: {
		fullname: string;
		code:string;
		uuid:string;
	};
	activityName: string;
	state: number;
	status: number;
	uuid: string;
}
