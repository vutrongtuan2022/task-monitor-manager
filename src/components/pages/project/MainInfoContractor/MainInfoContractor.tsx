import React, {useState} from 'react';

import {IContractorProject, PropsMainInfoContractor} from './interfaces';
import styles from './MainInfoContractor.module.scss';
import LayoutPages from '~/components/layouts/LayoutPages';
import {PATH} from '~/constants/config';
import {useRouter} from 'next/router';
import Button from '~/components/common/Button';
import DataWrapper from '~/components/common/DataWrapper';
import Pagination from '~/components/common/Pagination';
import Table from '~/components/common/Table';
import clsx from 'clsx';
import icons from '~/constants/images/icons';
import Breadcrumb from '~/components/common/Breadcrumb';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import {QUERY_KEY, STATE_PROJECT, STATUS_CONFIG} from '~/constants/config/enum';
import {IDetailInfoProject} from '../MainInfoProject/interfaces';
import Dialog from '~/components/common/Dialog';
import {convertCoin} from '~/common/funcs/convertCoin';
import Loading from '~/components/common/Loading';
import projectServices from '~/services/projectServices';
import contractorcatServices from '~/services/contractorcatServices';
import contractorServices from '~/services/contractorServices';
import FilterCustom from '~/components/common/FilterCustom';
import Tippy from '@tippyjs/react';

function MainInfoContractor({}: PropsMainInfoContractor) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_uuid, _page, _pageSize, _keyword, _contractorUuid, _contractorCat} = router.query;

	const [openDelete, setOpenDelete] = useState<boolean>(false);
	const [openStart, setOpenStart] = useState<boolean>(false);
	const [openFinish, setOpenFinish] = useState<boolean>(false);
	const [openReStart, setOpenReStart] = useState<boolean>(false);

	const {data: detailProject} = useQuery<IDetailInfoProject>([QUERY_KEY.detail_contractor_project, _uuid], {
		queryFn: () =>
			httpRequest({
				http: projectServices.detailInfoProject({
					uuid: _uuid as string,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!_uuid,
	});

	const {data: listContractorProject, isLoading} = useQuery(
		[QUERY_KEY.table_list_contractor_project, _uuid, _page, _pageSize, _keyword, _contractorUuid, _contractorCat],
		{
			queryFn: () =>
				httpRequest({
					http: contractorServices.getContractorForProject({
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
				queryClient.invalidateQueries([QUERY_KEY.detail_contractor_project]);
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
				queryClient.invalidateQueries([QUERY_KEY.detail_contractor_project]);
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
				queryClient.invalidateQueries([QUERY_KEY.detail_contractor_project]);
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
						title: 'Danh sách dự án',
					},
					{
						path: '',
						title: 'Chi tiết dự án',
					},
				]}
			/>
			<LayoutPages
				listPages={[
					{
						title: 'Thông tin chung',
						path: `${PATH.ProjectInfo}?_uuid=${_uuid}`,
					},
					{
						title: 'Quản lý công việc',
						path: `${PATH.ProjectWorkReport}?_uuid=${_uuid}`,
					},
					{
						title: 'Quản lý hợp đồng',
						path: `${PATH.ProjectDisbursementProgress}?_uuid=${_uuid}`,
					},
					{
						title: 'Quản lý nhà thầu',
						path: `${PATH.ProjectContractor}?_uuid=${_uuid}`,
					},
					// {
					// 	title: 'Nhật ký kế hoạch vốn',
					// 	path: `${PATH.ProjectPlanningCapital}?_uuid=${_uuid}`,
					// },
				]}
				action={
					<div className={styles.group_btn}>
						{detailProject?.state == STATE_PROJECT.PREPARE && (
							<Button p_14_24 rounded_8 blueLinear onClick={() => setOpenStart(true)}>
								Thực hiện dự án
							</Button>
						)}
						{detailProject?.state == STATE_PROJECT.DO && (
							<Button p_14_24 rounded_8 primary onClick={() => setOpenFinish(true)}>
								Kết thúc dự án
							</Button>
						)}
						{detailProject?.state == STATE_PROJECT.PREPARE && (
							<Button p_14_24 rounded_8 light-red onClick={() => setOpenDelete(true)}>
								Xóa
							</Button>
						)}
						{detailProject?.state != STATE_PROJECT.FINISH && (
							<Button p_14_24 rounded_8 primaryLinear href={`${PATH.UpdateInfoProject}?_uuid=${_uuid}`}>
								Chỉnh sửa
							</Button>
						)}
						{detailProject?.state == STATE_PROJECT.FINISH && (
							<Button p_14_24 rounded_8 blueLinear onClick={() => setOpenReStart(true)}>
								Tái hoạt động dự án
							</Button>
						)}
					</div>
				}
			>
				<div className={clsx(styles.basic_info)}>
					<div className={styles.head}>
						<h4>Danh sách nhà thầu</h4>
					</div>
					<div className={styles.main_table}>
						<div className={styles.head_filt}>
							<div className={styles.main_search}>
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
						</div>
						<DataWrapper loading={isLoading} data={listContractorProject?.items || []}>
							<Table
								data={listContractorProject?.items || []}
								column={[
									{
										title: 'STT',
										render: (data: IContractorProject, index: number) => <>{index + 1}</>,
									},
									{
										title: 'Nhóm nhà thầu',
										render: (data: IContractorProject) => (
											<>
												{data?.contractor?.contractorCat?.[0]?.name}
												{data?.contractor?.contractorCat?.length! > 1 && (
													<Tippy
														content={
															<ol style={{paddingLeft: '16px'}}>
																{[...data?.contractor?.contractorCat!]?.slice(1)?.map((v, i) => (
																	<li key={i}>{v?.name}</li>
																))}
															</ol>
														}
													>
														<span className={styles.link_contractor}>
															{' '}
															và {data?.contractor?.contractorCat?.length! - 1} nhóm khác
														</span>
													</Tippy>
												)}
											</>
										),
									},
									{
										title: 'Tên nhà thầu',
										render: (data: IContractorProject) => <>{data?.contractor?.name || '---'}</>,
									},
									{
										title: 'Ghi chú',
										render: (data: IContractorProject) => <>{data?.note || '---'}</>,
									},
									{
										title: 'Số lượng hợp đồng',
										render: (data: IContractorProject) => <>{data?.totalContract || 0}</>,
									},
									{
										title: 'Tổng giá trị hợp đồng (VND)',
										render: (data: IContractorProject) => <>{convertCoin(data?.amount)}</>,
									},
								]}
							/>
						</DataWrapper>
						<Pagination
							currentPage={Number(_page) || 1}
							pageSize={Number(_pageSize) || 10}
							total={listContractorProject?.pagination?.totalCount || 0}
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
		</div>
	);
}

export default MainInfoContractor;
