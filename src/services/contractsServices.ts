import axiosClient from '.';

const contractsServices = {
	upsertContracts: (
		data: {
			uuid: string;
			activityUuid: string;
			code: string;
			contractorAndCat: {
				contractorUuid: string;
				contractorCatUuid: string;
				amountInContract: number;
			}[];
			startDate: string;
			totalDayAdvantage: number;
			amount: number;
			contractExecutionAmount: number;
			advanceGuaranteeAmount: number;
			contractExecutionEndDate: string | null;
			advanceGuaranteeEndDate: string | null;
			contractParentUuid?: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Contracts/upsert-contracts`, data, {
			cancelToken: tokenAxios,
		});
	},
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
	detailPageListContractors: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: number;
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Contracts/contract-detail-page-list-contractors`, data, {
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
			contractorCat: string;
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
	listContractsByAddium: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: number;
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Contracts/get-page-list-contracts-addium-by-activity`, data, {
			cancelToken: tokenAxios,
		});
	},
	changeContracts: (
		data: {
			uuid: string;
			activityUuid: string;
			code: string;
			contractorAndCat: {
				contractorUuid: string;
				contractorCatUuid: string;
				amountInContract: number;
			}[];
			startDate: string | null;
			totalDayAdvantage: number;
			amount: number;
			contractExecutionAmount: number;
			advanceGuaranteeAmount: number;
			contractExecutionEndDate: string | null;
			advanceGuaranteeEndDate: string | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Contracts/change-contracts`, data, {
			cancelToken: tokenAxios,
		});
	},
	detailContractsAddium: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Contracts/contract-for-contract-addium`, data, {
			cancelToken: tokenAxios,
		});
	},
	insertAddendum: (
		data: {
			uuid: string;
			activityUuid: string;
			code: string;
			contractorAndCat: {
				contractorUuid: string;
				contractorCatUuid: string;
				amountInContract: number;
			}[];
			startDate: string | null;
			totalDayAdvantage: number;
			amount: number;
			contractExecutionAmount: number;
			advanceGuaranteeAmount: number;
			contractExecutionEndDate: string | null;
			advanceGuaranteeEndDate: string | null;
			contractParentUuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Contracts/insert-contracts-addendum`, data, {
			cancelToken: tokenAxios,
		});
	},
};
export default contractsServices;
