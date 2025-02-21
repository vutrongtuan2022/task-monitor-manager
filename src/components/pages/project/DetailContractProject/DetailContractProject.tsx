import React from 'react';

import {IContractDetailFund, IDetailContract, PropsDetailContractProject} from './interfaces';
import styles from './DetailContractProject.module.scss';
import Breadcrumb from '~/components/common/Breadcrumb';
import {PATH} from '~/constants/config';
import Button from '~/components/common/Button';
import GridColumn from '~/components/layouts/GridColumn';
import {useRouter} from 'next/router';
import {useQuery} from '@tanstack/react-query';
import {QUERY_KEY, STATE_CONTRACT_WORK, STATE_REPORT_DISBURSEMENT, STATUS_CONFIG} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import contractsServices from '~/services/contractsServices';
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
import PositionContainer from '~/components/common/PositionContainer';
import Tippy from '@tippyjs/react';

function DetailContractProject({}: PropsDetailContractProject) {
	const router = useRouter();

	const {_uuid, _page, _pageSize} = router.query;

	const {data: detailContract} = useQuery<IDetailContract>([QUERY_KEY.detail_contract, _uuid], {
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
		<div className={styles.container}>
			<Breadcrumb
				listUrls={[
					{
						title: 'Danh sách dự án',
						path: `${PATH.Project}`,
					},
					{
						path: `${PATH.ProjectDisbursementProgress}?_uuid=${detailContract?.projectDTO?.uuid}`,
						title: 'Quản lý hợp đồng',
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
						<div className={styles.state}>
							<p>Trạng thái hợp đồng:</p>
							<StateActive
								stateActive={detailContract?.state!}
								listState={[
									{
										state: STATE_CONTRACT_WORK.EXPIRED,
										text: 'Hết hạn',
										textColor: '#fff',
										backgroundColor: '#16C1F3',
									},
									{
										state: STATE_CONTRACT_WORK.PROCESSING,
										text: 'Đang thực hiện',
										textColor: '#fff',

										backgroundColor: '#06D7A0',
									},
									{
										state: STATE_CONTRACT_WORK.END,
										text: 'Đã hủy',
										textColor: '#fff',
										backgroundColor: '#F37277',
									},
								]}
							/>
						</div>
					</div>
					<div className={styles.progress_group}>
						<GridColumn col_3>
							<div className={styles.item}>
								<p>Số hợp đồng</p>
								<p>{detailContract?.code || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Lũy kế giải ngân trong năm</p>
								<p>{convertCoin(detailContract?.accumAmountThisYear!)}</p>
							</div>
							<div className={styles.item}>
								<p>Lũy kế giải ngân hiện tại</p>
								<p>
									<span style={{color: '#EE464C'}}>{convertCoin(detailContract?.accumAmount!)}</span> /{' '}
									<span>{convertCoin(detailContract?.amount!)}</span>
								</p>
							</div>
							<div className={styles.item}>
								<p>Tiến độ giải ngân</p>

								<Progress percent={detailContract?.progress!} width={80} />
							</div>
							<div className={styles.item}>
								<p>Tên công trình</p>
								<p>{detailContract?.projectDTO?.name || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Tên công việc</p>
								<p>{detailContract?.activityDTO?.name || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Số nhóm nhà thầu</p>
								<p>
									{detailContract?.contractorInfos?.length && (
										<Tippy
											content={
												<ol style={{paddingLeft: '16px'}}>
													{[...new Set(detailContract?.contractorInfos?.map((v) => v.contractorCatName))].map(
														(catName, i) => (
															<li key={i}>{catName}</li>
														)
													)}
												</ol>
											}
										>
											<span className={styles.link_contractor}>
												{[...new Set(detailContract?.contractorInfos?.map((v) => v.contractorCatName))]?.length ||
													'---'}
											</span>
										</Tippy>
									)}
								</p>
							</div>
							<div className={styles.item}>
								<p>Số nhà thầu</p>
								<p>
									{detailContract?.contractorInfos?.length && (
										<Tippy
											content={
												<ol style={{paddingLeft: '16px'}}>
													{[...new Set(detailContract?.contractorInfos?.map((v) => v.contractorName))].map(
														(catName, i) => (
															<li key={i}>{catName}</li>
														)
													)}
												</ol>
											}
										>
											<span className={styles.link_contractor}>
												{[...new Set(detailContract?.contractorInfos?.map((v) => v.contractorName))]?.length ||
													'---'}
											</span>
										</Tippy>
									)}
								</p>
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
								<p>Thời gian THHĐ (ngày)</p>
								<p>{detailContract?.totalDayAdvantage}</p>
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
								<p>Người tạo hợp đồng</p>
								<p>{detailContract?.creator?.fullname || '---'}</p>
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
										title: 'Báo cáo tháng',
										render: (data: IContractDetailFund) => (
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
										title: 'Sử dụng vốn dự phòng (VND)',
										render: (data: IContractDetailFund) => <>{convertCoin(data?.reverseAmount) || '---'}</>,
									},
									{
										title: 'Sử dụng vốn dự án (VND)',
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
										title: 'Mô tả',
										render: (data: IContractDetailFund) => (
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
							pageSize={Number(_pageSize) || 10}
							total={listContractFund?.pagination?.totalCount}
							dependencies={[_pageSize, _uuid]}
						/>
					</WrapperScrollbar>
				</div>
			</div>
		</div>
	);
}

export default DetailContractProject;
