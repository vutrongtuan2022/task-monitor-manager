import axiosClient from '.';

const contractorServices = {
	categoryContractor: (
		data: {
			keyword: string;
			status: number;
			type: number;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Contractor/category-contractor`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default contractorServices;
