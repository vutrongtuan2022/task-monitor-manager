import axiosClient from '.';

const reportServices = {
	listReportManager: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: number | null;
			month: number | null;
			year: number | null;
			state: number | null;
			completeState: number | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Report/pm-get-page-list-report`, data, {
			cancelToken: tokenAxios,
		});
	},
	detailReport: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Report/user-get-report-detail`, data, {
			cancelToken: tokenAxios,
		});
	},
	approveReport: (
		data: {
			uuid: string;
			note: string;
			isApprove: number;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Report/approve-report`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default reportServices;
