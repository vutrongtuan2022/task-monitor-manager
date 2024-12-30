import axiosClient from '.';

const contractsServices = {
	detailContracts: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Contracts/contract-detail`, data, {
			cancelToken: tokenAxios,
		});
	},
	contractsReportFundpaged: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: number;
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Contracts/contract-detail-funds-paged`, data, {
			cancelToken: tokenAxios,
		});
	},
	listContractsForProject: (
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
		return axiosClient.post(`/Contracts/get-page-list-contracts-for-project`, data, {
			cancelToken: tokenAxios,
		});
	},
	listContractsByActivity: (
		data: {
			uuid: string;
			pageSize: number;
			page: number;
			keyword: string;
			status: number;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Contracts/get-page-list-contracts-by-activity`, data, {
			cancelToken: tokenAxios,
		});
	},
};
export default contractsServices;
