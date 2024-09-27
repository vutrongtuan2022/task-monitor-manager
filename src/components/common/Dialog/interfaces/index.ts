export interface PropsDialog {
	open: boolean;
	title: string;
	note?: string;
	icon?: any;
	onClose: () => any;
	onSubmit: () => any;
	titleCancel?: string;
	titleSubmit?: string;
	type?: 'primary' | 'error' | 'warning';
}
