import axiosClient from '.';

const contractorcatServices = {
	categoryContractorCat: (
		data: {
			keyword: string;
			status: number;
			isDefault?: number;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/ContractorCat/category-contractor-cat`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default contractorcatServices;
