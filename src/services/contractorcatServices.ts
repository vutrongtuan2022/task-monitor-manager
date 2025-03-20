import axiosClient from '.';

const contractorcatServices = {
	categoryContractorCat: (
		data: {
			keyword: string;
			status: number;
			isDefault?: number;
			contractorUuid?: string;
			activityUuid?: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/ContractorCat/category-contractor-cat`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default contractorcatServices;
