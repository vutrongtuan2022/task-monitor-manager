import axiosClient from '.';
const accountServices = {
	sendOTP: (
		data: {
			email: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Account/send-otp`, data, {
			cancelToken: tokenAxios,
		});
	},
	enterOTP: (data: {email: string; otp: string}, tokenAxios?: any) => {
		return axiosClient.post(`/Account/enter-otp`, data, {
			cancelToken: tokenAxios,
		});
	},
	changePassForget: (data: {email: string; otp: string; newPass: string}, tokenAxios?: any) => {
		return axiosClient.post(`/Account/change-pass-forget`, data, {
			cancelToken: tokenAxios,
		});
	},
};
export default accountServices;
