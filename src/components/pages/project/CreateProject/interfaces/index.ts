export interface PropsCreateProject {}

export interface IFormCreateProject {
	branchUuid: string;
	branchCode: string;
	name: string;
	type: number | null;
	managerUuid: string;
	expectBudget: number;
	realBudget: number;
	reserveBudget: number;
	totalInvest: number;
	matp: string;
	maqh: string;
	xaid: string;
	address: string;
	description: string;
	expectStart: string;
	expectEnd: string;
	realStart: string;
}
