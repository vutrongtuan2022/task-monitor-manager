import React from 'react';

import {IReportWorkLastMonth, PropsTableReportWorkLastMonth} from './interfaces';
import styles from './TableReportWorkLastMonth.module.scss';
import {useQuery} from '@tanstack/react-query';
import {useRouter} from 'next/router';
import {QUERY_KEY, STATE_WORK_PROJECT, STATUS_CONFIG} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import activityServices from '~/services/activityServices';
import Search from '~/components/common/Search';
import FilterCustom from '~/components/common/FilterCustom';
import Pagination from '~/components/common/Pagination';
import DataWrapper from '~/components/common/DataWrapper';
import StateActive from '~/components/common/StateActive';
import Tippy from '@tippyjs/react';
import Table from '~/components/common/Table';
import Noti from '~/components/common/DataWrapper/components/Noti';

function TableReportWorkLastMonth({}: PropsTableReportWorkLastMonth) {
	const router = useRouter();

	const {_uuid, _page, _pageSize, _keyword, _state} = router.query;

	const {data: listReportLastMonth, isLoading} = useQuery(
		[QUERY_KEY.table_list_report_work_last_month, _page, _pageSize, _keyword, _state, _uuid],
		{
			queryFn: () =>
				httpRequest({
					http: activityServices.listActyvityLastMonth({
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
		}
	);

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
							render: (data: IReportWorkLastMonth, index: number) => <>{index + 1}</>,
						},
						{
							title: 'Tên công việc',
							render: (data: IReportWorkLastMonth) => (
								<Tippy content={data?.name}>
									<p className={styles.name}>{data?.name || '---'}</p>
								</Tippy>
							),
						},
						{
							title: 'Giai đoạn thực hiện',
							render: (data: IReportWorkLastMonth) => (
								<>
									{data?.stage == -1 && '---'}
									{data?.stage == 1 && 'Giai đoạn chuẩn bị đầu tư'}
									{data?.stage == 2 && 'Giai đoạn thực hiện đầu tư'}
									{data?.stage == 3 && 'Giai đoạn kết thúc đầu tư'}
								</>
							),
						},
						{
							title: 'Loại công việc',
							render: (data: IReportWorkLastMonth) => (
								<>
									{!data?.isInWorkFlow && 'Phát sinh'}
									{data?.isInWorkFlow && 'Có kế hoạch'}
								</>
							),
						},
						{
							title: 'Megatype',
							render: (data: IReportWorkLastMonth) => <>{data?.megaType || '---'}</>,
						},
						{
							title: 'Trạng thái',
							render: (data: IReportWorkLastMonth) => (
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

export default TableReportWorkLastMonth;
