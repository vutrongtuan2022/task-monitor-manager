import React from 'react';
import {IReportOverview, PropsMainPageReportOverview} from './interfaces';
import styles from './MainPageReportOverview.module.scss';
import {useRouter} from 'next/router';
import {generateYearsArray} from '~/common/funcs/selectDate';
import {useQuery} from '@tanstack/react-query';
import {QUERY_KEY, STATUS_CONFIG} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import Search from '~/components/common/Search';
import FilterCustom from '~/components/common/FilterCustom';
import WrapperScrollbar from '~/components/layouts/WrapperScrollbar';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import {convertCoin} from '~/common/funcs/convertCoin';
import Moment from 'react-moment';
import IconCustom from '~/components/common/IconCustom';
import {Eye} from 'iconsax-react';
import Pagination from '~/components/common/Pagination';
import {PATH} from '~/constants/config';
import overviewServices from '~/services/overviewServices';

function MainPageReportOverview({}: PropsMainPageReportOverview) {
	const router = useRouter();
	const years = generateYearsArray();
	const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

	const {_page, _pageSize, _keyword, _year, _month} = router.query;

	const listOverview = useQuery([QUERY_KEY.table_overview_report, _page, _pageSize, _keyword, _year, _month], {
		queryFn: () =>
			httpRequest({
				http: overviewServices.listOverview({
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 20,
					keyword: (_keyword as string) || '',
					status: STATUS_CONFIG.ACTIVE,
					year: !!_year ? Number(_year) : null,
					month: !!_month ? Number(_month) : null,
					reporterUuid: '',
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
				</div>
			</div>
			<WrapperScrollbar>
				<DataWrapper
					data={listOverview?.data?.items || []}
					loading={listOverview.isLoading}
					noti={<Noti title='Dữ liệu trống!' des='Danh sách báo cáo tổng hợp trống!' />}
				>
					<Table
						fixedHeader={true}
						data={listOverview?.data?.items || []}
						column={[
							{
								title: 'STT',
								render: (data: IReportOverview, index: number) => <>{index + 1}</>,
							},
							{
								title: 'Báo cáo tháng',
								render: (data: IReportOverview) => <>{`Tháng ${data?.month} - ${data?.year}`}</>,
							},
							{
								title: 'Tên công trình',
								render: (data: IReportOverview) => <>{data?.project?.name || '---'}</>,
							},
							{
								title: 'Số công việc thực hiện',
								render: (data: IReportOverview) => (
									<>
										<span style={{color: '#2970FF'}}>{data?.report?.completedActivity}</span>/
										<span>{data?.report?.totalActivity}</span>
									</>
								),
							},
							{
								title: 'Hợp đồng giải ngân',
								render: (data: IReportOverview) => <>{data?.fund?.totalContracts}</>,
							},
							{
								title: 'Số tiền giải ngân (VND)',
								render: (data: IReportOverview) => <>{convertCoin(data?.fund?.totalFunds) || '---'}</>,
							},
							{
								title: 'Tổng mức đầu tư (VND)',
								render: (data: IReportOverview) => <>{convertCoin(data?.totalInvest) || '---'}</>,
							},
							{
								title: 'Ngày gửi báo cáo',
								render: (data: IReportOverview) => (
									<>{data?.created ? <Moment date={data?.created} format='DD/MM/YYYY' /> : '---'}</>
								),
							},
							{
								title: 'Hành động',
								fixedRight: true,
								render: (data: IReportOverview) => (
									<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
										<IconCustom
											href={`${PATH.ReportOverview}/${data?.uuid}`}
											type='edit'
											icon={<Eye fontSize={20} fontWeight={600} />}
											tooltip='Xem chi tiết'
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
					total={listOverview?.data?.pagination?.totalCount}
					dependencies={[_pageSize, _keyword, _year, _month]}
				/>
			</WrapperScrollbar>
		</div>
	);
}

export default MainPageReportOverview;
