import axiosClient from '.';

const projectFundServices = {
	listProjectFund: (
		data: {
			pageSize: number;
			page: number;
			projectUuid: string;
			approved: number | null;
			status: number;
			year: number | null;
			month: number | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/ProjectFund/get-page-list-project-fund`, data, {
			cancelToken: tokenAxios,
		});
	},
	listProjectFundAll: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			year: number | null;
			month: number | null;
			approved: number | null;
			status: number | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/ProjectFund/get-page-list-project-fund-all`, data, {
			cancelToken: tokenAxios,
		});
	},
	detailProjectFund: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/ProjectFund/get-detail-project-fund`, data, {
			cancelToken: tokenAxios,
		});
	},
	approvedFund: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/ProjectFund/approved-fund`, data, {
			cancelToken: tokenAxios,
		});
	},
	rejectFund: (
		data: {
			uuid: string;
			feedback: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/ProjectFund/reject-fund`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default projectFundServices;
