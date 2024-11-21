import React from 'react';

import {IWorkUser, PropsMainPageWorkUser} from './interfaces';
import styles from './MainPageWorkUser.module.scss';
import Search from '~/components/common/Search';
import FilterCustom from '~/components/common/FilterCustom';
import {
	QUERY_KEY,
	STATE_COMPLETE_REPORT,
	STATE_REPORT_WORK,
	STATUS_CONFIG,
	TYPE_ACCOUNT,
	TYPE_OF_WORK,
	TYPE_WORK,
} from '~/constants/config/enum';
import {useRouter} from 'next/router';
import WrapperScrollbar from '~/components/layouts/WrapperScrollbar';
import {useQuery} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import activityServices from '~/services/activityServices';
import Pagination from '~/components/common/Pagination';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import Progress from '~/components/common/Progress';
import StateActive from '~/components/common/StateActive';
import {generateYearsArray} from '~/common/funcs/selectDate';
import Tippy from '@tippyjs/react';
import userServices from '~/services/userServices';
import projectServices from '~/services/projectServices';

function MainPageWorkUser({}: PropsMainPageWorkUser) {
	const router = useRouter();

	const years = generateYearsArray();
	const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

	const {_page, _pageSize, _keyword, _state, _year, _month, _type, _reporterUuid, _project} = router.query;

	const {data: listUser} = useQuery([QUERY_KEY.dropdown_user], {
		queryFn: () =>
			httpRequest({
				http: userServices.categoryUser({
					keyword: '',
					status: STATUS_CONFIG.ACTIVE,
					roleUuid: '',
					type: TYPE_ACCOUNT.USER,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const {data: listProject} = useQuery([QUERY_KEY.dropdown_project], {
		queryFn: () =>
			httpRequest({
				http: projectServices.categoryProject({
					keyword: '',
					status: STATUS_CONFIG.ACTIVE,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listWork = useQuery(
		[QUERY_KEY.table_list_work_user, _page, _pageSize, _keyword, _state, _year, _month, _type, _reporterUuid, _project],
		{
			queryFn: () =>
				httpRequest({
					http: activityServices.listActivityForActionNew({
						page: Number(_page) || 1,
						pageSize: Number(_pageSize) || 10,
						keyword: (_keyword as string) || '',
						status: STATUS_CONFIG.ACTIVE,
						state: !!_state ? Number(_state) : null,
						year: !!_year ? Number(_year) : null,
						month: !!_month ? Number(_month) : null,
						type: !!_type ? Number(_type) : null,
						projectUuid: (_project as string) || '',
						userUuid: (_reporterUuid as string) || '',
					}),
				}),
			select(data) {
				return data;
			},
		}
	);

	return (
		<div className={styles.container}>
			<div className={styles.head}>
				<div className={styles.main_search}>
					<div className={styles.search}>
						<Search keyName='_keyword' placeholder='Tìm kiếm theo tên công việc, dự án' />
					</div>
					<div className={styles.filter}>
						<FilterCustom
							isSearch
							name='Dự án'
							query='_project'
							listFilter={listProject?.map((v: any) => ({
								id: v?.uuid,
								name: v?.name,
							}))}
						/>
					</div>
					<div className={styles.filter}>
						<FilterCustom
							isSearch
							name='Người báo cáo'
							query='_reporterUuid'
							listFilter={listUser?.map((v: any) => ({
								id: v?.uuid,
								name: v?.fullname,
							}))}
						/>
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
							name='Loại công việc'
							query='_type'
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
					<div className={styles.filter}>
						<FilterCustom
							isSearch
							name='Trạng thái'
							query='_state'
							listFilter={[
								{
									id: STATE_REPORT_WORK.NOT_PROCESSED,
									name: 'Chưa xử lý',
								},
								{
									id: STATE_REPORT_WORK.PROCESSING,
									name: 'Đang xử lý',
								},
								{
									id: STATE_REPORT_WORK.COMPLETED,
									name: 'Đã hoàn thành',
								},
							]}
						/>
					</div>
				</div>
			</div>
			<WrapperScrollbar>
				<DataWrapper
					data={listWork?.data?.items || []}
					loading={listWork.isLoading}
					noti={<Noti title='Dữ liệu trống!' des='Danh sách công việc cần làm trống!' />}
				>
					<Table
						fixedHeader={true}
						data={listWork?.data?.items || []}
						column={[
							{
								title: 'STT',
								render: (data: IWorkUser, index: number) => <>{index + 1}</>,
							},
							{
								title: 'Tháng báo cáo',
								fixedLeft: true,
								render: (data: IWorkUser) => (
									<>
										Tháng <span>{data?.report?.month}</span> - <span>{data?.report?.year}</span>
									</>
								),
							},
							{
								title: 'Tên công trình',
								render: (data: IWorkUser) => (
									<Tippy content={data?.report?.project?.name}>
										<p className={styles.project_name}>{data?.report?.project?.name}</p>
									</Tippy>
								),
							},
							{
								title: 'Tên công việc',
								render: (data: IWorkUser) => (
									<Tippy content={data?.activity?.name}>
										<p className={styles.name}>{data?.activity?.name}</p>
									</Tippy>
								),
							},
							{
								title: 'Giai đoạn thực hiện',
								render: (data: IWorkUser) => (
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
								render: (data: IWorkUser) => (
									<p>
										{data?.type == TYPE_WORK.TASK && 'Task'}
										{data?.type == TYPE_WORK.SUB_TASK && 'Subtask'}
										{data?.type == TYPE_WORK.SUB_SUB_TASK && 'Subsubtask'}
									</p>
								),
							},
							{
								title: 'Người báo cáo',
								render: (data: IWorkUser) => <>{data?.report?.reporter?.fullname || '---'}</>,
							},
							{
								title: 'Loại công việc',
								render: (data: IWorkUser) => (
									<>
										{!data?.isInWorkflow && 'Phát sinh'}
										{data?.isInWorkflow && 'Có kế hoạch'}
									</>
								),
							},
							{
								title: 'Khó khăn vướng mắc',
								render: (data: IWorkUser) => (
									<>
										{(data?.issue && (
											<Tippy content={data?.issue}>
												<p className={styles.name}>{data?.issue || '---'}</p>
											</Tippy>
										)) ||
											'---'}
									</>
								),
							},
							{
								title: 'Tiến độ công việc',
								render: (data: IWorkUser) => <Progress percent={data?.progress} width={80} />,
							},
							{
								title: 'Trạng thái',
								render: (data: IWorkUser) => (
									<StateActive
										stateActive={data?.activityState}
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
								render: (data: IWorkUser) => (
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
						]}
					/>
				</DataWrapper>
				<Pagination
					currentPage={Number(_page) || 1}
					pageSize={Number(_pageSize) || 10}
					total={listWork?.data?.pagination?.totalCount}
					dependencies={[_pageSize, _keyword, _state, _year, _month, _type, _reporterUuid, _project]}
				/>
			</WrapperScrollbar>
		</div>
	);
}

export default MainPageWorkUser;
