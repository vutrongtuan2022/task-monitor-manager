export interface PropsDetailReportDisbursement {}

export interface IDetailContractFund {
	project: {
		code: string;
		name: string;
		state: number;
		uuid: string;
		branch: {
			code: string;
			name: string;
			uuid: string;
		};
	};
	creator: {
		fullname: string;
		code: string;
		uuid: string;
	};
	releasedMonth: number;
	releasedYear: number;
	contractCount: number;
	totalAmount: number;
	sendDate: string | null;
	state: number;
	note: string;
	rejectedReason: string | null;
	uuid: string;
}
export interface IContractFund {
	uuid: string;
	code: string;
	state: number;
	status: number;
	parent: {
		uuid: string;
		code: string;
		state: number;
		status: number;
		parent: string;
		contractorLinks: [
			{
				uuid: string;
				contractor: {
					uuid: string;
					code: string;
					name: string;
					state: number;
					contractorLinkUuid: string;
					contractorCat: [
						{
							uuid: string;
							id: number;
							code: string;
							name: string;
							isDefault: number;
						}
					];
					amount: number;
				};
				contractorCat: {
					uuid: string;
					id: number;
					code: string;
					name: string;
					isDefault: number;
				};
				status: number;
			}
		];
		startDate: string;
		created: string;
	};
	contractorLinks: [
		{
			uuid: string;
			contractor: {
				uuid: string;
				code: string;
				name: string;
				state: number;
				contractorLinkUuid: string;
				contractorCat: [
					{
						uuid: string;
						id: number;
						code: string;
						name: string;
						isDefault: number;
					}
				];
				amount: number;
			};
			contractorCat: {
				uuid: string;
				id: number;
				code: string;
				name: string;
				isDefault: number;
			};
			status: number;
		}
	];
	startDate: string;
	created: string;
	activity: {
		uuid: string;
		name: string;
		state: number;
		project: {
			uuid: string;
			code: string;
			name: string;
			created: string;
			state: number;
			leader: {
				uuid: string;
				fullname: string;
				code: string;
			};
			member: [
				{
					uuid: string;
					fullname: string;
					code: string;
				}
			];
			branch: {
				uuid: string;
				code: string;
				name: string;
			};
		};
		contracts: {
			uuid: string;
			code: string;
			state: number;
			status: number;
			parent: string;
			contractorLinks: [
				{
					uuid: string;
					contractor: {
						uuid: string;
						code: string;
						name: string;
						state: number;
						contractorLinkUuid: string;
						contractorCat: [
							{
								uuid: string;
								id: number;
								code: string;
								name: string;
								isDefault: number;
							}
						];
						amount: number;
					};
					contractorCat: {
						uuid: string;
						id: number;
						code: string;
						name: string;
						isDefault: number;
					};
					status: number;
				}
			];
			startDate: string;
			created: string;
		};
		task: {
			uuid: string;
			name: string;
			parent: string;
		};
	};
	projectAmount: number;
	reverseAmount: number;
	totalAmount: number;
	note: string;
}
