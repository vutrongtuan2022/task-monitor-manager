import axiosClient from '.';

const taskCatServices = {
	categoryTaskCat: (
		data: {
			keyword: string;
			status: number;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/TaskCat/category-task-cat`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default taskCatServices;
