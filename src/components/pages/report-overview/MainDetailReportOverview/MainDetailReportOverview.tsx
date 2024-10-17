import React from 'react';

import {IDetailReportOverview, PropsMainDetailReportOverview} from './interfaces';
import styles from './MainDetailReportOverview.module.scss';
import Breadcrumb from '~/components/common/Breadcrumb';
import {PATH} from '~/constants/config';
import GridColumn from '~/components/layouts/GridColumn';
import {useRouter} from 'next/router';
import {useQuery} from '@tanstack/react-query';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import overviewServices from '~/services/overviewServices';
import Moment from 'react-moment';
import clsx from 'clsx';
import TabNavLink from '~/components/common/TabNavLink';
import ProjectReportOverview from '../ProjectReportOverview';
import WorkReportOverview from '../WorkReportOverview';
import DisbursementReportOverview from '../DisbursementReportOverview';
import PlanReportOverview from '../PlanReportOverview';

function MainDetailReportOverview({}: PropsMainDetailReportOverview) {
	const router = useRouter();

	const {_uuid, _type} = router.query;

	const {data: detailReportOverview} = useQuery<IDetailReportOverview>([QUERY_KEY.detail_report_overview, _uuid], {
		queryFn: () =>
			httpRequest({
				http: overviewServices.detailOverview({
					uuid: _uuid as string,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!_uuid,
	});

	return (
		<div className={styles.container}>
			<Breadcrumb
				listUrls={[
					{
						path: PATH.ReportOverview,
						title: 'Báo cáo tổng hợp',
					},
					{
						path: '',
						title: 'Chi tiết báo cáo',
					},
				]}
			/>
			<div className={styles.main}>
				<div className={styles.basic_info}>
					<div className={styles.head}>
						<h4>Thông tin tổng hợp</h4>
					</div>
					<div className={styles.progress_group}>
						<GridColumn col_3>
							<div className={styles.item}>
								<p>Tên công trình</p>
								<p>{detailReportOverview?.project?.name}</p>
							</div>
							<div className={styles.item}>
								<p>Báo cáo tổng hợp tháng</p>
								<p>{`Tháng ${detailReportOverview?.month} - ${detailReportOverview?.year}`}</p>
							</div>
							<div className={styles.item}>
								<p>Người báo cáo</p>
								<p>{detailReportOverview?.reporter?.fullname || ''}</p>
							</div>
							<div className={styles.item}>
								<p>Kế hoạch tiếp theo</p>
								<p>{`Tháng ${detailReportOverview?.nextMonth} - ${detailReportOverview?.nextYear}`}</p>
							</div>
							<div className={styles.item}>
								<p>Ngày gửi báo cáo tổng hợp</p>
								<p>
									{detailReportOverview?.created ? (
										<Moment date={detailReportOverview?.created} format='DD/MM/YYYY' />
									) : (
										'---'
									)}
								</p>
							</div>
						</GridColumn>
					</div>
				</div>
				<div className={clsx(styles.basic_info, styles.mt)}>
					<div className={styles.main_tab}>
						<TabNavLink
							query='_type'
							listHref={[
								{
									pathname: PATH.ReportOverview,
									query: null,
									title: 'Thông tin dự án',
								},
								{
									pathname: PATH.ReportOverview,
									query: 'work',
									title: 'Công việc thực hiện',
								},
								{
									pathname: PATH.ReportOverview,
									query: 'disbursement',
									title: 'Thông tin giải ngân',
								},
								{
									pathname: PATH.ReportOverview,
									query: 'plan',
									title: 'Kế hoạch tiếp theo',
								},
							]}
						/>
					</div>
					<div className={styles.line}></div>
					<div className={styles.main_table}>
						{!_type && <ProjectReportOverview />}
						{_type == 'work' && <WorkReportOverview />}
						{_type == 'disbursement' && <DisbursementReportOverview />}
						{_type == 'plan' && <PlanReportOverview />}
					</div>
				</div>
			</div>
		</div>
	);
}

export default MainDetailReportOverview;
