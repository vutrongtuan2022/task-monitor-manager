import React, {useState} from 'react';

import {IDetailProgressFundProject, IProjectFund, PropsMainDisbursementProgress} from './interfaces';
import styles from './MainDisbursementProgress.module.scss';
import LayoutPages from '~/components/layouts/LayoutPages';
import {PATH} from '~/constants/config';
import {useRouter} from 'next/router';
import Button from '~/components/common/Button';
import Pagination from '~/components/common/Pagination';
import DataWrapper from '~/components/common/DataWrapper';
import StateActive from '~/components/common/StateActive';
import Table from '~/components/common/Table';
import FilterCustom from '~/components/common/FilterCustom';
import GridColumn from '~/components/layouts/GridColumn';
import Progress from '~/components/common/Progress';
import {clsx} from 'clsx';
import {convertCoin} from '~/common/funcs/convertCoin';
import Breadcrumb from '~/components/common/Breadcrumb';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import {QUERY_KEY, STATE_PROJECT, STATUS_CONFIG, STATUS_DISBURSEMENT_PROJECT} from '~/constants/config/enum';
import Dialog from '~/components/common/Dialog';
import icons from '~/constants/images/icons';
import Moment from 'react-moment';
import {generateYearsArray} from '~/common/funcs/selectDate';
import projectServices from '~/services/projectServices';
import projectFundServices from '~/services/projectFundServices';

function MainDisbursementProgress({}: PropsMainDisbursementProgress) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const years = generateYearsArray();

	const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

	const {_uuid, _page, _pageSize, _approved, _year, _month} = router.query;

	const [openDelete, setOpenDelete] = useState<boolean>(false);
	const [openStart, setOpenStart] = useState<boolean>(false);
	const [openFinish, setOpenFinish] = useState<boolean>(false);
	const [openReStart, setOpenReStart] = useState<boolean>(false);

	const {data: detailProgressFundProject} = useQuery<IDetailProgressFundProject>([QUERY_KEY.detail_progress_fund_project, _uuid], {
		queryFn: () =>
			httpRequest({
				http: projectServices.detailProgressFundProject({
					uuid: _uuid as string,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!_uuid,
	});

	const {data: listProjectFund, isLoading} = useQuery(
		[QUERY_KEY.table_list_project_fund, _uuid, _page, _pageSize, _approved, _year, _month],
		{
			queryFn: () =>
				httpRequest({
					http: projectFundServices.listProjectFund({
						page: Number(_page) || 1,
						pageSize: Number(_pageSize) || 20,
						projectUuid: _uuid as string,
						status: STATUS_CONFIG.ACTIVE,
						approved: !!_approved ? Number(_approved) : null,
						year: Number(_year) || null,
						month: Number(_month) || null,
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
				queryClient.invalidateQueries([QUERY_KEY.detail_progress_fund_project]);
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
				queryClient.invalidateQueries([QUERY_KEY.detail_progress_fund_project]);
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
				queryClient.invalidateQueries([QUERY_KEY.detail_progress_fund_project]);
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
						title: 'Báo cáo công việc',
						path: `${PATH.ProjectWorkReport}?_uuid=${_uuid}`,
					},
					{
						title: 'Tiến độ giải ngân',
						path: `${PATH.ProjectDisbursementProgress}?_uuid=${_uuid}`,
					},
					{
						title: 'Thông tin nhà thầu',
						path: `${PATH.ProjectContractor}?_uuid=${_uuid}`,
					},
				]}
				action={
					<div className={styles.group_btn}>
						{detailProgressFundProject?.categoryProjectDTO?.state == STATE_PROJECT.PREPARE && (
							<Button p_14_24 rounded_8 blueLinear onClick={() => setOpenStart(true)}>
								Thực hiện dự án
							</Button>
						)}
						{detailProgressFundProject?.categoryProjectDTO?.state == STATE_PROJECT.DO && (
							<Button p_14_24 rounded_8 primary onClick={() => setOpenFinish(true)}>
								Kết thúc dự án
							</Button>
						)}
						{detailProgressFundProject?.categoryProjectDTO?.state == STATE_PROJECT.PREPARE && (
							<Button p_14_24 rounded_8 light-red onClick={() => setOpenDelete(true)}>
								Xóa
							</Button>
						)}
						{detailProgressFundProject?.categoryProjectDTO?.state != STATE_PROJECT.FINISH && (
							<Button p_14_24 rounded_8 primaryLinear href={`${PATH.UpdateInfoProject}?_uuid=${_uuid}`}>
								Chỉnh sửa
							</Button>
						)}
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
								<p>Trong năm (VND)</p>
								<div className={styles.progress_label}>
									<Progress
										percent={
											(Number(detailProgressFundProject?.countYearly) * 100) /
											Number(detailProgressFundProject?.totalYearly)
										}
										width={120}
										isPercent={false}
									/>
									<div>
										<span className={styles.value}>{convertCoin(detailProgressFundProject?.countYearly || 0)}</span>/
										{convertCoin(detailProgressFundProject?.totalYearly || 0)}
									</div>
								</div>
							</div>
							<div className={styles.progress}>
								<p>Trong dự án (VND)</p>
								<div className={styles.progress_label}>
									<Progress
										percent={
											(Number(detailProgressFundProject?.countInProject) * 100) /
											Number(detailProgressFundProject?.totalInProject)
										}
										width={120}
										isPercent={false}
									/>
									<div>
										<span className={styles.value}>{convertCoin(detailProgressFundProject?.countInProject || 0)}</span>/
										{convertCoin(detailProgressFundProject?.totalInProject || 0)}
									</div>
								</div>
							</div>
						</GridColumn>
					</div>
				</div>
				<div className={clsx(styles.basic_info, styles.mt)}>
					<div className={styles.head}>
						<h4>Danh sách báo cáo số tiền giải ngân</h4>
					</div>
					<div className={styles.main_table}>
						<div className={styles.head_filt}>
							<div className={styles.main_search}>
								<div className={styles.filter}>
									<FilterCustom
										isSearch
										name='Năm'
										query='_year'
										listFilter={years?.map((v) => ({
											id: v,
											name: `Năm ${v}`,
										}))}
									/>
								</div>
								<div className={styles.filter}>
									<FilterCustom
										isSearch
										name='Tháng'
										query='_month'
										listFilter={months?.map((v) => ({
											id: v,
											name: `Tháng ${v}`,
										}))}
									/>
								</div>
								<div className={styles.filter}>
									<FilterCustom
										isSearch
										name='Trạng thái'
										query='_approved'
										listFilter={[
											{
												id: STATUS_DISBURSEMENT_PROJECT.NOT_APPROVED,
												name: 'Chưa duyệt',
											},
											{
												id: STATUS_DISBURSEMENT_PROJECT.APPROVED,
												name: 'Đã duyệt',
											},
											{
												id: STATUS_DISBURSEMENT_PROJECT.REJECTED,
												name: 'Bị từ chối',
											},
										]}
									/>
								</div>
							</div>
						</div>
						<DataWrapper loading={isLoading} data={listProjectFund?.items || []}>
							<Table
								data={listProjectFund?.items || []}
								column={[
									{
										title: 'STT',
										render: (data: IProjectFund, index: number) => <>{index + 1}</>,
									},
									{
										title: 'Báo cáo tháng',
										render: (data: IProjectFund) => <>{data?.monthReport}</>,
									},
									{
										title: 'Số tiền giải ngân (VND)',
										render: (data: IProjectFund) => <>{convertCoin(data?.realeaseBudget)}</>,
									},
									{
										title: 'Tổng mức đầu tư (VND)',
										render: (data: IProjectFund) => <>{convertCoin(data?.totalInvest)}</>,
									},
									{
										title: 'Kế hoạch vốn năm (VND)',
										render: (data: IProjectFund) => <>{convertCoin(data?.annualBudget)}</>,
									},
									{
										title: 'Lũy kế theo năm (VND)',
										render: (data: IProjectFund) => <>{convertCoin(data?.annualAccumAmount)}</>,
									},
									{
										title: 'Lũy kế theo dự án (VND)',
										render: (data: IProjectFund) => <>{convertCoin(data?.projectAccumAmount)}</>,
									},
									{
										title: 'Tỷ lệ giải ngân',
										render: (data: IProjectFund) => <Progress percent={data?.fundProgress} width={80} />,
									},
									{
										title: 'Ngày gửi báo cáo',
										render: (data: IProjectFund) => <Moment date={data?.created} format='DD/MM/YYYY' />,
									},
									{
										title: 'Người báo cáo',
										render: (data: IProjectFund) => <>{data?.reporter?.fullname}</>,
									},
									{
										title: 'Trạng thái',
										render: (data: IProjectFund) => (
											<div className={styles.state}>
												<StateActive
													stateActive={data?.status}
													listState={[
														{
															state: 1,
															text: 'Đã báo cáo',
															textColor: '#fff',
															backgroundColor: '#06D7A0',
														},
														{
															state: 2,
															text: 'Bị từ chối',
															textColor: '#fff',
															backgroundColor: '#F37277',
														},
													]}
												/>
											</div>
										),
									},
								]}
							/>
						</DataWrapper>
						<Pagination
							currentPage={Number(_page) || 1}
							pageSize={Number(_pageSize) || 20}
							total={listProjectFund?.pagination?.totalCount || 0}
							dependencies={[_uuid, _pageSize, _approved, _year, _month]}
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

export default MainDisbursementProgress;
