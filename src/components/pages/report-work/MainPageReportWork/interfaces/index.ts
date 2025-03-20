export interface PropsMainPageReportWork {}

export interface IReportWork {
	project: {
		code: string;
		name: string;
		state: number;
		uuid: string;
		leader: {
			fullname: string;
			code: string;
			uuid: string;
		};
	};
	reporter: {
		fullname: string;
		code: string;
		uuid: string;
	};
	month: number;
	year: number;
	completed: string;
	created: string;
	totalActivity: number;
	completedActivity: number;
	title: string;
	completeState: number;
	state: number;
	status: number;
	uuid: string;
}
