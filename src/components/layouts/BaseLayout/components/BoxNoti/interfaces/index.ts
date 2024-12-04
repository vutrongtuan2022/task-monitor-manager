export interface PropsBoxNoti {
	countUnSeenNoti: number;
	onClose: () => void;
}

export interface INotify {
	title: string;
	content: string;
	data: {
		overviewUuid: string;
		reportUuid: string;
		projectUuid: string;
		contractUuid: string;
		contractFundUuid: string;
	};
	accUuid: string;
	created: string;
	type: number;
	state: number;
	uuid: string;
}
