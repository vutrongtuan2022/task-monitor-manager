export interface PropsLayoutPages {
	children: React.ReactNode;
	listPages: {
		title: string;
		path: string;
	}[];
	action?: React.ReactNode;
}
