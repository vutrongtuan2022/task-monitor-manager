export interface PropsTableContractFund {
	releasedMonth: number;
	releasedYear: number;
	projectAmount: number;
	reverseAmount: number;
	creator: {
		fullname: string;
		code: string;
		uuid: string;
	};
	created: string;
	totalAmount: number;
	state: number;
	uuid: string;
}
