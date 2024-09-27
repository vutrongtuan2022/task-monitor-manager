import {ElementEqual} from 'iconsax-react';
import icons from '../images/icons';
import {TYPE_DATE} from './enum';

export const MAXIMUM_FILE = 10; //MB

export const allowFiles = [
	'application/pdf',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'image/jpeg',
	'image/jpg',
	'image/png',
];

export enum PATH {
	Any = 'any',
	ForgotPassword = '/auth/forgot-password',

	Profile = '/profile',
	ChangePassword = '/change-password',

	Login = '/auth/login',

	Home = '/',
}

export const Menu: {
	title: string;
	path: string;
	pathActive?: string;
	icon: any;
}[] = [
	{
		title: 'Tổng quan',
		path: PATH.Home,
		pathActive: PATH.Home,
		icon: ElementEqual,
	},
];

export const KEY_STORE = 'task-monitor-manager';

export const ListOptionTimePicker: {
	name: string;
	value: number;
}[] = [
	{
		name: 'Hôm nay',
		value: TYPE_DATE.TODAY,
	},
	{
		name: 'Tuần này',
		value: TYPE_DATE.THIS_WEEK,
	},
	{
		name: 'Tuần trước',
		value: TYPE_DATE.LAST_WEEK,
	},
	{
		name: 'Tháng này',
		value: TYPE_DATE.THIS_MONTH,
	},
	{
		name: 'Tháng trước',
		value: TYPE_DATE.LAST_MONTH,
	},
	{
		name: 'Năm này',
		value: TYPE_DATE.THIS_YEAR,
	},
	{
		name: 'Lựa chọn',
		value: TYPE_DATE.LUA_CHON,
	},
];
