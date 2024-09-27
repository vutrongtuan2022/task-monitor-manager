import {TYPE_ACCOUNT} from '~/constants/config/enum';
import axiosClient from '.';

const authServices = {
	login: (
		data: {
			userName: string;
			password: string;
			type: TYPE_ACCOUNT;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Auth/login`, data, {
			cancelToken: tokenAxios,
		});
	},
	logout: (data: {}, tokenAxios?: any) => {
		return axiosClient.post(`/Auth/logout`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default authServices;
