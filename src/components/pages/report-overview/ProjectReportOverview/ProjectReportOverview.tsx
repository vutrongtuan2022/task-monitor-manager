import React from 'react';

import {IProjectReportOverview, PropsProjectReportOverview} from './interfaces';
import styles from './ProjectReportOverview.module.scss';
import StateActive from '~/components/common/StateActive';
import {QUERY_KEY, STATE_PROJECT} from '~/constants/config/enum';
import GridColumn from '~/components/layouts/GridColumn';
import Progress from '~/components/common/Progress';
import {useRouter} from 'next/router';
import overviewServices from '~/services/overviewServices';
import {useQuery} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import Moment from 'react-moment';

function ProjectReportOverview({}: PropsProjectReportOverview) {
	const router = useRouter();

	const {_uuid} = router.query;

	const {data: projectReportOverview} = useQuery<IProjectReportOverview>([QUERY_KEY.detail_project_report_overview, _uuid], {
		queryFn: () =>
			httpRequest({
				http: overviewServices.detailProjectOverview({
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
			<div className={styles.head}>
				<h4>Thông tin cơ bản</h4>
				<div className={styles.state}>
					<p>Trạng thái:</p>
					<StateActive
						stateActive={projectReportOverview?.state!}
						listState={[
							{
								state: STATE_PROJECT.PREPARE,
								text: 'Chuẩn bị',
								textColor: '#fff',
								backgroundColor: '#5B70B3',
							},
							{
								state: STATE_PROJECT.DO,
								text: 'Thực hiện',
								textColor: '#fff',
								backgroundColor: '#16C1F3',
							},
							{
								state: STATE_PROJECT.FINISH,
								text: 'Kết thúc',
								textColor: '#fff',
								backgroundColor: '#06D7A0',
							},
						]}
					/>
				</div>
			</div>
			<div className={styles.progress_group}>
				<GridColumn col_3>
					<div className={styles.item}>
						<p>Mã dự án</p>
						<p>{projectReportOverview?.code}</p>
					</div>
					<div className={styles.item}>
						<p>Tên công trình</p>
						<p>{projectReportOverview?.name}</p>
					</div>
					<div className={styles.item}>
						<p>Tiến độ dự án</p>
						<p>
							<Progress percent={projectReportOverview?.progress!} width={80} />
						</p>
					</div>
					<div className={styles.item}>
						<p>Tên chi nhánh</p>
						<p>{projectReportOverview?.branch?.name || ''}</p>
					</div>
					<div className={styles.item}>
						<p>Mã chi nhánh</p>
						<p>{projectReportOverview?.branch?.code || ''}</p>
					</div>
					<div className={styles.item}>
						<p>Quy trình áp dụng</p>
						<p>{projectReportOverview?.taskCat?.name || ''}</p>
					</div>
					<div className={styles.item}>
						<p>Ngày tạo dự án</p>
						<p>
							{projectReportOverview?.created ? <Moment date={projectReportOverview?.created} format='DD/MM/YYYY' /> : '---'}
						</p>
					</div>
					<div className={styles.item}>
						<p>Thời gian bắt đầu dự tính</p>
						<p>
							{projectReportOverview?.expectStart ? (
								<Moment date={projectReportOverview?.expectStart} format='DD/MM/YYYY' />
							) : (
								'---'
							)}
						</p>
					</div>
					<div className={styles.item}>
						<p>Thời gian kết thúc dự tính</p>
						<p>
							{projectReportOverview?.expectEnd ? (
								<Moment date={projectReportOverview?.expectEnd} format='DD/MM/YYYY' />
							) : (
								'---'
							)}
						</p>
					</div>
					<div className={styles.item}>
						<p>Thời gian bắt đầu dự án được phê duyệt</p>
						<p>
							{projectReportOverview?.realStart ? (
								<Moment date={projectReportOverview?.realStart} format='DD/MM/YYYY' />
							) : (
								'---'
							)}
						</p>
					</div>
					<div className={styles.item}>
						<p>Thời gian kết thúc dự án</p>
						<p>
							{projectReportOverview?.realEnd ? <Moment date={projectReportOverview?.realEnd} format='DD/MM/YYYY' /> : '---'}
						</p>
					</div>
				</GridColumn>
			</div>
		</div>
	);
}

export default ProjectReportOverview;
