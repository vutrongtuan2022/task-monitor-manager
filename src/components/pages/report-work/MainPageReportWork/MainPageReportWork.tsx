import React, {useState} from 'react';

import {IReportWork, PropsMainPageReportWork} from './interfaces';
import styles from './MainPageReportWork.module.scss';
import {useRouter} from 'next/router';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {QUERY_KEY, STATE_COMPLETE_REPORT, STATE_REPORT, STATUS_CONFIG} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import Search from '~/components/common/Search';
import FilterCustom from '~/components/common/FilterCustom';
import WrapperScrollbar from '~/components/layouts/WrapperScrollbar';
import Pagination from '~/components/common/Pagination';
import DataWrapper from '~/components/common/DataWrapper';
import Table from '~/components/common/Table';
import Noti from '~/components/common/DataWrapper/components/Noti';
import {generateYearsArray} from '~/common/funcs/selectDate';
import StateActive from '~/components/common/StateActive';
import IconCustom from '~/components/common/IconCustom';
import {CloseCircle, Eye, TickCircle} from 'iconsax-react';
import Moment from 'react-moment';
import reportServices from '~/services/reportServices';
import {PATH} from '~/constants/config';
import Dialog from '~/components/common/Dialog';
import icons from '~/constants/images/icons';
import Loading from '~/components/common/Loading';
import Tippy from '@tippyjs/react';
import PositionContainer from '~/components/common/PositionContainer';
import TableListWorkCancel from '../TableListWorkCancel';
import Popup from '~/components/common/Popup';
import FormExportExcel from '../FormExportExcel';
import Button from '~/components/common/Button';
import Image from 'next/image';

function MainPageReportWork({}: PropsMainPageReportWork) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const years = generateYearsArray();
	const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
	const [isExportPopupOpen, setExportPopupOpen] = useState(false);

	const {_page, _pageSize, _keyword, _year, _month, _state, _completeState, _uuidCancel} = router.query;

	const [uuidConfirm, setUuidConfirm] = useState<string>('');

	const listReportWork = useQuery([QUERY_KEY.table_list_report_work, _page, _pageSize, _keyword, _year, _month, _state, _completeState], {
		queryFn: () =>
			httpRequest({
				http: reportServices.listReportManager({
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 10,
					keyword: (_keyword as string) || '',
					status: STATUS_CONFIG.ACTIVE,
					state: !!_state ? Number(_state) : null,
					year: !!_year ? Number(_year) : null,
					month: !!_month ? Number(_month) : null,
					completeState: !!_completeState ? Number(_completeState) : null,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const funcConfirm = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Duyệt báo cáo thành công!',
				http: reportServices.approveReport({
					uuid: uuidConfirm,
					isApprove: 1,
					note: '',
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setUuidConfirm('');
				queryClient.invalidateQueries([QUERY_KEY.table_list_report_work]);
			}
		},
	});

	const handleCloseExport = () => {
		setExportPopupOpen(false);
	};

	const handleOpenExport = () => {
		setExportPopupOpen(true);
	};

	return (
		<div className={styles.container}>
			<Loading loading={funcConfirm.isLoading} />
			<div className={styles.head}>
				<div className={styles.main_search}>
					<div className={styles.search}>
						<Search keyName='_keyword' placeholder='Tìm kiếm theo tên công trình' />
					</div>
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
							name='Trạng thái'
							query='_state'
							listFilter={[
								{
									id: STATE_REPORT.REJECTED,
									name: 'Đã từ chối',
								},
								{
									id: STATE_REPORT.REPORTED,
									name: 'Đã duyệt',
								},
								{id: STATE_REPORT.PLANNING, name: 'Lên kế hoạch'},
								{
									id: STATE_REPORT.PENDING_APPROVAL,
									name: 'Chưa xử lý',
								},
								{
									id: STATE_REPORT.IN_PROGRESS,
									name: 'Chưa báo cáo',
								},
							]}
						/>
					</div>
					<div className={styles.filter}>
						<FilterCustom
							isSearch
							name='Tình trạng'
							query='_completeState'
							listFilter={[
								{
									id: STATE_COMPLETE_REPORT.NOT_DONE,
									name: 'Chưa thực hiện',
								},
								{
									id: STATE_COMPLETE_REPORT.ON_SCHEDULE,
									name: 'Đúng tiến độ',
								},
								{
									id: STATE_COMPLETE_REPORT.SLOW_PROGRESS,
									name: 'Chậm tiến độ',
								},
							]}
						/>
					</div>
				</div>
				{/* <div className={styles.group_button}>
					<div className={styles.btn}>
						<Button rounded_8 w_fit p_8_16 green bold onClick={handleOpenExport}>
							<Image src={icons.exportExcel} alt='icon down' width={20} height={20} />
							Xuất excel
						</Button>
					</div>
				</div> */}
			</div>
			<WrapperScrollbar>
				<DataWrapper
					data={listReportWork?.data?.items || []}
					loading={listReportWork.isLoading}
					noti={<Noti title='Dữ liệu trống!' des='Danh sách báo cáo công việc trống!' />}
				>
					<Table
						fixedHeader={true}
						data={listReportWork?.data?.items || []}
						column={[
							{
								title: 'STT',
								render: (data: IReportWork, index: number) => <>{index + 1}</>,
							},
							{
								title: 'Tên công trình',
								fixedLeft: true,
								render: (data: IReportWork) => (
									<Tippy content={data?.project?.name}>
										<p className={styles.name}>{data?.project?.name}</p>
									</Tippy>
								),
							},
							{
								title: 'Kế hoạch tháng',
								render: (data: IReportWork) => (
									<>
										Tháng <span>{data?.month}</span> - <span>{data?.year}</span>
									</>
								),
							},
							{
								title: 'Người báo cáo',
								render: (data: IReportWork) => <>{data?.reporter?.fullname}</>,
							},
							{
								title: 'Lãnh đạo phụ trách',
								render: (data: IReportWork) => <>{data?.project?.leader?.fullname}</>,
							},
							{
								title: 'Số công việc thực hiện',
								render: (data: IReportWork) => (
									<p>
										<span style={{color: '#2970FF'}}>{data?.completedActivity}</span>/{' '}
										<span style={{color: '#23262F'}}>{data?.totalActivity}</span>
									</p>
								),
							},

							{
								title: 'Ngày gửi báo cáo',
								render: (data: IReportWork) => (
									<>{data?.completed ? <Moment date={data?.completed} format='DD/MM/YYYY' /> : '---'}</>
								),
							},
							{
								title: 'Trạng thái',
								render: (data: IReportWork) => (
									<StateActive
										stateActive={data?.state}
										listState={[
											{
												state: STATE_REPORT.REJECTED,
												text: 'Bị từ chối',
												textColor: '#fff',
												backgroundColor: '#EE464C',
											},
											{
												state: STATE_REPORT.REPORTED,
												text: 'Đã duyệt',
												textColor: '#fff',
												backgroundColor: '#06D7A0',
											},
											{
												state: STATE_REPORT.PLANNING,
												text: 'Lên kế hoạch',
												textColor: '#fff',
												backgroundColor: '#5B70B3',
											},
											{
												state: STATE_REPORT.PENDING_APPROVAL,
												text: 'Chưa xử lý',
												textColor: '#fff',
												backgroundColor: '#4BC9F0',
											},
											{
												state: STATE_REPORT.IN_PROGRESS,
												text: 'Chưa báo cáo',
												textColor: '#fff',
												backgroundColor: '#F69E51',
											},
										]}
									/>
								),
							},
							{
								title: 'Tình trạng',
								render: (data: IReportWork) => (
									<StateActive
										isBox={false}
										stateActive={data?.completeState}
										listState={[
											{
												state: STATE_COMPLETE_REPORT.NOT_DONE,
												text: 'Chưa thực hiện',
												textColor: '#FF852C',
												backgroundColor: '#FF852C',
											},
											{
												state: STATE_COMPLETE_REPORT.ON_SCHEDULE,
												text: 'Đúng tiến độ',
												textColor: '#005994',
												backgroundColor: '#005994',
											},
											{
												state: STATE_COMPLETE_REPORT.SLOW_PROGRESS,
												text: 'Chậm tiến độ',
												textColor: '#EE464C',
												backgroundColor: '#EE464C',
											},
										]}
									/>
								),
							},
							{
								title: 'Hành động',
								fixedRight: true,
								render: (data: IReportWork) => (
									<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
										{data?.state == STATE_REPORT.PENDING_APPROVAL && (
											<>
												<IconCustom
													color='#06D7A0'
													icon={<TickCircle fontSize={20} fontWeight={600} />}
													tooltip='Duyệt báo cáo'
													onClick={() => setUuidConfirm(data?.uuid)}
												/>
												<IconCustom
													color='#EE464C'
													icon={<CloseCircle fontSize={20} fontWeight={600} />}
													tooltip='Từ chối báo cáo'
													onClick={() => {
														router.replace({
															pathname: router.pathname,
															query: {
																...router.query,
																_uuidCancel: data?.uuid,
															},
														});
													}}
												/>
											</>
										)}
										<IconCustom
											color='#005994'
											icon={<Eye fontSize={20} fontWeight={600} />}
											tooltip='Xem chi tiết'
											href={`${PATH.ReportWork}/${data?.uuid}`}
										/>
									</div>
								),
							},
						]}
					/>
				</DataWrapper>
				<Pagination
					currentPage={Number(_page) || 1}
					pageSize={Number(_pageSize) || 10}
					total={listReportWork?.data?.pagination?.totalCount}
					dependencies={[_pageSize, _keyword, _year, _month, _state, _completeState]}
				/>
			</WrapperScrollbar>

			{/* <Popup open={isExportPopupOpen} onClose={handleCloseExport}>
				<FormExportExcel onClose={handleCloseExport} />
			</Popup> */}

			<Dialog
				type='primary'
				open={!!uuidConfirm}
				icon={icons.success}
				onClose={() => setUuidConfirm('')}
				title={'Duyệt báo cáo'}
				note={'Bạn có chắc chắn muốn duyệt báo cáo này không?'}
				onSubmit={funcConfirm.mutate}
			/>

			<PositionContainer
				open={!!_uuidCancel}
				onClose={() => {
					const {_uuidCancel, ...rest} = router.query;

					router.replace({
						pathname: router.pathname,
						query: {
							...rest,
						},
					});
				}}
			>
				<TableListWorkCancel
					reportUuid={_uuidCancel as string}
					queryKeys={[QUERY_KEY.table_list_report_work]}
					onClose={() => {
						const {_uuidCancel, ...rest} = router.query;

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

export default MainPageReportWork;
