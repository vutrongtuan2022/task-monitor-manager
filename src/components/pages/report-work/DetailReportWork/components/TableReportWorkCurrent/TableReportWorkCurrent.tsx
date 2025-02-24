import React from 'react';

import {IReportWorkCurrent, PropsTableReportWorkCurrent} from './interfaces';
import styles from './TableReportWorkCurrent.module.scss';
import Search from '~/components/common/Search';
import FilterCustom from '~/components/common/FilterCustom';
import {QUERY_KEY, STATE_COMPLETE_REPORT, STATE_WORK, STATUS_CONFIG} from '~/constants/config/enum';
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
					pageSize: Number(_pageSize) || 10,
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
								id: STATE_WORK.NOT_PROCESSED,
								name: 'Chưa xử lý',
							},
							{
								id: STATE_WORK.PROCESSING,
								name: 'Đang xử lý',
							},
							{
								id: STATE_WORK.COMPLETED,
								name: 'Đã hoàn thành',
							},
							{
								id: STATE_WORK.REJECTED,
								name: 'Bị từ chối',
							},
							{
								id: STATE_WORK.APPROVED,
								name: 'Đã được duyệt',
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
							render: (data: IReportWorkCurrent, index: number) => (
								<p style={{color: data?.megatype == 'Task' ? '#2970FF' : data?.megatype ? '' : ''}}>{index + 1}</p>
							),
						},
						{
							title: 'Tháng báo cáo',
							fixedLeft: true,
							render: (data: IReportWorkCurrent) => (
								<p style={{color: data?.megatype == 'Task' ? '#2970FF' : data?.megatype ? '' : ''}}>
									Tháng <span>{data?.month}</span> - <span>{data?.year}</span>
								</p>
							),
						},
						{
							title: 'Tên công trình',
							render: (data: IReportWorkCurrent) => (
								<Tippy content={data?.project?.name}>
									<p
										className={styles.name}
										style={{color: data?.megatype == 'Task' ? '#2970FF' : data?.megatype ? '' : ''}}
									>
										{data?.project?.name}
									</p>
								</Tippy>
							),
						},
						{
							title: 'Tên công việc',
							render: (data: IReportWorkCurrent) => (
								<Tippy content={data?.activity?.name}>
									<p
										className={styles.name}
										style={{color: data?.megatype == 'Task' ? '#2970FF' : data?.megatype ? '' : ''}}
									>
										{data?.activity?.name}
									</p>
								</Tippy>
							),
						},
						{
							title: 'Giai đoạn thực hiện',
							render: (data: IReportWorkCurrent) => (
								<span style={{color: data?.megatype == 'Task' ? '#2970FF' : data?.megatype ? '' : ''}}>
									{data?.stage == -1 || (!data?.stage && '---')}
									{data?.stage == 1 && 'Giai đoạn chuẩn bị đầu tư'}
									{data?.stage == 2 && 'Giai đoạn thực hiện đầu tư'}
									{data?.stage == 3 && 'Giai đoạn kết thúc đầu tư'}
								</span>
							),
						},
						{
							title: 'Megatype',
							render: (data: IReportWorkCurrent) => (
								<p style={{color: data?.megatype == 'Task' ? '#2970FF' : data?.megatype ? '' : ''}}>
									{data?.megatype || '---'}
								</p>
							),
						},
						{
							title: 'Loại công việc',
							render: (data: IReportWorkCurrent) => (
								<span style={{color: data?.megatype == 'Task' ? '#2970FF' : data?.megatype ? '' : ''}}>
									{!data?.isInWorkFlow && 'Phát sinh'}
									{data?.isInWorkFlow && 'Có kế hoạch'}
								</span>
							),
						},
						{
							title: 'Khó khăn vướng mắc',
							render: (data: IReportWorkCurrent) => (
								<p style={{color: data?.megatype == 'Task' ? '#2970FF' : data?.megatype ? '' : ''}}>
									{data?.issue || '---'}
								</p>
							),
						},
						{
							title: 'Tiến độ công việc',
							render: (data: IReportWorkCurrent) => <Progress percent={data?.progress} width={80} />,
						},
						{
							title: 'Trạng thái',
							render: (data: IReportWorkCurrent) => (
								<div style={{color: data?.megatype == 'Task' ? '#2970FF' : data?.megatype ? '' : ''}}>
									<StateActive
										stateActive={data?.activity?.state}
										listState={[
											{
												state: STATE_WORK.NOT_PROCESSED,
												text: 'Chưa xử lý',
												textColor: '#FFFFFF',
												backgroundColor: '#FDAD73',
											},
											{
												state: STATE_WORK.PROCESSING,
												text: 'Đang xử lý',
												textColor: '#FFFFFF',
												backgroundColor: '#5B70B3',
											},
											{
												state: STATE_WORK.COMPLETED,
												text: 'Đã hoàn thành',
												textColor: '#FFFFFF',
												backgroundColor: '#16C1F3',
											},
											{
												state: STATE_WORK.REJECTED,
												text: 'Bị từ chối',
												textColor: '#FFFFFF',
												backgroundColor: '#EE464C',
											},
											{
												state: STATE_WORK.APPROVED,
												text: 'Đã được duyệt',
												textColor: '#FFFFFF',
												backgroundColor: '#06D7A0',
											},
										]}
									/>
								</div>
							),
						},
						{
							title: 'Tình trạng',
							render: (data: IReportWorkCurrent) => (
								<div style={{color: data?.megatype == 'Task' ? '#2970FF' : data?.megatype ? '' : ''}}>
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
								</div>
							),
						},
						{
							title: 'Số hóa',
							render: (data: IReportWorkCurrent) => (
								<span style={{color: data?.megatype == 'Task' ? '#2970FF' : data?.megatype ? '' : ''}}>
									{data?.digitalizedState == 0 && 'Chưa số hóa'}
									{data?.digitalizedState == 1 && 'Đã số hóa'}
								</span>
							),
						},
					]}
				/>
			</DataWrapper>
			<Pagination
				currentPage={Number(_page) || 1}
				pageSize={Number(_pageSize) || 10}
				total={listReportLastMonth?.pagination?.totalCount}
				dependencies={[_pageSize, _keyword, _state, _uuid]}
			/>
		</div>
	);
}

export default TableReportWorkCurrent;
