export interface PropsIconCustom {
	icon: React.ReactNode;
	tooltip: string;
	onClick?: () => void;
	color?: string;
	href?: string;
	type?: 'edit' | 'delete' | 'view' | 'create';
	disnable?: boolean;
}
