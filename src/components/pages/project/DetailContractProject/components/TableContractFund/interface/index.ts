export interface PropsTableContractFund {
	releasedMonth: number;
	releasedYear: number;
	projectAmount: number;
	reverseAmount: number;
	totalAmount: number;
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
	pnContract: {
		pn: {
			code: string;
			project: {
				code: string;
				name: string;
				created: string;
				state: 2;
				leader: {
					fullname: string;
					code: string;
					uuid: string;
				};
				member: [];
				branch: {
					uuid: string;
					code: string;
					name: string;
				};
				uuid: string;
			};
			state: number;
			uuid: string;
			numberingDate: string;
			noticeDate: string;
		};
		contractor: {
			contractor: {
				code: string;
				name: string;
				uuid: string;
				state: number;
				amount: number;
			};
			contractorCat: {
				uuid: string;
				code: string;
				name: string;
				isDefault: number;
				id: number;
			};
			status: number;
			uuid: string;
		};
		amount: number;
		accumAmount: number;
		type: number;
		note: string;
		uuid: string;
		status: number;
	};
}
