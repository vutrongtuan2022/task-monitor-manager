import axiosClient from '.';

const contractsFundServices = {
	detailContractFund: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/ContractFund/contractfund-detail`, data, {
			cancelToken: tokenAxios,
		});
	},
	ContractFundDetailPaged: (
		data: {
			pageSize: number;
			page: number;
			keyword: string | null;
			status: number;
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/ContractFund/contractfund-detai-paged`, data, {
			cancelToken: tokenAxios,
		});
	},
	detailContractFundFundPaged: (
		data: {
			pageSize: number;
			page: number;
			keyword: string | null;
			status: number;
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/ContractFund/contractfund-detail-contracts-paged`, data, {
			cancelToken: tokenAxios,
		});
	},
	getPmContractFundPaged: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: number;
			month: number | null;
			year: number | null;
			state: number | null;
			userUuid: string;
			projectUuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/ContractFund/get-pm-contract-funds-paged`, data, {
			cancelToken: tokenAxios,
		});
	},
	approveContractFund: (
		data: {
			uuid: string;
			isApproved: number;
			reason: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/ContractFund/pm-approve-contract-fund`, data, {
			cancelToken: tokenAxios,
		});
	},
	contractfundDetailPagedContractContractfund: (
		data: {
			pageSize: number;
			page: number;
			contractUuid: string;
			contractFundUuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/ContractFund/contractfund-detail-paged-contract-contractfund`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default contractsFundServices;
