import React from 'react';

import {IReportWork, PropsMainPageReportWork} from './interfaces';
import styles from './MainPageReportWork.module.scss';
import {useRouter} from 'next/router';
import {useQuery} from '@tanstack/react-query';
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

function MainPageReportWork({}: PropsMainPageReportWork) {
	const router = useRouter();

	const years = generateYearsArray();
	const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

	const {_page, _pageSize, _keyword, _year, _month, _state, _completeState} = router.query;

	const listReportWork = useQuery([QUERY_KEY.table_list_report_work, _page, _pageSize, _keyword, _year, _month, _state, _completeState], {
		queryFn: () =>
			httpRequest({
				http: reportServices.listReportManager({
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 20,
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

	return (
		<div className={styles.container}>
			<div className={styles.head}>
				<div className={styles.main_search}>
					<div className={styles.search}>
						<Search keyName='_keyword' placeholder='Tìm kiếm theo tên công trình, ID' />
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
								{
									id: STATE_REPORT.PENDING_APPROVAL,
									name: 'Chưa xử lý',
								},
								{
									id: STATE_REPORT.IN_PROGRESS,
									name: 'Đang thực hiện',
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
								render: (data: IReportWork) => <>{data?.project?.name}</>,
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
								title: 'Kế hoạch tháng',
								render: (data: IReportWork) => (
									<>
										Tháng <span>{data?.month}</span> - <span>{data?.year}</span>
									</>
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
												state: STATE_REPORT.PENDING_APPROVAL,
												text: 'Chưa xử lý',
												textColor: '#fff',
												backgroundColor: '#5B70B3',
											},
											{
												state: STATE_REPORT.IN_PROGRESS,
												text: 'Đang thực hiện',
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
													// disnable={data?.state == STATE_PROJECT.FINISH}
													// href={`${PATH.UpdateInfoProject}?_uuid=${data?.uuid}`}
												/>
												<IconCustom
													color='#EE464C'
													icon={<CloseCircle fontSize={20} fontWeight={600} />}
													tooltip='Từ chối báo cáo'
													// disnable={data?.state == STATE_PROJECT.FINISH}
													// href={`${PATH.UpdateInfoProject}?_uuid=${data?.uuid}`}
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
					pageSize={Number(_pageSize) || 20}
					total={listReportWork?.data?.pagination?.totalCount}
					dependencies={[_pageSize, _keyword, _year, _month, _state, _completeState]}
				/>
			</WrapperScrollbar>
		</div>
	);
}

export default MainPageReportWork;
