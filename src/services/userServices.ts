import axiosClient from '.';

const userServices = {
	categoryUser: (
		data: {
			keyword: string;
			roleUuid: string;
			status: number;
			type: number;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/User/category-user`, data, {
			cancelToken: tokenAxios,
		});
	},
	listUser: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: number | null;
			isHaveAcc: number | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/User/get-page-list-user`, data, {
			cancelToken: tokenAxios,
		});
	},
	detailUser: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/User/detail-user`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default userServices;
