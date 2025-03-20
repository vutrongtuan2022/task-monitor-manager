import React, {useState} from 'react';

import {IDetailProgressContractFund, IContractsForProject, PropsUpdateDisbursementProgress} from './interfaces';
import styles from './UpdateDisbursementProgress.module.scss';
import LayoutPages from '~/components/layouts/LayoutPages';
import {PATH} from '~/constants/config';
import {useRouter} from 'next/router';
import Button from '~/components/common/Button';
import Pagination from '~/components/common/Pagination';
import DataWrapper from '~/components/common/DataWrapper';
import Table from '~/components/common/Table';
import FilterCustom from '~/components/common/FilterCustom';
import GridColumn from '~/components/layouts/GridColumn';
import Progress from '~/components/common/Progress';
import {clsx} from 'clsx';
import {convertCoin} from '~/common/funcs/convertCoin';
import Breadcrumb from '~/components/common/Breadcrumb';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import {QUERY_KEY, STATE_CONTRACT_WORK, STATE_PROJECT, STATUS_CONFIG} from '~/constants/config/enum';
import Dialog from '~/components/common/Dialog';
import icons from '~/constants/images/icons';
import Moment from 'react-moment';
import projectServices from '~/services/projectServices';
import Loading from '~/components/common/Loading';
import contractsServices from '~/services/contractsServices';
import contractorcatServices from '~/services/contractorcatServices';
import Search from '~/components/common/Search';
import Tippy from '@tippyjs/react';
import contractorServices from '~/services/contractorServices';
import Link from 'next/link';
import StateActive from '~/components/common/StateActive';
import IconCustom from '~/components/common/IconCustom';
import {AddCircle, ArrangeHorizontalCircle, Edit, PlayCircle} from 'iconsax-react';
import Image from 'next/image';
import PositionContainer from '~/components/common/PositionContainer';
import FormCreateContractProject from '~/components/utils/FormCreateContractProject';
import FromUpdateContractAddendum from '~/components/utils/FromUpdateContractAddendum';
import FormUpdateContract from '~/components/utils/FormUpdateContract';
import FormChangeContract from '~/components/utils/FormChangeContract';
import FormCancelContract from '~/components/utils/FormCancelContract';
import FromCreateContractAddendum from '~/components/utils/FromCreateContractAddendum';

function UpdateDisbursementProgress({}: PropsUpdateDisbursementProgress) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_uuid, _page, _pageSize, _keyword, _contractorUuid, _contractorCat, _action, _contractUuid, _activityUuid, _activityName} =
		router.query;

	const [openDelete, setOpenDelete] = useState<boolean>(false);
	const [openStart, setOpenStart] = useState<boolean>(false);
	const [openFinish, setOpenFinish] = useState<boolean>(false);
	const [openReStart, setOpenReStart] = useState<boolean>(false);

	const {data: detailProgressContractFund} = useQuery<IDetailProgressContractFund>(
		[QUERY_KEY.detail_progress_contract_fund_project, _uuid],
		{
			queryFn: () =>
				httpRequest({
					http: projectServices.progressContractFund({
						uuid: _uuid as string,
					}),
				}),
			select(data) {
				return data;
			},
			enabled: !!_uuid,
		}
	);

	const {data: listContractForProject, isLoading} = useQuery(
		[QUERY_KEY.table_contract_for_project, _uuid, _page, _pageSize, _keyword, _contractorUuid, _contractorCat],
		{
			queryFn: () =>
				httpRequest({
					http: contractsServices.listContractsForProject({
						page: Number(_page) || 1,
						pageSize: Number(_pageSize) || 10,
						keyword: (_keyword as string) || '',
						status: STATUS_CONFIG.ACTIVE,
						projectUuid: (_uuid as string) || '',
						contractorUuid: (_contractorUuid as string) || '',
						contractorCat: (_contractorCat as string) || '',
					}),
				}),
			select(data) {
				return data;
			},
			enabled: !!_uuid,
		}
	);

	const {data: listGroupContractor} = useQuery([QUERY_KEY.dropdown_group_contractor], {
		queryFn: () =>
			httpRequest({
				http: contractorcatServices.categoryContractorCat({
					keyword: '',
					status: STATUS_CONFIG.ACTIVE,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const {data: dropdownContractor} = useQuery([QUERY_KEY.dropdown_contractor, _contractorCat], {
		queryFn: () =>
			httpRequest({
				http: contractorServices.categoryContractor({
					keyword: '',
					status: STATUS_CONFIG.ACTIVE,
					type: (_contractorCat as string) || '',
				}),
			}),
		select(data) {
			return data;
		},
	});

	const funcDeleteProject = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Xóa dự án thành công',
				http: projectServices.updateStatus({
					uuid: _uuid as string,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setOpenDelete(false);
				router.replace(`${PATH.Project}`, undefined, {
					scroll: false,
					shallow: false,
				});
			}
		},
	});

	const funcStartProject = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Dự án được bắt đầu thực hiện!',
				http: projectServices.updateState({
					uuid: _uuid as string,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setOpenStart(false);
				queryClient.invalidateQueries([QUERY_KEY.detail_progress_contract_fund_project]);
			}
		},
	});

	const funcFinishProject = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Kết thúc dự án thành công!',
				http: projectServices.updateState({
					uuid: _uuid as string,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setOpenFinish(false);
				queryClient.invalidateQueries([QUERY_KEY.detail_progress_contract_fund_project]);
			}
		},
	});

	const funcReStartProject = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Tái hoạt động dự án thành công!',
				http: projectServices.updateState({
					uuid: _uuid as string,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setOpenReStart(false);
				queryClient.invalidateQueries([QUERY_KEY.detail_progress_contract_fund_project]);
			}
		},
	});

	return (
		<div className={styles.container}>
			<Loading
				loading={
					funcDeleteProject.isLoading || funcStartProject.isLoading || funcFinishProject.isLoading || funcReStartProject.isLoading
				}
			/>
			<Breadcrumb
				listUrls={[
					{
						path: PATH.Project,
						title: 'Dự án của bạn',
					},
					{
						path: '',
						title: 'Chỉnh sửa dự án',
					},
				]}
			/>
			<LayoutPages
				listPages={[
					{
						title: 'Thông tin chung',
						path: `${PATH.UpdateInfoProject}?_uuid=${_uuid}`,
					},
					{
						title: 'Thông tin kế hoạch vốn',
						path: `${PATH.UpdateInfoCapital}?_uuid=${_uuid}`,
					},
					{
						title: 'Quản lý hợp đồng',
						path: `${PATH.UpdateDisbursementProgress}?_uuid=${_uuid}`,
					},
					{
						title: 'Quản lý nhà thầu',
						path: `${PATH.UpdateInfoContractor}?_uuid=${_uuid}`,
					},
					// {
					// 	title: 'Nhật ký kế hoạch vốn',
					// 	path: `${PATH.ProjectPlanningCapital}?_uuid=${_uuid}`,
					// },
				]}
				action={
					<div className={styles.group_btn}>
						<Button
							p_14_24
							rounded_8
							light-red
							onClick={(e) => {
								e.preventDefault();
								window.history.back();
							}}
						>
							Hủy bỏ
						</Button>
					</div>
				}
			>
				<div className={styles.basic_info}>
					<div className={styles.head}>
						<h4>Tiến độ giải ngân</h4>
					</div>
					<div className={styles.progress_group}>
						<GridColumn col_2>
							<div className={styles.progress}>
								<p>Tổng số hợp đồng</p>
								<div className={styles.progress_label}>
									<span style={{color: '#005994'}}>{detailProgressContractFund?.totalContract}</span>
								</div>
							</div>
							<div className={styles.progress}>
								<p>Số tiền giải ngân lũy kế trong năm (VND)</p>
								<div className={styles.progress_label}>
									<span>{convertCoin(detailProgressContractFund?.totalAccumAmountThisYear || 0)}</span>
								</div>
							</div>

							<div className={styles.progress}>
								<p>Số tiền giải ngân lũy kế đến hiện tại (VND)</p>
								<div className={styles.progress_label}>
									<Progress
										percent={
											(Number(detailProgressContractFund?.countRelease) * 100) /
											Number(detailProgressContractFund?.totalContractAmount)
										}
										width={120}
										isPercent={false}
									/>
									<div>
										<span className={styles.value}>{convertCoin(detailProgressContractFund?.countRelease || 0)}</span> /{' '}
										<span>{convertCoin(detailProgressContractFund?.totalContractAmount || 0)}</span>
									</div>
								</div>
							</div>
						</GridColumn>
					</div>
				</div>
				<div className={clsx(styles.basic_info, styles.mt)}>
					<div className={styles.head}>
						<h4>Danh sách hợp đồng công việc</h4>
					</div>
					<div className={styles.main_table}>
						<div className={styles.head_filt}>
							<div className={styles.main_search}>
								<div className={styles.search}>
									<Search keyName='_keyword' placeholder='Tìm kiếm theo số hợp đồng' />
								</div>
								<div className={styles.filter}>
									<FilterCustom
										isSearch
										name='Nhóm nhà thầu'
										query='_contractorCat'
										listFilter={listGroupContractor?.map((v: any) => ({
											id: v?.uuid,
											name: v?.name,
										}))}
									/>
								</div>
								<div className={styles.filter}>
									<FilterCustom
										isSearch
										name='Tên nhà thầu'
										query='_contractorUuid'
										listFilter={dropdownContractor?.map((v: any) => ({
											id: v?.uuid,
											name: v?.name,
										}))}
									/>
								</div>
							</div>
							<div className={styles.btn}>
								<Button
									p_10_24
									rounded_8
									light-blue
									icon={<Image alt='icon add' src={icons.iconAdd} width={20} height={20} />}
									onClick={() => {
										router.replace({
											pathname: router.pathname,
											query: {
												...router.query,
												_action: 'create-contract-project',
											},
										});
									}}
								>
									Thêm mới hợp đồng
								</Button>
							</div>
						</div>
						<DataWrapper loading={isLoading} data={listContractForProject?.items || []}>
							<Table
								data={listContractForProject?.items || []}
								column={[
									{
										title: 'STT',
										render: (data: IContractsForProject, index: number) => <>{index + 1}</>,
									},
									{
										title: 'Số hợp đồng',
										fixedLeft: true,
										render: (data: IContractsForProject) => (
											<Tippy content='Chi tiết hợp đồng'>
												<Link href={`${PATH.ProjectContract}/${data?.uuid}`} className={styles.link}>
													{data?.code}
												</Link>
											</Tippy>
										),
									},
									{
										title: 'Thuộc hợp đồng',
										render: (data: IContractsForProject) => <b>{data?.parent?.code || '---'}</b>,
									},
									{
										title: 'Giá trị hợp đồng (VND)',
										render: (data: IContractsForProject) => <>{convertCoin(data?.amount)}</>,
									},
									{
										title: 'Ngày ký hợp đồng',
										render: (data: IContractsForProject) =>
											data?.startDate ? <Moment date={data?.startDate} format='DD/MM/YYYY' /> : '---',
									},
									{
										title: 'Thời gian THHĐ (ngày)',
										render: (data: IContractsForProject) => <>{data?.totalDayAdvantage}</>,
									},
									{
										title: 'Tên nhóm nhà thầu',
										render: (data: IContractsForProject) => (
											<>
												{/* {data?.contractorInfos?.length && ( */}
												<Tippy
													content={
														<ol style={{paddingLeft: '16px'}}>
															{[...new Set(data?.contractorInfos?.map((v) => v.contractorCatName))].map(
																(catName, i) => (
																	<li key={i}>{catName}</li>
																)
															)}
														</ol>
													}
												>
													<p className={styles.name}>
														{data?.contractorInfos?.map((v) => v?.contractorCatName).join(', ')}
													</p>
												</Tippy>
												{/* )} */}
											</>
										),
									},
									{
										title: 'Tên nhà thầu',
										render: (data: IContractsForProject) => (
											<>
												<Tippy
													content={
														<ol style={{paddingLeft: '16px'}}>
															{[...new Set(data?.contractorInfos?.map((v) => v.contractorName))].map(
																(catName, i) => (
																	<li key={i}>{catName}</li>
																)
															)}
														</ol>
													}
												>
													<p className={styles.name}>
														{data?.contractorInfos?.map((v) => v?.contractorName).join(', ')}
													</p>
												</Tippy>
											</>
										),
									},
									{
										title: 'Giá trị BLTHHĐ (VND)',
										render: (data: IContractsForProject) => <>{convertCoin(data?.contractExecution?.amount)}</>,
									},
									{
										title: 'Ngày kết thúc BLTHHĐ',
										render: (data: IContractsForProject) =>
											data?.contractExecution?.endDate ? (
												<Moment date={data?.contractExecution?.endDate} format='DD/MM/YYYY' />
											) : (
												'---'
											),
									},
									{
										title: 'Giá trị BLTƯ (VND)',
										render: (data: IContractsForProject) => <>{convertCoin(data?.advanceGuarantee?.amount)}</>,
									},
									{
										title: 'Ngày kết thúc BLTƯ',
										render: (data: IContractsForProject) =>
											data?.advanceGuarantee?.endDate ? (
												<Moment date={data?.advanceGuarantee?.endDate} format='DD/MM/YYYY' />
											) : (
												'---'
											),
									},
									{
										title: 'Tên công việc',
										render: (data: IContractsForProject) => (
											<Tippy content={data?.activityName || '---'}>
												<p className={styles.name}>{data?.activityName || ''}</p>
											</Tippy>
										),
									},
									{
										title: 'Lũy kế giải ngân HĐ (VND)',
										render: (data: IContractsForProject) => <>{convertCoin(data?.accumAmount)}</>,
									},
									{
										title: 'Trạng thái',
										render: (data: IContractsForProject) => (
											<StateActive
												stateActive={data?.state}
												listState={[
													{
														state: STATE_CONTRACT_WORK.EXPIRED,
														text: 'Hết hạn',
														textColor: '#fff',
														backgroundColor: '#16C1F3',
													},
													{
														state: STATE_CONTRACT_WORK.PROCESSING,
														text: 'Đang thực hiện',
														textColor: '#fff',
														backgroundColor: '#06D7A0',
													},
													{
														state: STATE_CONTRACT_WORK.END,
														text: 'Đã hủy',
														textColor: '#fff',
														backgroundColor: '#F37277',
													},
												]}
											/>
										),
									},
									{
										title: 'Hành động',
										fixedRight: true,
										render: (data: IContractsForProject) => (
											<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
												{data?.parent == null && (
													<IconCustom
														type='edit'
														icon={<AddCircle fontSize={20} fontWeight={600} />}
														tooltip='Thêm phụ lục'
														disnable={
															data?.parent != null ||
															data?.state == STATE_CONTRACT_WORK.END ||
															detailProgressContractFund?.categoryProjectDTO?.state == STATE_PROJECT.FINISH
														}
														onClick={() => {
															router.replace({
																pathname: router.pathname,
																query: {
																	...router.query,
																	_action: 'create-contract-addendum',
																	_contractUuid: data?.uuid,
																	_activityUuid: data?.activityDTO?.uuid,
																},
															});
														}}
													/>
												)}

												{data?.parent == null && (
													<IconCustom
														type='delete'
														icon={<PlayCircle fontSize={20} fontWeight={600} />}
														tooltip='Kết thúc hợp đồng'
														disnable={
															data?.parent != null ||
															data?.state == STATE_CONTRACT_WORK.END ||
															data?.state == STATE_CONTRACT_WORK.EXPIRED ||
															detailProgressContractFund?.categoryProjectDTO?.state == STATE_PROJECT.FINISH
														}
														onClick={() => {
															router.replace({
																pathname: router.pathname,
																query: {
																	...router.query,
																	_action: 'open-cancel-contract',
																	_contractUuid: data?.uuid,
																	_activityUuid: data?.activityDTO?.uuid,
																	_activityName: data?.activityName,
																},
															});
														}}
													/>
												)}
												{data?.parent == null && (
													<IconCustom
														icon={<ArrangeHorizontalCircle fontSize={20} fontWeight={600} color='#16C1F3' />}
														tooltip='Thay thế hợp đồng'
														disnable={
															data?.state == STATE_CONTRACT_WORK.END ||
															data?.state == STATE_CONTRACT_WORK.PROCESSING ||
															detailProgressContractFund?.categoryProjectDTO?.state == STATE_PROJECT.FINISH
														}
														onClick={() => {
															router.replace({
																pathname: router.pathname,
																query: {
																	...router.query,
																	_action: 'change-contract',
																	_contractUuid: data?.uuid,
																	_activityUuid: data?.activityDTO?.uuid,
																	_activityName: data?.activityName,
																},
															});
														}}
													/>
												)}

												{data?.parent ? (
													<IconCustom
														type='edit'
														icon={<Edit fontSize={20} fontWeight={600} />}
														tooltip='Chỉnh sửa phụ lục hợp đồng'
														disnable={
															data?.state == STATE_CONTRACT_WORK.END ||
															detailProgressContractFund?.categoryProjectDTO?.state == STATE_PROJECT.FINISH
														}
														onClick={() => {
															router.replace({
																pathname: router.pathname,
																query: {
																	...router.query,
																	_action: 'updateAddendum',
																	_contractUuid: data?.uuid,
																},
															});
														}}
													/>
												) : (
													<IconCustom
														type='edit'
														icon={<Edit fontSize={20} fontWeight={600} />}
														tooltip='Chỉnh sửa hợp đồng'
														disnable={
															data?.state == STATE_CONTRACT_WORK.END ||
															detailProgressContractFund?.categoryProjectDTO?.state == STATE_PROJECT.FINISH
														}
														onClick={() => {
															router.replace({
																pathname: router.pathname,
																query: {
																	...router.query,
																	_action: 'update',
																	_contractUuid: data?.uuid,
																},
															});
														}}
													/>
												)}
											</div>
										),
									},
								]}
							/>
						</DataWrapper>
						<Pagination
							currentPage={Number(_page) || 1}
							pageSize={Number(_pageSize) || 10}
							total={listContractForProject?.pagination?.totalCount || 0}
							dependencies={[_uuid, _pageSize, _keyword, _contractorUuid, _contractorCat]}
						/>
					</div>
				</div>
			</LayoutPages>
			<Dialog
				type='error'
				open={openDelete}
				onClose={() => setOpenDelete(false)}
				title={'Xác nhận xóa'}
				note={'Bạn có chắc chắn muốn xóa dự án này?'}
				onSubmit={funcDeleteProject.mutate}
			/>
			<Dialog
				type='primary'
				open={openStart}
				icon={icons.success}
				onClose={() => setOpenStart(false)}
				title={'Thực hiện dự án'}
				note={'Bạn có chắc chắn muốn thực hiện dự án này không?'}
				onSubmit={funcStartProject.mutate}
			/>
			<Dialog
				type='error'
				open={openFinish}
				onClose={() => setOpenFinish(false)}
				title={'Kết thúc dự án'}
				note={'Bạn có chắc chắn muốn kết thúc dự án này?'}
				onSubmit={funcFinishProject.mutate}
			/>
			<Dialog
				type='primary'
				open={openReStart}
				icon={icons.success}
				onClose={() => setOpenReStart(false)}
				title={'Tái hoạt động dự án'}
				note={'Bạn có chắc chắn muốn tái hoạt động dự án này không?'}
				onSubmit={funcStartProject.mutate}
			/>
			<Dialog
				type='error'
				open={_action == 'open-cancel-contract' && !!_contractUuid && !!_contractUuid && !!_activityUuid && !!_activityName}
				title='Kết thúc hợp đồng'
				note={
					<span>
						Bạn có chắn chắn muốn kết thúc hợp đồng không? <br />
						Nếu kết thúc hợp đồng thì phải thêm hợp đồng mới!
					</span>
				}
				titleCancel='Hủy bỏ'
				titleSubmit='Thêm mới hợp đồng'
				onClose={() => {
					const {_action, _contractUuid, _activityUuid, _activityName, ...rest} = router.query;

					router.replace({
						pathname: router.pathname,
						query: {
							...rest,
						},
					});
				}}
				onSubmit={() => {
					router.replace({
						pathname: router.pathname,
						query: {
							...router.query,
							_action: 'open-form-cancel-contract',
						},
					});
				}}
			/>
			{/* Thêm phụ lục hợp đồng */}
			<PositionContainer
				open={_action == 'create-contract-addendum' && !!_contractUuid && !!_contractUuid && !!_activityUuid}
				onClose={() => {
					const {_action, _contractUuid, _activityUuid, ...rest} = router.query;

					router.replace({
						pathname: router.pathname,
						query: {
							...rest,
						},
					});
				}}
			>
				<FromCreateContractAddendum
					uuidActivity={_activityUuid as string}
					uuidContract={_contractUuid as string}
					queryKeys={[QUERY_KEY.table_contract_for_project]}
					onClose={() => {
						const {_action, _contractUuid, _activityUuid, ...rest} = router.query;

						router.replace({
							pathname: router.pathname,
							query: {
								...rest,
							},
						});
					}}
				/>
			</PositionContainer>
			{/* Kết thúc hợp đồng */}
			<PositionContainer
				open={_action == 'open-form-cancel-contract' && !!_contractUuid && !!_contractUuid && !!_activityUuid && !!_activityName}
				onClose={() => {
					const {_action, _contractUuid, _activityUuid, _activityName, ...rest} = router.query;

					router.replace({
						pathname: router.pathname,
						query: {
							...rest,
						},
					});
				}}
			>
				<FormCancelContract
					uuidActivity={_activityUuid as string}
					uuidContract={_contractUuid as string}
					nameActivity={_activityName as string}
					queryKeys={[QUERY_KEY.table_contract_for_project]}
					onClose={() => {
						const {_action, _contractUuid, _activityUuid, _activityName, ...rest} = router.query;

						router.replace({
							pathname: router.pathname,
							query: {
								...rest,
							},
						});
					}}
				/>
			</PositionContainer>

			{/* Thay thế hợp đồng */}
			<PositionContainer
				open={_action == 'change-contract' && !!_contractUuid && !!_contractUuid && !!_activityUuid && !!_activityName}
				onClose={() => {
					const {_action, _contractUuid, _activityUuid, _activityName, ...rest} = router.query;

					router.replace({
						pathname: router.pathname,
						query: {
							...rest,
						},
					});
				}}
			>
				<FormChangeContract
					uuidActivity={_activityUuid as string}
					uuidContract={_contractUuid as string}
					nameActivity={_activityName as string}
					queryKeys={[
						QUERY_KEY.table_contract_for_project,
						QUERY_KEY.detail_activity_contract,
						QUERY_KEY.table_contract_by_appendices,
						QUERY_KEY.table_contract_by_activity,
					]}
					onClose={() => {
						const {_action, _contractUuid, _activityUuid, _activityName, ...rest} = router.query;

						router.replace({
							pathname: router.pathname,
							query: {
								...rest,
							},
						});
					}}
				/>
			</PositionContainer>

			{/* chỉnh sửa hợp đồng */}
			<PositionContainer
				open={_action == 'update'}
				onClose={() => {
					const {_action, ...rest} = router.query;

					router.replace({
						pathname: router.pathname,
						query: {
							...rest,
						},
					});
				}}
			>
				<FormUpdateContract
					uuidContract={_contractUuid as string}
					queryKeys={[
						QUERY_KEY.table_contract_for_project,
						QUERY_KEY.detail_contract,
						QUERY_KEY.detail_activity_contract,
						QUERY_KEY.table_contract_by_appendices,
						QUERY_KEY.table_contract_by_activity,
						QUERY_KEY.table_contract_fund_detail,
						QUERY_KEY.table_contractors_detail,
					]}
					onClose={() => {
						const {_action, ...rest} = router.query;

						router.replace({
							pathname: router.pathname,
							query: {
								...rest,
							},
						});
					}}
				/>
			</PositionContainer>

			{/* chỉnh sửa phụ lục hợp đồng */}
			<PositionContainer
				open={_action == 'updateAddendum'}
				onClose={() => {
					const {_action, ...rest} = router.query;

					router.replace({
						pathname: router.pathname,
						query: {
							...rest,
						},
					});
				}}
			>
				<FromUpdateContractAddendum
					uuidContract={_contractUuid as string}
					queryKeys={[
						QUERY_KEY.table_contract_for_project,
						QUERY_KEY.detail_contract_addendum,
						QUERY_KEY.detail_activity_contract,
						QUERY_KEY.table_contract_by_appendices,
						QUERY_KEY.table_contract_by_activity,
					]}
					onClose={() => {
						const {_action, ...rest} = router.query;

						router.replace({
							pathname: router.pathname,
							query: {
								...rest,
							},
						});
					}}
				/>
			</PositionContainer>

			{/* Thêm hợp đồng dự án (Nhiều công việc) */}
			<PositionContainer
				open={_action == 'create-contract-project'}
				onClose={() => {
					const {_action, ...rest} = router.query;

					router.replace({
						pathname: router.pathname,
						query: {
							...rest,
						},
					});
				}}
			>
				<FormCreateContractProject
					uuidProject={_uuid as string}
					queryKeys={[QUERY_KEY.table_contract_for_project, QUERY_KEY.detail_progress_contract_fund_project]}
					onClose={() => {
						const {_action, ...rest} = router.query;

						router.replace({
							pathname: router.pathname,
							query: {
								...rest,
							},
						});
					}}
				/>
			</PositionContainer>
		</div>
	);
}

export default UpdateDisbursementProgress;
