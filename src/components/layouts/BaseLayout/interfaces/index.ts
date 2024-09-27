export interface PropsBaseLayout {
	children: React.ReactNode;
	title: string;
	isAction?: boolean;
}

export interface TContextBaseLayout {
	showFull?: boolean;
	setShowFull?: (boolean: boolean) => void;
}
