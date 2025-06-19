import React from 'react';
import styles from './TableContractFund.module.scss';
import {PropsTableContractFund} from './interface';
import {useRouter} from 'next/router';
import {useQuery} from '@tanstack/react-query';
import {QUERY_KEY, STATE_REPORT_DISBURSEMENT, STATUS_CONFIG} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import contractsServices from '~/services/contractsServices';
import clsx from 'clsx';
import WrapperScrollbar from '~/components/layouts/WrapperScrollbar';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import {convertCoin} from '~/common/funcs/convertCoin';
import Moment from 'react-moment';
import Tippy from '@tippyjs/react';
import StateActive from '~/components/common/StateActive';
import Pagination from '~/components/common/Pagination';
function TableContractFund() {
	const router = useRouter();

	const {_page, _pageSize, _uuid} = router.query;

	const {data: listContractFund} = useQuery([QUERY_KEY.table_contract_fund_detail, _page, _pageSize, _uuid], {
		queryFn: () =>
			httpRequest({
				http: contractsServices.contractsReportFundpaged({
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 10,
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
								render: (data: PropsTableContractFund, index: number) => <>{index + 1}</>,
							},

							{
								title: 'Báo cáo tháng',
								render: (data: PropsTableContractFund) => (
									<>
										{data?.releasedMonth && data?.releasedYear
											? `Tháng ${data?.releasedMonth} - ${data?.releasedYear}`
											: !data?.releasedMonth && data?.releasedYear
											? `Năm ${data?.releasedYear}`
											: '---'}
									</>
								),
							},
							{
								title: 'Tên nhóm nhà thầu',
								render: (data: PropsTableContractFund) => <>{data?.pnContract?.contractor?.contractorCat?.name || '---'}</>,
							},
							{
								title: 'Tên nhà thầu',
								render: (data: PropsTableContractFund) => <>{data?.pnContract?.contractor?.contractor?.name || '---'}</>,
							},
							{
								title: 'Sử dụng vốn dự phòng (VND)',
								render: (data: PropsTableContractFund) => <>{convertCoin(data?.reverseAmount) || '---'}</>,
							},
							{
								title: 'Sử dụng vốn dự án (VND)',
								render: (data: PropsTableContractFund) => <>{convertCoin(data?.projectAmount) || '---'}</>,
							},
							// {
							// 	title: 'Người tạo',
							// 	render: (data: PropsTableContractFund) => <>{data?.creator?.fullname}</>,
							// },
							{
								title: 'Ngày giải ngân',
								render: (data: PropsTableContractFund) => (
									<p>{data?.releasedDate ? <Moment date={data?.releasedDate} format='DD/MM/YYYY' /> : '---'}</p>
								),
							},
							{
								title: 'Số thông báo chấp thuận thanh toán',
								render: (data: PropsTableContractFund) => <>{data?.pnContract?.pn?.code || '---'}</>,
							},
							{
								title: 'Ngày chấp nhận thanh toán',
								render: (data: PropsTableContractFund) => (
									<>
										{data?.pnContract ? (
											<Moment date={data?.pnContract?.pn?.numberingDate} format='DD/MM/YYYY' />
										) : (
											'---'
										)}
									</>
								),
							},
							{
								title: 'Giá trị chấp nhận thanh toán (VND)',
								render: (data: PropsTableContractFund) => <>{convertCoin(data?.pnContract?.amount) || '---'}</>,
							},
							{
								title: 'Thời gian tạo',
								render: (data: PropsTableContractFund) => (
									<p>{data?.created ? <Moment date={data?.created} format='DD/MM/YYYY' /> : '---'}</p>
								),
							},
							{
								title: 'Mô tả',
								render: (data: PropsTableContractFund) => (
									<>
										{(data?.note && (
											<Tippy content={data?.note}>
												<p className={styles.name}>{data?.note || '---'}</p>
											</Tippy>
										)) ||
											'---'}
									</>
								),
							},
							{
								title: 'Trạng thái',
								render: (data: PropsTableContractFund) => (
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
					pageSize={Number(_pageSize) || 10}
					total={listContractFund?.pagination?.totalCount}
					dependencies={[_pageSize, _uuid]}
				/>
			</WrapperScrollbar>
		</div>
	);
}

export default TableContractFund;
