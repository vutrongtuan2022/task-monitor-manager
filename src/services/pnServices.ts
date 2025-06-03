import axiosClient from '.';

const pnServices = {
	listPN: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: number | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/PN/get-page-list-pn`, data, {
			cancelToken: tokenAxios,
		});
	},
	detailPN: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/PN/detail-pn`, data, {
			cancelToken: tokenAxios,
		});
	},
	categoryPN: (
		data: {
			keyword: string;
			status: number | null;
			uuid: string;
			excludeState: number | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/PN/category-pn`, data, {
			cancelToken: tokenAxios,
		});
	},
	updateStatusPN: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/PN/update-status`, data, {
			cancelToken: tokenAxios,
		});
	},
	upsertPN: (
		data: {
			uuid: string;
			projectUuid: string;
			code: string;
			numberingDate: string;
			totalAmount: number;
			contracts: {
				contractUuid: string;
				amount: number;
				type: number;
				note: string;
			}[];
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/PN/upsert-status`, data, {
			cancelToken: tokenAxios,
		});
	},
	getPNForUpdate: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/PN/get-pn-for-update`, data, {
			cancelToken: tokenAxios,
		});
	},
	updateNoticeDate: (
		data: {
			uuid: string;
			noticeDate: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/PN/update-notice-date`, data, {
			cancelToken: tokenAxios,
		});
	},
	approvePN: (
		data: {
			uuid: string;
			action: number;
			reason: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/PN/approve-pn`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default pnServices;
