export interface PropsMainInfoContractor {}

export interface IContractorProject {
	contractorUuid: string;
	projectContractorUuid: string;
	name: string;
	code: string;
	contractEndDate: string;
	contractAmount: number;
	contractorCategory: {
		uuid: string;
		id: number;
		code: string;
		name: string;
		isDefault: number;
	};
	projectGuarantee: {
		uuid: string;
		type: number;
		amount: number;
		startDate: string;
		endDate: string;
	};
	disbursementGuarantee: {
		uuid: string;
		type: number;
		amount: number;
		startDate: string;
		endDate: string;
	};
}
