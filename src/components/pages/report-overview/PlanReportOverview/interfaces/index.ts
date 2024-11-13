export interface PropsPlanReportOverview {}

export interface IPlanReportOverview {
	categoryTask: {
		name: string;
		uuid: string;
	};
	categoryProject: {
		code: string;
		name: string;
		state: number;
		uuid: string;
	};
	name: string;

	state: number;
	stage: number | null;
	status: number;
	megatype: string | null;

	reporter: {
		fullname: string;
		code: string;
		uuid: string;
	};
	activityType: number;
	deadlineStage: number;
	digitalization: number;

	deadline: string;

	uuid: string;
	isWorkFlow: number;
}
