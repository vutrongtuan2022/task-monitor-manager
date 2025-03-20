export interface PropsTableChecked {
	data: any;
	column: {
		title: string | React.ReactNode;
		render: any;
		className?: string;
		checkBox?: boolean;
		textAlign?: string;
		fixedLeft?: boolean;
		fixedRight?: boolean;
	}[];
	fixedHeader?: boolean;

	// Props checked data
	handleCheckedAll?: (e: any) => void;
	isCheckedAll?: boolean;
	handleCheckedRow?: (e: any, data: any) => void;
	handleIsCheckedRow?: (data: any) => boolean;
}
