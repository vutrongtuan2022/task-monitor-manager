export interface PropsTableContractor {
	contractor: {
		code: string;
		name: string;
		contractorLinkUuid: null;
		contractorCat: {
			id: number;
			code: string;
			name: string;
			isDefault: number;
			uuid: string;
		}[];
		amount: number;
		uuid: string;
	};
	contractorCat: {
		id: number;
		code: string;
		name: string;
		isDefault: number;
		uuid: string;
	};
	amount: number;
	createDate: string;
	uuid: string;
}

// export interface IlistContractor {}
