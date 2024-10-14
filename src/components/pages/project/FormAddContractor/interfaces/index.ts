export interface PropsFormAddContractor {
	onClose: () => void;
}

export interface IFormAddContractor {
	type: number | null;
	contractorUuid: string;
	contractAmount: number;
	contractEndDate: string;
	projectGuaranteeAmount: number;
	projectGuaranteeEndDate: string;
	disbursementGuaranteeAmount: number;
	disbursementGuaranteeEndDate: string;
}
