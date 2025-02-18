export interface PropsTableContractFund {
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
