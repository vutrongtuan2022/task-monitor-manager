export interface PropsProjectReportOverview {}

export interface IProjectReportOverview {
	name: string;
	code: string;
	state: number;
	progress: number;
	branch: {
		code: string;
		name: string;
		uuid: string;
	};
	taskCat: {
		id: number;
		name: string;
		code: string | null;
		uuid: string;
	};
	digitalFile: string;
	expectBudget: number;
	totalInvest: number;
	realBudget: number;
	reserveBudget: number;
	remainReserveBudget: number;
	accumAmount: number;
	expectStart: string;
	expectEnd: string;
	realStart: string;
	realEnd: string | null;
	created: string;
	description: string;
	uuid: string;
}
