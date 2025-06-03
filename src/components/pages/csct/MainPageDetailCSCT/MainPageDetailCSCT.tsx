import Breadcrumb from '~/components/common/Breadcrumb';
import styles from './MainPageDetailCSCT.module.scss';
import {IContractsForProject, IDetailCSCT, PropsMainPageDetailCSCT} from './interfaces';
import {PATH} from '~/constants/config';
import GridColumn from '~/components/layouts/GridColumn';
import StateActive from '~/components/common/StateActive';
import {QUERY_KEY, STATE_CONTRACT_WORK, STATUS_CONFIG, STATUS_CSCT} from '~/constants/config/enum';
import {convertCoin} from '~/common/funcs/convertCoin';
import {useRouter} from 'next/router';
import {useQuery} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import pnServices from '~/services/pnServices';
import clsx from 'clsx';
import DataWrapper from '~/components/common/DataWrapper';
import contractsServices from '~/services/contractsServices';
import Table from '~/components/common/Table';
import Tippy from '@tippyjs/react';
import Link from 'next/link';
import Moment from 'react-moment';
import Pagination from '~/components/common/Pagination';

function MainPageDetailCSCT({}: PropsMainPageDetailCSCT) {
	const router = useRouter();

	const {_uuid, _page, _pageSize, _keyword, _contractorUuid, _contractorCat} = router.query;

	const {data: detailCSCT} = useQuery<IDetailCSCT>([QUERY_KEY.detail_csct, _uuid], {
		queryFn: () =>
			httpRequest({
				http: pnServices.detailPN({
					uuid: _uuid as string,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!_uuid,
	});

	const {data: listContractForProject, isLoading} = useQuery(
		[QUERY_KEY.table_contract_for_project, _uuid, _page, _pageSize, _keyword, _contractorUuid, _contractorCat],
		{
			queryFn: () =>
				httpRequest({
					http: contractsServices.listContractsForProject({
						page: Number(_page) || 1,
						pageSize: Number(_pageSize) || 10,
						keyword: (_keyword as string) || '',
						status: STATUS_CONFIG.ACTIVE,
						projectUuid: (_uuid as string) || '',
						contractorUuid: (_contractorUuid as string) || '',
						contractorCat: (_contractorCat as string) || '',
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
			<Breadcrumb
				listUrls={[
					{
						path: PATH.CSCT,
						title: 'Danh sách CSCT thanh toán',
					},
					{
						path: '',
						title: 'Chi tiết',
					},
				]}
			/>
			<div className={styles.main}>
				<div className={styles.basic_info}>
					<div className={styles.head}>
						<h4>Thông tin cơ bản</h4>
						<div className={styles.state}>
							<p>Trạng thái giải ngân:</p>
							<StateActive
								stateActive={1}
								listState={[
									{
										state: STATUS_CSCT.NUMBER_ISSUED,
										text: 'CSCTTT đã cấp số',
										textColor: '#fff',
										backgroundColor: '#005994',
									},
									{
										state: STATUS_CSCT.PENDING_APPROVAL,
										text: 'CSCTTT chờ phê duyệt',
										textColor: '#fff',
										backgroundColor: '#FDAD73',
									},
									{
										state: STATUS_CSCT.APPROVED,
										text: 'CSCTTT đã phê duyệt',
										textColor: '#fff',
										backgroundColor: '#06D7A0',
									},
									{
										state: STATUS_CSCT.REJECTED,
										text: 'CSCTTT bị từ chối',
										textColor: '#fff',
										backgroundColor: '#EE464C',
									},
								]}
							/>
						</div>
					</div>
					<div className={styles.form}>
						<GridColumn col_3>
							<div className={styles.item}>
								<p>Mã dự án</p>
								<p style={{color: '#005994'}}>123456</p>
							</div>
							<div className={styles.item}>
								<p>Tên dự án</p>
								<p>Dự án cấp thành phố</p>
							</div>
							<div className={styles.item}>
								<p>Mã cấp số</p>
								<p>M2W23</p>
							</div>
							<div className={styles.item}>
								<p>Ngày lấy số</p>
								<p>03/06/2025</p>
							</div>
							<div className={styles.item}>
								<p>Ngày trên thông báo cấp vốn</p>
								<p>03/06/2025</p>
							</div>
							<div className={styles.item}>
								<p>Số lượng hợp đồng</p>
								<p>24</p>
							</div>
							<div className={styles.item}>
								<p>Lãnh đạo phụ trách</p>
								<p>Nguyễn Đức Bình</p>
							</div>
							<div className={styles.item}>
								<p>Cán bộ phụ trách</p>
								<p>Minh Đặng Vũ</p>
							</div>
							<div className={styles.item}>
								<p>Ngày tạo dự án</p>
								<p>03/06/2025</p>
							</div>
							<div className={styles.item}>
								<p>Tống giá trị thanh toán (VND)</p>
								<p>{convertCoin(2000000000)}</p>
							</div>
							<div className={styles.item}>
								<p>LKSCTTT theo năm (VND)</p>
								<p>{convertCoin(5000000000)}</p>
							</div>
							<div className={styles.item}>
								<p>LKSCT đến hiện tại (VND)</p>
								<p>{convertCoin(1200000000)}</p>
							</div>
						</GridColumn>
					</div>
				</div>
				<div className={clsx(styles.basic_info, styles.mt)}>
					<div className={styles.head}>
						<h4>Danh sách hợp đồng</h4>
					</div>
					<div className={styles.main_table}>
						<DataWrapper
							loading={isLoading}
							data={
								// listContractForProject?.items ||
								[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
							}
						>
							<Table
								data={
									// listContractForProject?.items ||
									[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
								}
								column={[
									{
										title: 'STT',
										render: (data: IContractsForProject, index: number) => <>{index + 1}</>,
									},
									{
										title: 'Tên hợp đồng',
										fixedLeft: true,
										render: (data: IContractsForProject) => (
											// <Tippy content='Chi tiết hợp đồng'>
											// 	<Link href={`${PATH.ProjectContract}/${data?.uuid}`} className={styles.link}>
											// 		{data?.code || '---'}
											// 	</Link>
											// </Tippy>
											<>Hợp đồng M2WABC2</>
										),
									},
									{
										title: 'Tên nhóm nhà thầu',
										render: (data: IContractsForProject) => (
											<>
												{/* <Tippy
												content={
													<ol style={{paddingLeft: '16px'}}>
														{[...new Set(data?.contractorInfos?.map((v) => v.contractorCatName))].map(
															(catName, i) => (
																<li key={i}>{catName}</li>
															)
														)}
													</ol>
												}
											>
												<p className={styles.name}>
													{data?.contractorInfos?.map((v) => v?.contractorCatName).join(', ')}
												</p>
											</Tippy> */}
												Nhà thầu số 3
											</>
										),
									},
									{
										title: 'Tên nhà thầu',
										render: (data: IContractsForProject) => (
											<>
												{/* <Tippy
												content={
													<ol style={{paddingLeft: '16px'}}>
														{[...new Set(data?.contractorInfos?.map((v) => v.contractorName))].map(
															(catName, i) => (
																<li key={i}>{catName}</li>
															)
														)}
													</ol>
												}
											>
												<p className={styles.name}>
													{data?.contractorInfos?.map((v) => v?.contractorName).join(', ')}
												</p>
											</Tippy> */}
												Nhà thầu thiết kế
											</>
										),
									},
									{
										title: 'Giá trị đề nghị thanh toán (VND)',
										render: (data: IContractsForProject) => <>{convertCoin(500000000)}</>,
									},
									{
										title: 'Loại thanh toán',
										render: (data: IContractsForProject) => <>{'Tạm ứng'}</>,
									},
									{
										title: 'Ghi chú',
										render: (data: IContractsForProject) => (
											<>
												{/* {(data?.note && (
												<Tippy content={data?.note}>
													<p className={styles.note}>{data?.note || '---'}</p>
												</Tippy>
											)) ||
												'---'} */}
												<Tippy
													content={
														'Hợp đồng M2WABC2Hợp đồng M2WABC2Hợp đồng M2WABC2Hợp đồng M2WABC2Hợp đồng M2WABC2Hợp đồng M2WABC2Hợp đồng M2WABC2Hợp đồng M2WABC2'
													}
												>
													<p className={styles.note}>
														Hợp đồng M2WABC2Hợp đồng M2WABC2Hợp đồng M2WABC2Hợp đồng M2WABC2Hợp đồng M2WABC2Hợp
														đồng M2WABC2Hợp đồng M2WABC2Hợp đồng M2WABC2
													</p>
												</Tippy>
											</>
										),
									},
								]}
							/>
						</DataWrapper>
						<Pagination
							currentPage={
								// Number(_page) ||
								1
							}
							pageSize={
								// Number(_pageSize) ||
								10
							}
							total={
								// listContractForProject?.pagination?.totalCount ||
								10
							}
							dependencies={[_uuid, _pageSize, _keyword, _contractorUuid, _contractorCat]}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default MainPageDetailCSCT;
