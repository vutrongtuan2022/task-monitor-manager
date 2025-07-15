export interface PropsTableContractFund {
	releasedMonth: number;
	releasedYear: number;
	totalAmount: number;
	projectAmount: number;
	reverseAmount: number;
	creator: {
		fullname: string;
		code: string;
		uuid: string;
	};
	created: string;
	state: number;
	uuid: string;
}
