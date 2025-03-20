import axiosClient from '.';

const branchesServices = {
	categoryBranches: (
		data: {
			keyword: string;
			status: number;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Branches/category-branches`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default branchesServices;
