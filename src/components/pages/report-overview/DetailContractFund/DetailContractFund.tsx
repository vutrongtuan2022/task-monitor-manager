import Button from '~/components/common/Button';
import styles from './DetailContractFund.module.scss';
import {IDetailContractFund, PropsDetailContractFund} from './interfaces';
import {memo} from 'react';
import WrapperScrollbar from '~/components/layouts/WrapperScrollbar';
import DataWrapper from '~/components/common/DataWrapper';
import Table from '~/components/common/Table';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Moment from 'react-moment';
import {convertCoin} from '~/common/funcs/convertCoin';
import {useRouter} from 'next/router';
import {useQuery} from '@tanstack/react-query';
import {QUERY_KEY, STATUS_CONFIG} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import overviewServices from '~/services/overviewServices';

function DetailContractFund({onClose, userContractFund}: PropsDetailContractFund) {
	const router = useRouter();

	const {_page, _pageSize} = router.query;
	const {data: listContractFundDetail} = useQuery(
		[
			QUERY_KEY.table_contract_fund_for_overview_contractor,
			_page,
			_pageSize,
			userContractFund?.contractUuid,
			userContractFund?.overviewReportUuid,
		],
		{
			queryFn: () =>
				httpRequest({
					http: overviewServices.listDetailContractFundReportOverview({
						page: Number(_page) || 1,
						pageSize: Number(_pageSize) || 100,
						contractUuid: userContractFund.contractUuid,
						overviewReportUuid: userContractFund.overviewReportUuid,
					}),
				}),
			select(data) {
				return data;
			},
			enabled: !!userContractFund?.contractUuid && !!userContractFund?.overviewReportUuid,
		}
	);
	console.log(listContractFundDetail);

	return (
		<div className={styles.container}>
			<div className={styles.head_main}>
				<h2>Chi tiết lịch sử giải ngân</h2>
				<div>
					<Button p_12_20 grey rounded_6 onClick={onClose}>
						Đóng
					</Button>
				</div>
			</div>
			<div className={styles.main}>
				<div className={styles.head}>
					<h4>
						Danh sách lịch sử cho hợp đồng {userContractFund?.code} <span style={{color: 'red'}}>*</span>
					</h4>
				</div>
				<div className={styles.main_table}>
					<WrapperScrollbar>
						<DataWrapper
							data={listContractFundDetail?.items || []}
							loading={listContractFundDetail?.isLoading}
							noti={<Noti title='Danh sách lịch sử giải ngân trống!' des='Hiện tại chưa có thông tin giải ngân nào!' />}
						>
							<Table
								fixedHeader={true}
								data={listContractFundDetail?.items || []}
								column={[
									{
										title: 'STT',
										render: (data: IDetailContractFund, index: number) => <>{index + 1}</>,
									},

									{
										title: 'Tên nhóm nhà thầu',
										render: (data: IDetailContractFund) => (
											<>{data?.pnContract?.contractor?.contractorCat?.name || '---'}</>
											// <>
											// 	{data?.releasedMonth && data?.releasedYear
											// 		? `Tháng ${data?.releasedMonth} - ${data?.releasedYear}`
											// 		: !data?.releasedMonth && data?.releasedYear
											// 		? `Năm ${data?.releasedYear}`
											// 		: '---'}
											// </>
										),
									},
									{
										title: 'Tên nhà thầu',
										render: (data: IDetailContractFund) => (
											<>{data?.pnContract?.contractor?.contractor?.name || '---'}</>
										),
									},
									{
										title: 'Tổng giá trị giải ngân (VND)',
										render: (data: IDetailContractFund) => <>{convertCoin(data?.totalAmount) || '---'}</>,
									},
									{
										title: 'Sử dụng vốn dự phòng (VND)',
										render: (data: IDetailContractFund) => <>{convertCoin(data?.reverseAmount) || '---'}</>,
									},
									{
										title: 'Sử dụng vốn dự án (VND)',
										render: (data: IDetailContractFund) => <>{convertCoin(data?.projectAmount) || '---'}</>,
									},

									{
										title: 'CSCTTT',
										render: (data: IDetailContractFund) => (
											<>{data?.pnContract?.pn?.code || '---'}</>
											// <p>{data?.created ? <Moment date={data?.created} format='DD/MM/YYYY' /> : '---'}</p>
										),
									},
									{
										title: 'Ngày giải ngân',
										render: (data: IDetailContractFund) => (
											<>{data?.releaseDate ? <Moment date={data?.releaseDate} format='DD/MM/YYYY' /> : '---'}</>
										),
									},
									{
										title: 'Ngày CTTT',
										render: (data: IDetailContractFund) => (
											<p>
												{data?.pnContract?.pn?.numberingDate ? (
													<Moment date={data?.pnContract?.pn?.numberingDate} format='DD/MM/YYYY' />
												) : (
													'---'
												)}
											</p>
										),
									},
									{
										title: 'Giá trị CTTT',
										render: (data: IDetailContractFund) => (
											<p>
												{data?.pnContract?.amount ? (
													<Moment date={data?.pnContract?.amount} format='DD/MM/YYYY' />
												) : (
													'---'
												)}
											</p>
										),
									},
									{
										title: 'Mô tả',
										render: (data: IDetailContractFund) => <p>{data?.note || '---'}</p>,
									},
								]}
							/>
						</DataWrapper>
					</WrapperScrollbar>
				</div>
			</div>
		</div>
	);
}

export default memo(DetailContractFund);
