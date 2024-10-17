import axiosClient from '.';

const overviewServices = {
	listOverview: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: number;
			year: number | null;
			month: number | null;
			reporterUuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/OverviewReport/get-page-list-overview-report`, data, {
			cancelToken: tokenAxios,
		});
	},
	detailOverview: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/OverviewReport/detail-overview-report`, data, {
			cancelToken: tokenAxios,
		});
	},
	detailProjectOverview: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/OverviewReport/detail-project-overview-report`, data, {
			cancelToken: tokenAxios,
		});
	},
	detailDisbursementOverview: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/OverviewReport/fun-report-overview-report`, data, {
			cancelToken: tokenAxios,
		});
	},
	activityOverview: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: number;
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/OverviewReport/get-page-list-activity-report-overview-report`, data, {
			cancelToken: tokenAxios,
		});
	},
	nextReportOverview: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: number;
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/OverviewReport/get-page-list-activity-next-report-overview-report`, data, {
			cancelToken: tokenAxios,
		});
	},
};
export default overviewServices;
