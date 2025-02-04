import axiosClient from '.';

const contractorServices = {
	categoryContractor: (
		data: {
			keyword: string;
			status: number;
			type: string;
			uuid?: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Contractor/category-contractor`, data, {
			cancelToken: tokenAxios,
		});
	},
	getContractorForProject: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: number;
			projectUuid: string;
			contractorUuid: string;
			contractorCat: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Contractor/get-page-list-contractor-project`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default contractorServices;
