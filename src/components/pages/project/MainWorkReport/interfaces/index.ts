export interface PropsMainWorkReport {}

export interface IDetailProgressProject {
	countMonthly: number;
	countYearly: number;
	countInProject: number;
	totalMonthly: number;
	totalYearly: number;
	totalInProject: number;
	categoryProjectDTO: {
		uuid: string;
		code: string;
		name: string;
		state: number;
	};
}

export interface IActivitiProject {
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
	stage: number;
	status: number;
	megatype: string;
	reporter: {
		code: string;
		name: string;
		state: number;
		uuid: string;
	};
	activityType: number;
	deadline: string;
	deadlineStage: number;
	uuid: string;
}
