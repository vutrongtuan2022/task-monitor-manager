import React from 'react';

import {IReportWorkCurrent, PropsTableReportWorkCurrent} from './interfaces';
import styles from './TableReportWorkCurrent.module.scss';
import Search from '~/components/common/Search';
import FilterCustom from '~/components/common/FilterCustom';
import {QUERY_KEY, STATE_COMPLETE_REPORT, STATE_REPORT_WORK, STATE_WORK_PROJECT, STATUS_CONFIG} from '~/constants/config/enum';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import Tippy from '@tippyjs/react';
import StateActive from '~/components/common/StateActive';
import {useRouter} from 'next/router';
import Pagination from '~/components/common/Pagination';
import {useQuery} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import activityServices from '~/services/activityServices';
import Progress from '~/components/common/Progress';

function TableReportWorkCurrent({}: PropsTableReportWorkCurrent) {
	const router = useRouter();

	const {_uuid, _page, _pageSize, _keyword, _state} = router.query;

	const {data: listReportLastMonth, isLoading} = useQuery([QUERY_KEY.table_list_work_report, _page, _pageSize, _keyword, _state, _uuid], {
		queryFn: () =>
			httpRequest({
				http: activityServices.listActyvityInReport({
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 20,
					keyword: (_keyword as string) || '',
					status: STATUS_CONFIG.ACTIVE,
					state: !!_state ? Number(_state) : null,
					uuid: _uuid as string,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!_uuid,
	});

	return (
		<div className={styles.main_table}>
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
			</div>
			<DataWrapper
				data={listReportLastMonth?.items || []}
				loading={isLoading}
				noti={<Noti title='Dữ liệu trống!' des='Danh sách báo cáo tháng trước trống!' />}
			>
				<Table
					data={listReportLastMonth?.items || []}
					column={[
						{
							title: 'STT',
							render: (data: IReportWorkCurrent, index: number) => <>{index + 1}</>,
						},
						{
							title: 'Tháng báo cáo',
							fixedLeft: true,
							render: (data: IReportWorkCurrent) => (
								<>
									Tháng <span>{data?.month}</span> - <span>{data?.year}</span>
								</>
							),
						},
						{
							title: 'Tên công trình',
							render: (data: IReportWorkCurrent) => <>{data?.project?.name}</>,
						},
						{
							title: 'Tên công việc',
							render: (data: IReportWorkCurrent) => (
								<Tippy content={data?.activity?.name}>
									<p className={styles.name}>{data?.activity?.name}</p>
								</Tippy>
							),
						},
						{
							title: 'Giai đoạn thực hiện',
							render: (data: IReportWorkCurrent) => (
								<>
									{data?.stage == -1 || (!data?.stage && '---')}
									{data?.stage == 1 && 'Giai đoạn chuẩn bị đầu tư'}
									{data?.stage == 2 && 'Giai đoạn thực hiện đầu tư'}
									{data?.stage == 3 && 'Giai đoạn kết thúc đầu tư'}
								</>
							),
						},
						{
							title: 'Megatype',
							render: (data: IReportWorkCurrent) => <>{data?.megatype || '---'}</>,
						},
						{
							title: 'Loại công việc',
							render: (data: IReportWorkCurrent) => (
								<>
									{!data?.isInWorkFlow && 'Phát sinh'}
									{data?.isInWorkFlow && 'Có kế hoạch'}
								</>
							),
						},
						{
							title: 'Khó khăn vướng mắc',
							render: (data: IReportWorkCurrent) => <>{data?.issue || '---'}</>,
						},
						{
							title: 'Tiến độ công việc',
							render: (data: IReportWorkCurrent) => <Progress percent={data?.progress} width={80} />,
						},
						{
							title: 'Trạng thái',
							render: (data: IReportWorkCurrent) => (
								<StateActive
									stateActive={data?.activity?.state}
									listState={[
										{
											state: STATE_REPORT_WORK.NOT_PROCESSED,
											text: 'Chưa xử lý',
											textColor: '#fff',
											backgroundColor: '#F37277',
										},
										{
											state: STATE_REPORT_WORK.PROCESSING,
											text: 'Đang xử lý',
											textColor: '#fff',
											backgroundColor: '#16C1F3',
										},
										{
											state: STATE_REPORT_WORK.COMPLETED,
											text: 'Đã hoàn thành',
											textColor: '#fff',
											backgroundColor: '#06D7A0',
										},
									]}
								/>
							),
						},
						{
							title: 'Tình trạng',
							render: (data: IReportWorkCurrent) => (
								<StateActive
									isBox={false}
									stateActive={data?.deadlineState}
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
							title: 'Số hóa',
							render: (data: IReportWorkCurrent) => (
								<>
									{data?.digitalizedState == 0 && 'Chưa số hóa'}
									{data?.digitalizedState == 1 && 'Đã số hóa'}
								</>
							),
						},
					]}
				/>
			</DataWrapper>
			<Pagination
				currentPage={Number(_page) || 1}
				pageSize={Number(_pageSize) || 20}
				total={listReportLastMonth?.pagination?.totalCount}
				dependencies={[_pageSize, _keyword, _state, _uuid]}
			/>
		</div>
	);
}

export default TableReportWorkCurrent;
