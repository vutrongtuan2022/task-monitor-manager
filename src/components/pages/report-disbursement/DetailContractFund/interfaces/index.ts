export interface PropsDetailContractFund {
	userContractFund: {
		contractUuid: string;
		contractFundUuid: string;
		code: string;
	};
	onClose: () => void;
}
export interface IDetailContractFund {
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
		contractorLinks: {
			uuid: string;
			contractor: {
				uuid: string;
				code: string;
				name: string;
				state: number;
				contractorLinkUuid: string;
				contractorCat: {
					uuid: string;
					id: number;
					code: string;
					name: string;
					isDefault: number;
				}[];
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
		}[];
		startDate: string;
	};
	contractorLinks: {
		uuid: string;
		contractor: {
			uuid: string;
			code: string;
			name: string;
			state: number;
			contractorLinkUuid: string;
			contractorCat: {
				uuid: string;
				id: number;
				code: string;
				name: string;
				isDefault: number;
			}[];
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
	}[];
	startDate: string;
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
			member: {
				uuid: string;
				fullname: string;
				code: string;
			}[];
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
			contractorLinks: {
				uuid: string;
				contractor: {
					uuid: string;
					code: string;
					name: string;
					state: number;
					contractorLinkUuid: string;
					contractorCat: {
						uuid: string;
						id: number;
						code: string;
						name: string;
						isDefault: number;
					}[];
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
			}[];
			startDate: string;
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
	releaseDate: string;
	totalContractor: number;
	totalContractorCat: number;
	pnContract: {
		uuid: string;
		pn: {
			uuid: string;
			code: string;
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
				member: {
					uuid: string;
					fullname: string;
					code: string;
				}[];
				branch: {
					uuid: string;
					code: string;
					name: string;
				};
			};
			state: number;
			numberingDate: string;
			noticeDate: string;
			approvalDate: string;
			rejectReason: string;
		};
		contract: {
			uuid: string;
			code: string;
			state: number;
			status: number;
			parent: string;
			contractorLinks: {
				uuid: string;
				contractor: {
					uuid: string;
					code: string;
					name: string;
					state: number;
					contractorLinkUuid: string;
					contractorCat: {
						uuid: string;
						id: number;
						code: string;
						name: string;
						isDefault: number;
					}[];
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
			}[];
			startDate: string;
		};
		contractor: {
			uuid: string;
			contractor: {
				uuid: string;
				code: string;
				name: string;
				state: number;
				contractorLinkUuid: string;
				contractorCat: {
					uuid: string;
					id: number;
					code: string;
					name: string;
					isDefault: number;
				}[];
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
		};
		amount: number;
		accumAmount: number;
		type: number;
		note: string;
		status: number;
		totalReverseAmount: number;
		remainingAmount: number;
		advanceAmount: number;
	};
	contractorInfos: {
		contractorName: string;
		contractorCatName: string;
		createDate: string;
	}[];
	note: string;
}
