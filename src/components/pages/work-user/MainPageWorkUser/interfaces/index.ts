export interface PropsMainPageWorkUser {}

export interface IWorkUser {
	report: {
		uuid: string;
		title: string;
		state: number;
		status: number;
		month: number;
		year: number;
		project: {
			uuid: string;
			code: string;
			name: string;
			state: number;
		};
		reporter: {
			uuid: string;
			fullname: string;
			code: string;
		};
	};
	activity: {
		uuid: string;
		name: string;
		state: number;
	};
	type: number;
	isInWorkflow: boolean;
	issue: string;
	progress: number;
	deadlineState: number;
	dayDelayed: number;
	activityState: number;
	digitalizedState: number;
	activityStatus: number;
	stage: number;
}
