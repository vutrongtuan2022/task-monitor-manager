import React from 'react';

import {IDetailReportWork, PropsMainDetailReportWork} from './interfaces';
import styles from './MainDetailReportWork.module.scss';
import Breadcrumb from '~/components/common/Breadcrumb';
import {PATH} from '~/constants/config';
import Button from '~/components/common/Button';
import GridColumn from '~/components/layouts/GridColumn';
import {QUERY_KEY, STATE_REPORT_DISBURSEMENT} from '~/constants/config/enum';
import StateActive from '~/components/common/StateActive';
import {useRouter} from 'next/router';
import {useQuery} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import {convertCoin} from '~/common/funcs/convertCoin';
import Progress from '~/components/common/Progress';
import Moment from 'react-moment';
import reportServices from '~/services/reportServices';

function MainDetailReportWork({}: PropsMainDetailReportWork) {
	const router = useRouter();

	const {_uuid} = router.query;

	const {data: detailReport} = useQuery<IDetailReportWork>([QUERY_KEY.detail_report_work, _uuid], {
		queryFn: () =>
			httpRequest({
				http: reportServices.detailReport({
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
						path: PATH.ReportDisbursement,
						title: 'Báo cáo công việc',
					},
					{
						path: '',
						title: 'Chi tiết công việc',
					},
				]}
				action={
					<div className={styles.group_btn}>
						{detailReport?.approved == STATE_REPORT_DISBURSEMENT.PENDING_APPROVAL && (
							<>
								<Button p_14_24 rounded_8 green>
									Duyệt báo cáo
								</Button>
								<Button p_14_24 rounded_8 error>
									Từ chối báo cáo
								</Button>
							</>
						)}
						<Button
							p_14_24
							rounded_8
							light-red
							onClick={(e) => {
								e.preventDefault();
								window.history.back();
							}}
						>
							Quay lại
						</Button>
					</div>
				}
			/>
			<div className={styles.main}>
				<div className={styles.basic_info}>
					<div className={styles.head}>
						<h4>Thông tin cơ bản</h4>
						<div className={styles.state}>
							<p>Trạng thái dự án:</p>
							<StateActive
								stateActive={detailReport?.approved!}
								listState={[
									{
										state: STATE_REPORT_DISBURSEMENT.PENDING_APPROVAL,
										text: 'Chưa xử lý',
										textColor: '#fff',
										backgroundColor: '#5B70B3',
									},
									{
										state: STATE_REPORT_DISBURSEMENT.REJECTED,
										text: 'Bị từ chối',
										textColor: '#fff',
										backgroundColor: '#EE464C',
									},
									{
										state: STATE_REPORT_DISBURSEMENT.REPORTED,
										text: 'Đã duyệt',
										textColor: '#fff',
										backgroundColor: '#06D7A0',
									},
								]}
							/>
						</div>
					</div>
					<div className={styles.form}>
						<GridColumn col_3>
							<div className={styles.item}>
								<p>Tên công trình</p>
								<p>{detailReport?.project?.name || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Báo cáo tháng</p>
								<p>{detailReport?.monthReport || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Tổng mức đầu tư (VND)</p>
								<p>{convertCoin(detailReport?.totalInvest || 0) || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Kế hoạch vốn năm (VND)</p>
								<p>{convertCoin(detailReport?.annualBudget || 0) || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Số tiền giải ngân (VND)</p>
								<p>{convertCoin(detailReport?.realeaseBudget || 0) || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Lũy kế toàn bộ dự án (VND)</p>
								<p>{convertCoin(detailReport?.projectAccumAmount || 0) || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Thêm lũy kế theo năm (VND)</p>
								<p>{convertCoin(detailReport?.annualAccumAmount || 0) || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Tỷ lệ giải ngân</p>
								<Progress percent={detailReport?.fundProgress!} width={80} />
							</div>
							<div className={styles.item}>
								<p>Người báo cáo</p>
								<p>{detailReport?.reporter?.fullname || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Ngày gửi báo cáo</p>
								<p>{detailReport?.created ? <Moment date={detailReport?.created} format='DD/MM/YYYY' /> : '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Mô tả</p>
								<p>{detailReport?.note || '---'}</p>
							</div>
							{detailReport?.approved == STATE_REPORT_DISBURSEMENT.REJECTED && (
								<div className={styles.item}>
									<p>Lý do từ chối báo cáo giải ngân</p>
									<p>{detailReport?.feedback || '---'}</p>
								</div>
							)}
						</GridColumn>
					</div>
				</div>
			</div>
		</div>
	);
}

export default MainDetailReportWork;
