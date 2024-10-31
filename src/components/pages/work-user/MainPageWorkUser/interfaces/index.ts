export interface PropsMainPageWorkUser {}

export interface IWorkUser {
	report: {
		title: string;
		state: number | null;
		status: number;
		month: number;
		year: number;
		project: {
			code: string;
			name: string;
			state: number;
			uuid: string;
		};
		reporter: {
			fullname: string;
			code: string;
			uuid: string;
		};
		uuid: string;
	};
	activity: {
		name: string;
		state: number;
		uuid: string;
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
