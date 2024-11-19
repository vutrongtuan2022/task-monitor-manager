import axiosClient from '.';

const contractorServices = {
	categoryContractor: (
		data: {
			keyword: string;
			status: number;
			type: number | null;
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
			contractorCat: number | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Contractor/get-page-list-contractor-project`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default contractorServices;
