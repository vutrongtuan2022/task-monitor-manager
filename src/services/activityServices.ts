import axiosClient from '.';

const activityServices = {
	listActivity: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: number | null;
			projectUuid: string;
			activityType: number | null;
			state: number | null;
			deadLine: number | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Activity/get-page-list-activity`, data, {
			cancelToken: tokenAxios,
		});
	},
	listActivityForAction: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: number;
			month: number | null;
			year: number | null;
			state: number | null;
			type: number | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Activity/get-page-activities-for-action`, data, {
			cancelToken: tokenAxios,
		});
	},
	listActivityForActionNew: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: number;
			month: number | null;
			year: number | null;
			state: number | null;
			type: number | null;
			userUuid: string;
			projectUuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Activity/get-page-activities-for-action-new`, data, {
			cancelToken: tokenAxios,
		});
	},
	listActyvityLastMonth: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: number | null;
			state: number | null;
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Activity/get-page-list-user-activity-last-month`, data, {
			cancelToken: tokenAxios,
		});
	},
	listActyvityInReport: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: number | null;
			state: number | null;
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Activity/get-page-activity-in-report`, data, {
			cancelToken: tokenAxios,
		});
	},
	listActivityLastMonth: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: number | null;
			state: number | null;
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Activity/get-page-list-user-activity-last-month`, data, {
			cancelToken: tokenAxios,
		});
	},
	getDetailActivityContract: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Activity/get-detail-activity-and-contract`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default activityServices;
