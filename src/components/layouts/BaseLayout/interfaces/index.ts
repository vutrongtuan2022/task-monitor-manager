export interface PropsBaseLayout {
	children: React.ReactNode;
	title: string;
	isImport?: boolean;
	isExport?: boolean;
}

export interface TContextBaseLayout {
	showFull?: boolean;
	setShowFull?: (boolean: boolean) => void;
}
