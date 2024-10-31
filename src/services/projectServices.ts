import axiosClient from '.';

const projectServices = {
	listProject: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: number;
			state: number | null;
			userUuid?: string;
			managerUuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Project/get-page-list-project`, data, {
			cancelToken: tokenAxios,
		});
	},
	updateStatus: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Project/update-status-project`, data, {
			cancelToken: tokenAxios,
		});
	},
	updateState: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Project/update-state-project`, data, {
			cancelToken: tokenAxios,
		});
	},
	createProject: (
		data: {
			branchUuid: string;
			name: string;
			type: number;
			employeeUuid: string[];
			managerUuid: string;
			contractorUuid: string[];
			description: string;
			expectBudget: number;
			realBudget: number;
			totalInvest: number;
			reserveBudget: number;
			expectStart: string | null;
			expectEnd: string | null;
			realStart: string | null;
			matp: string;
			maqh: string;
			xaid: string;
			address: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Project/create-project`, data, {
			cancelToken: tokenAxios,
		});
	},
	detailProgressFundProject: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Project/progress-fund-project`, data, {
			cancelToken: tokenAxios,
		});
	},
	detailInfoProject: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Project/project-detail`, data, {
			cancelToken: tokenAxios,
		});
	},
	detailProgressProject: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Project/progress-project`, data, {
			cancelToken: tokenAxios,
		});
	},
	detailBudgetProject: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Project/project-budget-detail`, data, {
			cancelToken: tokenAxios,
		});
	},
	updateBudgetProject: (
		data: {
			uuid: string;
			expectBudget: number;
			totalInvest: number;
			realBudget: number;
			reserveBudget: number;
			annual: {
				year: number;
				budget: number;
			}[];
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Project/update-budget-project`, data, {
			cancelToken: tokenAxios,
		});
	},
	updateGeneralProject: (
		data: {
			uuid: string;
			branchUuid: string;
			name: string;
			type: number;
			employeeUuid: string[];
			managerUuid: string;
			expectStart: string | null;
			expectEnd: string | null;
			realStart: string | null;
			matp: string;
			maqh: string;
			xaid: string;
			address: string;
			description: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Project/update-general-project`, data, {
			cancelToken: tokenAxios,
		});
	},
	categoryProject: (
		data: {
			keyword: string;
			status: number;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Project/category-project`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default projectServices;
