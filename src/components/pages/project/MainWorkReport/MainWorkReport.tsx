import React, {useState} from 'react';

import {IActivitiProject, IDetailProgressProject, PropsMainWorkReport} from './interfaces';
import styles from './MainWorkReport.module.scss';
import LayoutPages from '~/components/layouts/LayoutPages';
import {PATH} from '~/constants/config';
import {useRouter} from 'next/router';
import Button from '~/components/common/Button';
import Progress from '~/components/common/Progress';
import {clsx} from 'clsx';
import GridColumn from '~/components/layouts/GridColumn';
import Search from '~/components/common/Search';
import FilterCustom from '~/components/common/FilterCustom';
import DataWrapper from '~/components/common/DataWrapper';
import Table from '~/components/common/Table';
import StateActive from '~/components/common/StateActive';
import Breadcrumb from '~/components/common/Breadcrumb';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {QUERY_KEY, STATE_PROJECT, STATE_WORK_PROJECT, STATUS_CONFIG, STATUS_WORK_PROJECT, TYPE_OF_WORK} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import Dialog from '~/components/common/Dialog';
import icons from '~/constants/images/icons';
import Tippy from '@tippyjs/react';
import Pagination from '~/components/common/Pagination';
import projectServices from '~/services/projectServices';
import activityServices from '~/services/activityServices';

function MainWorkReport({}: PropsMainWorkReport) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_uuid, _page, _pageSize, _keyword, _state, _activityType, _deadLine} = router.query;

	const [openDelete, setOpenDelete] = useState<boolean>(false);
	const [openStart, setOpenStart] = useState<boolean>(false);
	const [openFinish, setOpenFinish] = useState<boolean>(false);
	const [openReStart, setOpenReStart] = useState<boolean>(false);

	const {data: detailProgressProject} = useQuery<IDetailProgressProject>([QUERY_KEY.detail_progress_project, _uuid], {
		queryFn: () =>
			httpRequest({
				http: projectServices.detailProgressProject({
					uuid: _uuid as string,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!_uuid,
	});

	const {data: listActivityProject, isLoading} = useQuery(
		[QUERY_KEY.table_list_activity_project, _uuid, _page, _pageSize, _keyword, _state, _activityType, _deadLine],
		{
			queryFn: () =>
				httpRequest({
					http: activityServices.listActivity({
						page: Number(_page) || 1,
						pageSize: Number(_pageSize) || 10,
						projectUuid: _uuid as string,
						keyword: _keyword as string,
						state: !!_state ? Number(_state) : null,
						status: STATUS_CONFIG.ACTIVE,
						activityType: !!_activityType ? Number(_activityType) : null,
						deadLine: !!_deadLine ? Number(_deadLine) : null,
					}),
				}),
			select(data) {
				return data;
			},
			enabled: !!_uuid,
		}
	);

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
				queryClient.invalidateQueries([QUERY_KEY.detail_progress_project]);
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
				queryClient.invalidateQueries([QUERY_KEY.detail_progress_project]);
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
				queryClient.invalidateQueries([QUERY_KEY.detail_progress_project]);
			}
		},
	});

	return (
		<div className={styles.container}>
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
						{detailProgressProject?.categoryProjectDTO?.state == STATE_PROJECT.PREPARE && (
							<Button p_14_24 rounded_8 blueLinear onClick={() => setOpenStart(true)}>
								Thực hiện dự án
							</Button>
						)}
						{detailProgressProject?.categoryProjectDTO?.state == STATE_PROJECT.DO && (
							<Button p_14_24 rounded_8 primary onClick={() => setOpenFinish(true)}>
								Kết thúc dự án
							</Button>
						)}
						{detailProgressProject?.categoryProjectDTO?.state == STATE_PROJECT.PREPARE && (
							<Button p_14_24 rounded_8 light-red onClick={() => setOpenDelete(true)}>
								Xóa
							</Button>
						)}
						{detailProgressProject?.categoryProjectDTO?.state != STATE_PROJECT.FINISH && (
							<Button p_14_24 rounded_8 primaryLinear href={`${PATH.UpdateInfoProject}?_uuid=${_uuid}`}>
								Chỉnh sửa
							</Button>
						)}
						{detailProgressProject?.categoryProjectDTO?.state == STATE_PROJECT.FINISH && (
							<Button p_14_24 rounded_8 blueLinear onClick={() => setOpenReStart(true)}>
								Tái hoạt động dự án
							</Button>
						)}
					</div>
				}
			>
				<div className={styles.basic_info}>
					<div className={styles.head}>
						<h4>Tiến độ công việc</h4>
					</div>
					<div className={styles.progress_group}>
						<GridColumn col_3>
							<div className={styles.progress}>
								<p>Trong tháng</p>
								<div className={styles.progress_label}>
									<Progress
										backgroundPercent='#06D7A0'
										percent={(detailProgressProject?.countMonthly! / detailProgressProject?.totalMonthly!) * 100}
										width={120}
										isPercent={false}
									/>
									<div>
										<span className={styles.value}>{detailProgressProject?.countMonthly || 0}</span>/
										{detailProgressProject?.totalMonthly || 0}
									</div>
								</div>
							</div>
							<div className={styles.progress}>
								<p>Trong năm</p>
								<div className={styles.progress_label}>
									<Progress
										backgroundPercent='#16C1F3'
										percent={(detailProgressProject?.countYearly! / detailProgressProject?.totalYearly!) * 100}
										width={120}
										isPercent={false}
									/>
									<div>
										<span className={styles.value}>{detailProgressProject?.countYearly || 0}</span>/
										{detailProgressProject?.totalYearly || 0}
									</div>
								</div>
							</div>
							<div className={styles.progress}>
								<p>Trong dự án</p>
								<div className={styles.progress_label}>
									<Progress
										backgroundPercent='#FDAD73'
										percent={(detailProgressProject?.countInProject! / detailProgressProject?.totalInProject!) * 100}
										width={120}
										isPercent={false}
									/>
									<div>
										<span className={styles.value}>{detailProgressProject?.countInProject || 0}</span>/
										{detailProgressProject?.totalInProject || 0}
									</div>
								</div>
							</div>
						</GridColumn>
					</div>
				</div>
				<div className={clsx(styles.basic_info, styles.mt)}>
					<div className={styles.head}>
						<h4>Danh sách công việc</h4>
					</div>
					<div className={styles.main_table}>
						<div className={styles.head_filt}>
							<div className={styles.main_search}>
								<div className={styles.search}>
									<Search keyName='_keyword' placeholder='Tìm kiếm theo tên công việc' />
								</div>
								<div className={styles.filter}>
									<FilterCustom
										isSearch
										name='Trạng thái'
										query='_state'
										listFilter={[
											{
												id: STATE_WORK_PROJECT.NOT_PROCESSED,
												name: 'Chưa xử lý',
											},
											{
												id: STATE_WORK_PROJECT.PROCESSING,
												name: 'Đang xử lý',
											},
											{
												id: STATE_WORK_PROJECT.COMPLETED,
												name: 'Đã hoàn thành',
											},
										]}
									/>
								</div>
								<div className={styles.filter}>
									<FilterCustom
										isSearch
										name='Tình trạng'
										query='_deadLine'
										listFilter={[
											{
												id: STATUS_WORK_PROJECT.NOT_DONE,
												name: 'Chưa thực hiện',
											},
											{
												id: STATUS_WORK_PROJECT.ON_SCHEDULE,
												name: 'Đúng tiến độ',
											},
											{
												id: STATUS_WORK_PROJECT.SLOW_PROGRESS,
												name: 'Chậm tiến độ',
											},
										]}
									/>
								</div>
								<div className={styles.filter}>
									<FilterCustom
										isSearch
										name='Loại công việc'
										query='_activityType'
										listFilter={[
											{
												id: TYPE_OF_WORK.ARISE,
												name: 'Phát sinh',
											},
											{
												id: TYPE_OF_WORK.HAVE_PLAN,
												name: 'Có kế hoạch',
											},
										]}
									/>
								</div>
							</div>
						</div>
						<DataWrapper loading={isLoading} data={listActivityProject?.items || []}>
							<Table
								data={listActivityProject?.items || []}
								column={[
									{
										title: 'STT',
										render: (data: IActivitiProject, index: number) => <>{index + 1}</>,
									},
									{
										title: 'Tên công việc',
										render: (data: IActivitiProject) => (
											<Tippy content={data?.name || '---'}>
												<p className={styles.name}>{data?.name || ''}</p>
											</Tippy>
										),
									},
									{
										title: 'Giai đoạn thực hiện',
										render: (data: IActivitiProject) => (
											<>
												{!data?.stage && '---'}
												{data?.stage == 1 && 'Giai đoạn chuẩn bị đầu tư'}
												{data?.stage == 2 && 'Giai đoạn thực hiện đầu tư'}
												{data?.stage == 3 && 'Giai đoạn kết thúc đầu tư'}
											</>
										),
									},
									{
										title: 'Megatype',
										render: (data: IActivitiProject) => <>{data?.megatype || '---'}</>,
									},
									{
										title: 'Loại công việc',
										render: (data: IActivitiProject) => (
											<>
												{data?.activityType == TYPE_OF_WORK.ARISE && 'Phát sinh'}
												{data?.activityType == TYPE_OF_WORK.HAVE_PLAN && 'Có kế hoạch'}
											</>
										),
									},
									{
										title: 'Người báo cáo',
										render: (data: IActivitiProject) => <>{data?.reporter?.fullname || '---'}</>,
									},
									{
										title: 'Trạng thái',
										render: (data: IActivitiProject) => (
											<StateActive
												stateActive={data?.state}
												listState={[
													{
														state: STATE_WORK_PROJECT.NOT_PROCESSED,
														text: 'Chưa xử lý',
														textColor: '#FFFFFF',
														backgroundColor: '#FDAD73',
													},
													{
														state: STATE_WORK_PROJECT.PROCESSING,
														text: 'Đang xử lý',
														textColor: '#FFFFFF',
														backgroundColor: '#16C1F3',
													},
													{
														state: STATE_WORK_PROJECT.COMPLETED,
														text: 'Đã hoàn thành',
														textColor: '#FFFFFF',
														backgroundColor: '#06D7A0',
													},
												]}
											/>
										),
									},
									{
										title: 'Tình trạng',
										render: (data: IActivitiProject) => (
											<StateActive
												isBox={false}
												stateActive={data?.deadlineStage}
												listState={[
													{
														state: STATUS_WORK_PROJECT.NOT_DONE,
														text: 'Chưa thực hiện',
														textColor: '#FF852C',
														backgroundColor: '#FF852C',
													},
													{
														state: STATUS_WORK_PROJECT.ON_SCHEDULE,
														text: 'Đúng tiến độ',
														textColor: '#005994',
														backgroundColor: '#005994',
													},
													{
														state: STATUS_WORK_PROJECT.SLOW_PROGRESS,
														text: 'Chậm tiến độ',
														textColor: '#EE464C',
														backgroundColor: '#EE464C',
													},
												]}
											/>
										),
									},
									{
										title: 'Số hóa',
										render: (data: IActivitiProject) => (
											<>
												{data?.digitalization == 0 && 'Chưa số hóa'}
												{data?.digitalization == 1 && 'Đã số hóa'}
											</>
										),
									},
								]}
							/>
						</DataWrapper>
						<Pagination
							currentPage={Number(_page) || 1}
							pageSize={Number(_pageSize) || 10}
							total={listActivityProject?.pagination?.totalCount || 0}
							dependencies={[_uuid, _pageSize, _keyword, _state, _activityType, _deadLine]}
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

export default MainWorkReport;
