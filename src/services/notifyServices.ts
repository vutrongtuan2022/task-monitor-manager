import axiosClient from '.';

const notifyServices = {
	countUnseenNotify: (data: {}, tokenAxios?: any) => {
		return axiosClient.post(`/Notify/cout-unseen-notify`, data, {
			cancelToken: tokenAxios,
		});
	},
	getListNotify: (
		data: {
			pageSize: number;
			page: number;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Notify/get-page-list-notify`, data, {
			cancelToken: tokenAxios,
		});
	},
	updateStateNotify: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Notify/update-state-notify`, data, {
			cancelToken: tokenAxios,
		});
	},
	updateStateAllNotify: (data: {}, tokenAxios?: any) => {
		return axiosClient.post(`/Notify/update-state-all-notify`, data, {
			cancelToken: tokenAxios,
		});
	},
};
export default notifyServices;
