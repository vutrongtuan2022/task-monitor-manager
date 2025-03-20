export interface PropsTableListWorkCancel {
	reportUuid: string;
	queryKeys: number[];
	onClose: () => void;
}

export interface IWorkCancel {
	activityReportUuid: string;
	activity: {
		name: string;
		uuid: string;
	};
	parent: {
		name: string;
		uuid: string;
	};
	stage: number;
	megaType: string;
	isInWorkFlow: boolean;
	state: number;
	completeState: number;
}
