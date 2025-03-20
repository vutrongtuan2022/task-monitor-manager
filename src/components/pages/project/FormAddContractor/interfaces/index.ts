export interface PropsFormAddContractor {
	onClose: () => void;
}

export interface IFormAddContractor {
	type: string;
	contractorUuid: string;
	contractAmount: number;
	contractEndDate: string;
	projectGuaranteeAmount: number;
	projectGuaranteeEndDate: string;
	disbursementGuaranteeAmount: number;
	disbursementGuaranteeEndDate: string;
}
