import React from 'react';

import {IPlanReportOverview, PropsPlanReportOverview} from './interfaces';
import styles from './PlanReportOverview.module.scss';
import {useRouter} from 'next/router';
import {useQuery} from '@tanstack/react-query';
import {QUERY_KEY, STATE_COMPLETE_REPORT, STATE_WORK, STATUS_CONFIG} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import overviewServices from '~/services/overviewServices';
import WrapperScrollbar from '~/components/layouts/WrapperScrollbar';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import Tippy from '@tippyjs/react';
import StateActive from '~/components/common/StateActive';
import Pagination from '~/components/common/Pagination';

function PlanReportOverview({}: PropsPlanReportOverview) {
	const router = useRouter();

	const {_uuid, _page, _pageSize} = router.query;

	const {data: nextPlanReport, isLoading} = useQuery([QUERY_KEY.table_next_plan_report_overview, _uuid, _page, _pageSize], {
		queryFn: () =>
			httpRequest({
				http: overviewServices.nextReportOverview({
					uuid: _uuid as string,
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 10,
					keyword: '',
					status: STATUS_CONFIG.ACTIVE,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!_uuid,
	});

	return (
		<div className={styles.container}>
			<div className={styles.head}>
				<h4>Danh sách công việc tháng tới</h4>
			</div>
			<div className={styles.progress_group}>
				<WrapperScrollbar>
					<DataWrapper
						data={nextPlanReport?.items || []}
						loading={isLoading}
						noti={<Noti title='Dữ liệu trống!' des='Danh sách công việc tháng tới trống!' />}
					>
						<Table
							fixedHeader={true}
							data={nextPlanReport?.items || []}
							column={[
								{
									title: 'STT',
									render: (data: IPlanReportOverview, index: number) => (
										<p style={{color: data?.megatype == 'Task' ? '#2970FF' : data?.megatype ? '' : ''}}>{index + 1}</p>
									),
								},
								{
									title: 'Tên công việc',
									render: (data: IPlanReportOverview, index: number) => (
										<Tippy content={data?.name || '---'}>
											<p
												className={styles.name}
												style={{color: data?.megatype == 'Task' ? '#2970FF' : data?.megatype ? '' : ''}}
											>
												{data?.name || '---'}
											</p>
										</Tippy>
									),
								},
								{
									title: 'Giai đoạn thực hiện',
									render: (data: IPlanReportOverview) => (
										<p style={{color: data?.megatype == 'Task' ? '#2970FF' : data?.megatype ? '' : ''}}>
											{!data?.stage && '---'}
											{data?.stage == 1 && 'Giai đoạn chuẩn bị đầu tư'}
											{data?.stage == 2 && 'Giai đoạn thực hiện đầu tư'}
											{data?.stage == 3 && 'Giai đoạn kết thúc đầu tư xây dựng'}
										</p>
									),
								},
								{
									title: 'Megatype',
									render: (data: IPlanReportOverview) => (
										<p style={{color: data?.megatype == 'Task' ? '#2970FF' : data?.megatype ? '' : ''}}>
											{data?.megatype || '---'}
										</p>
									),
								},
								{
									title: 'Số hóa',
									render: (data: IPlanReportOverview) => (
										<span style={{color: data?.megatype == 'Task' ? '#2970FF' : data?.megatype ? '' : ''}}>
											<p>{data?.digitalization == 0 && 'Chưa số hóa'}</p>
											<p>{data?.digitalization == 1 && 'Đã số hóa'}</p>
										</span>
									),
								},
								{
									title: 'Loại công việc',
									render: (data: IPlanReportOverview) => (
										<span style={{color: data?.megatype == 'Task' ? '#2970FF' : data?.megatype ? '' : ''}}>
											{data?.isWorkFlow == 1 && 'Có kế hoạch'}
											{data?.isWorkFlow == 0 && 'Phát sinh'}
										</span>
									),
								},
								{
									title: 'Người báo cáo',
									render: (data: IPlanReportOverview) => (
										<p style={{color: data?.megatype == 'Task' ? '#2970FF' : data?.megatype ? '' : ''}}>
											{data?.reporter?.fullname || '---'}
										</p>
									),
								},
								{
									title: 'Trạng thái',
									fixedRight: true,
									render: (data: IPlanReportOverview) => (
										<StateActive
											stateActive={data?.state}
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
									),
								},
								{
									title: 'Tình trạng',
									render: (data: IPlanReportOverview) => (
										<StateActive
											isBox={false}
											stateActive={data?.deadlineStage}
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
							]}
						/>
					</DataWrapper>
					<Pagination
						currentPage={Number(_page) || 1}
						pageSize={Number(_pageSize) || 10}
						total={nextPlanReport?.pagination?.totalCount}
						dependencies={[_uuid, _pageSize]}
					/>
				</WrapperScrollbar>
			</div>
		</div>
	);
}

export default PlanReportOverview;
