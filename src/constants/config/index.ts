import {ArchiveBook, DocumentForward, DocumentText1, ElementEqual, Moneys, Note, People} from 'iconsax-react';
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
	ChangePassword = '/profile?_action=change-password',

	Login = '/auth/login',

	Home = '/',

	Project = '/',
	ProjectCreate = '/project/create',
	ProjectInfo = '/project/infor-project',
	ProjectContractor = '/project/infor-contractor',
	ProjectDisbursementProgress = '/project/disbursement-progress',
	ProjectPlanningCapital = '/project/planning-capital',
	ProjectWorkReport = '/project/work-report',
	UpdateInfoProject = '/project/update/infor-project',
	UpdateInfoCapital = '/project/update/info-capital',
	UpdateDisbursementProgress = '/project/update/update-disbursement-progress',
	UpdateInfoContractor = '/project/update/infor-contractor',
	ProjectContract = '/project/contract',

	ReportWork = '/report-work',

	ReportDisbursement = '/report-disbursement',

	ContractReportDisbursement = '/report-disbursement/contract',

	WorkUser = '/work-user',
	ContractWork = '/work-user/contract',
	AppendicesWork = '/work-user/appendices',

	User = '/user',

	ReportOverview = '/report-overview',
}

export const Menu: {
	title: string;
	path: string;
	pathActive?: string;
	icon: any;
}[] = [
	// {
	// 	title: 'Tổng quan',
	// 	path: PATH.Home,
	// 	pathActive: PATH.Home,
	// 	icon: ElementEqual,
	// },
	{
		title: 'Quản lý dự án',
		path: PATH.Project,
		pathActive: '/project',
		icon: DocumentText1,
	},
	{
		title: 'Công việc nhân viên',
		path: PATH.WorkUser,
		pathActive: PATH.WorkUser,
		icon: Note,
	},
	{
		title: 'Báo cáo công việc',
		path: PATH.ReportWork,
		pathActive: PATH.ReportWork,
		icon: DocumentForward,
	},
	{
		title: 'Báo cáo giải ngân',
		path: PATH.ReportDisbursement,
		pathActive: PATH.ReportDisbursement,
		icon: Moneys,
	},
	{
		title: 'Quản lý nhân viên',
		path: PATH.User,
		pathActive: PATH.User,
		icon: People,
	},
	{
		title: 'Báo cáo tổng hợp',
		path: PATH.ReportOverview,
		pathActive: PATH.ReportOverview,
		icon: ArchiveBook,
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
