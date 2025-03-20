interface ISelectValue {
	uuid: string | number;
	title: string;
	code?: string;
	disable?: boolean;
}

export interface PropsSelectMany {
	label?: string | React.ReactNode;
	placeholder: string;
	readOnly?: boolean;
	isSearch?: boolean;
	listData: ISelectValue[];
	value: ISelectValue[];
	setValue: (any: ISelectValue) => void;
}
