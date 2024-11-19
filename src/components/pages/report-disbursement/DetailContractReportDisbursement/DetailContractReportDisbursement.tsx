import React from 'react';

import {IContractDetailFund, IDetailContract, PropsDetailContractReportDisbursement} from './interfaces';
import styles from './DetailContractReportDisbursement.module.scss';
import Breadcrumb from '~/components/common/Breadcrumb';
import {PATH} from '~/constants/config';
import GridColumn from '~/components/layouts/GridColumn';
import {useRouter} from 'next/router';
import {useQuery} from '@tanstack/react-query';
import {QUERY_KEY, STATE_REPORT_DISBURSEMENT, STATUS_CONFIG} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import {convertCoin} from '~/common/funcs/convertCoin';
import Progress from '~/components/common/Progress';
import Moment from 'react-moment';
import clsx from 'clsx';
import WrapperScrollbar from '~/components/layouts/WrapperScrollbar';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import Pagination from '~/components/common/Pagination';
import StateActive from '~/components/common/StateActive';
import contractsServices from '~/services/contractsServices';

function DetailContractReportDisbursement({}: PropsDetailContractReportDisbursement) {
	const router = useRouter();

	const {_uuid, _page, _pageSize} = router.query;

	const {data: detailContract} = useQuery<IDetailContract>([QUERY_KEY.detail_contract], {
		queryFn: () =>
			httpRequest({
				http: contractsServices.detailContracts({
					uuid: _uuid as string,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!_uuid,
	});

	const {data: listContractFund} = useQuery([QUERY_KEY.table_contract_fund_detail, _page, _pageSize, _uuid], {
		queryFn: () =>
			httpRequest({
				http: contractsServices.contractsReportFundpaged({
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 20,
					keyword: '',
					status: STATUS_CONFIG.ACTIVE,
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
						title: 'Danh sách báo cáo giải ngân',
					},
					{
						path: '',
						title: 'Chi tiết hợp đồng',
					},
				]}
			/>

			<div className={styles.main}>
				<div className={styles.basic_info}>
					<div className={styles.head}>
						<h4>Thông tin cơ bản</h4>
					</div>
					<div className={styles.progress_group}>
						<GridColumn col_3>
							<div className={styles.item}>
								<p>Số hợp đồng</p>
								<p>{detailContract?.code || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Lũy kế giải ngân hiện tại</p>
								<p>
									<span style={{color: '#EE464C'}}>{convertCoin(detailContract?.contractExecution?.amount!)}</span> /{' '}
									<span>{convertCoin(detailContract?.amount!)}</span>
								</p>
							</div>
							<div className={styles.item}>
								<p>Tiến độ giải ngân</p>

								<Progress percent={detailContract?.progress!} width={80} />
							</div>
							<div className={styles.item}>
								<p>Tên công việc</p>
								<p>{detailContract?.activityDTO?.name || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Thuộc nhóm nhà thầu</p>
								<p>{detailContract?.contractorDTO?.contractorCat?.name || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Tên nhà thầu</p>
								<p>{detailContract?.contractorDTO?.name || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Ngày ký hợp đồng</p>
								<p>{detailContract?.startDate ? <Moment date={detailContract?.startDate} format='DD/MM/YYYY' /> : '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Giá trị hợp đồng</p>
								<p>{convertCoin(detailContract?.amount!) || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Thời gian THHĐ</p>
								<p>
									{detailContract?.totalDayAdvantage ? (
										<Moment date={detailContract?.totalDayAdvantage} format='DD/MM/YYYY' />
									) : (
										'---'
									)}
								</p>
							</div>
							<div className={styles.item}>
								<p>Giá trị BLTHHĐ</p>
								<p>{convertCoin(detailContract?.contractExecution?.amount!) || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Ngày kết thúc BLTHHĐ</p>
								<p>
									{detailContract?.contractExecution?.endDate ? (
										<Moment date={detailContract?.contractExecution?.endDate} format='DD/MM/YYYY' />
									) : (
										'---'
									)}
								</p>
							</div>
							<div className={styles.item}>
								<p>Giá trị BLTƯ</p>
								<p>{convertCoin(detailContract?.advanceGuarantee?.amount!) || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Ngày kết thúc BLTƯ</p>
								<p>
									{detailContract?.advanceGuarantee?.endDate ? (
										<Moment date={detailContract?.advanceGuarantee?.endDate} format='DD/MM/YYYY' />
									) : (
										'---'
									)}
								</p>
							</div>
							<div className={styles.item}>
								<p>Thời gian tạo</p>
								<p>{detailContract?.created ? <Moment date={detailContract?.created} format='DD/MM/YYYY' /> : '---'}</p>
							</div>
						</GridColumn>
					</div>
				</div>
				<div className={clsx(styles.basic_info, styles.mt)}>
					<div className={styles.head}>
						<h4>Danh sách giải ngân</h4>
					</div>
					<WrapperScrollbar>
						<DataWrapper
							data={listContractFund?.items || []}
							loading={listContractFund?.isLoading}
							noti={<Noti title='Danh sách giải ngân trống!' des='Hiện tại chưa có thông tin giải ngân nào!' />}
						>
							<Table
								fixedHeader={true}
								data={listContractFund?.items || []}
								column={[
									{
										title: 'STT',
										render: (data: IContractDetailFund, index: number) => <>{index + 1}</>,
									},

									{
										title: 'Thời gian giải ngân',
										render: (data: IContractDetailFund) => (
											<>{`Tháng ${data?.releasedMonth} - ${data?.releasedYear}`}</>
										),
									},
									{
										title: 'Vốn dự phòng (VND)',
										render: (data: IContractDetailFund) => <>{convertCoin(data?.reverseAmount) || '---'}</>,
									},
									{
										title: 'Vốn dự án (VND)',
										render: (data: IContractDetailFund) => <>{convertCoin(data?.projectAmount) || '---'}</>,
									},
									{
										title: 'Ngày giải ngân',
										render: (data: IContractDetailFund) => (
											<p>{data?.releasedDate ? <Moment date={data?.releasedDate} format='DD/MM/YYYY' /> : '---'}</p>
										),
									},
									{
										title: 'Thời gian tạo',
										render: (data: IContractDetailFund) => (
											<p>{data?.created ? <Moment date={data?.created} format='DD/MM/YYYY' /> : '---'}</p>
										),
									},
									{
										title: 'Trạng thái',
										render: (data: IContractDetailFund) => (
											<StateActive
												stateActive={data?.state}
												listState={[
													{
														state: STATE_REPORT_DISBURSEMENT.REJECTED,
														text: 'Bị từ chối',
														textColor: '#FFFFFF',
														backgroundColor: '#F37277',
													},
													{
														state: STATE_REPORT_DISBURSEMENT.REPORTED,
														text: 'Đã báo cáo',
														textColor: '#FFFFFF',
														backgroundColor: '#4BC9F0',
													},
													{
														state: STATE_REPORT_DISBURSEMENT.APPROVED,
														text: 'Đã duyệt',
														textColor: '#FFFFFF',
														backgroundColor: '#06D7A0',
													},
													{
														state: STATE_REPORT_DISBURSEMENT.NOT_REPORT,
														text: 'Chưa báo cáo',
														textColor: '#FFFFFF',
														backgroundColor: '#FF852C',
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
							total={listContractFund?.pagination?.totalCount}
							dependencies={[_pageSize, _uuid]}
						/>
					</WrapperScrollbar>
				</div>
			</div>
		</div>
	);
}

export default DetailContractReportDisbursement;
