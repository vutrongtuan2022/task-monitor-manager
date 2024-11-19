import React from 'react';

import {IDisbursementReportOverview, PropsDisbursementReportOverview} from './interfaces';
import styles from './DisbursementReportOverview.module.scss';
import {useRouter} from 'next/router';
import {useQuery} from '@tanstack/react-query';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import overviewServices from '~/services/overviewServices';
import GridColumn from '~/components/layouts/GridColumn';
import {convertCoin} from '~/common/funcs/convertCoin';

function DisbursementReportOverview({}: PropsDisbursementReportOverview) {
	const router = useRouter();

	const {_uuid} = router.query;

	const {data: disbursementReportOverview} = useQuery<IDisbursementReportOverview>(
		[QUERY_KEY.detail_disbursement_report_overview, _uuid],
		{
			queryFn: () =>
				httpRequest({
					http: overviewServices.detailDisbursementOverview({
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
		<div className={styles.container}>
			<div className={styles.head}>
				<h4>Thông tin cơ bản</h4>
			</div>
			<div className={styles.progress_group}>
				<GridColumn col_3>
					<div className={styles.item}>
						<p>Tên công trình</p>
						<p>{disbursementReportOverview?.projectDTO?.name || '---'}</p>
					</div>
					<div className={styles.item}>
						<p>Báo cáo tháng</p>
						{!!disbursementReportOverview?.month && disbursementReportOverview?.year ? (
							<p>{`Tháng ${disbursementReportOverview?.month} - ${disbursementReportOverview?.year}` || '---'}</p>
						) : (
							'---'
						)}
					</div>
					<div className={styles.item}>
						<p>Số hợp đồng giải ngân</p>
						<p>{disbursementReportOverview?.totalContracts || '---'}</p>
					</div>
					<div className={styles.item}>
						<p>Tổng số tiền đã giải ngân (VND)</p>
						<p>
							<span style={{color: '#EE464C'}}>
								{disbursementReportOverview?.totalFunds ? convertCoin(disbursementReportOverview?.totalFunds!) : '---'}
							</span>
						</p>
					</div>
				</GridColumn>
			</div>
		</div>
	);
}

export default DisbursementReportOverview;
