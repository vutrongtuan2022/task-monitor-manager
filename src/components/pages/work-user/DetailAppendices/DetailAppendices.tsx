import React from 'react';

import {IDetailContract, PropsDetailAppendices} from './interfaces';
import styles from './DetailAddenum.module.scss';
import Breadcrumb from '~/components/common/Breadcrumb';
import {PATH} from '~/constants/config';
import GridColumn from '~/components/layouts/GridColumn';
import {useRouter} from 'next/router';
import {useQuery} from '@tanstack/react-query';
import {QUERY_KEY, STATE_CONTRACT_WORK} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import contractsServices from '~/services/contractsServices';
import {convertCoin} from '~/common/funcs/convertCoin';
import Progress from '~/components/common/Progress';
import Moment from 'react-moment';
import clsx from 'clsx';
import StateActive from '~/components/common/StateActive';
import Tippy from '@tippyjs/react';
import TabNavLink from '~/components/common/TabNavLink';
import TableContractFund from './components/TableContractFund';
import TableContractors from './components/TableContractors';

function DetailAppendices({}: PropsDetailAppendices) {
	const router = useRouter();

	const {_uuid, _uuidWork, _type} = router.query;

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

	return (
		<div className={styles.container}>
			<Breadcrumb
				listUrls={[
					{
						path: PATH.WorkUser,
						title: 'Danh sách công việc cần làm',
					},
					{
						path: `${PATH.WorkUser}/${_uuidWork}?_type=appendices`,
						title: 'Chi tiết công việc',
					},
					{
						path: '',
						title: 'Chi tiết phụ lục hợp đồng',
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
								<p>Số phụ lục hợp đồng</p>
								<p>{detailContract?.code || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Thuộc hợp đồng</p>
								<p>{detailContract?.parent?.code || '---'}</p>
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
								<p>Tên nhóm nhà thầu</p>
								<p>{detailContract?.contractorInfos?.map((v) => v?.contractorCatName).join(', ')}</p>
							</div>
							<div className={styles.item}>
								<p>Tên nhà thầu</p>
								<p> {detailContract?.contractorInfos?.map((v) => v?.contractorName).join(', ')}</p>
							</div>
							<div className={styles.item}>
								<p>Ngày ký phụ lục hợp đồng</p>
								<p>{detailContract?.startDate ? <Moment date={detailContract?.startDate} format='DD/MM/YYYY' /> : '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Giá trị phụ lục hợp đồng</p>
								<p>{convertCoin(detailContract?.amount!) || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Thời gian gia hạn hợp đồng (ngày)</p>
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
								<p>Người tạo phụ lục hợp đồng</p>
								<p>{detailContract?.creator?.fullname || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Thời gian tạo</p>
								<p>{detailContract?.created ? <Moment date={detailContract?.created} format='DD/MM/YYYY' /> : '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Ngày kết thúc phụ lục hợp đồng</p>
								<p>{detailContract?.created ? <Moment date={detailContract?.endDate} format='DD/MM/YYYY' /> : '---'}</p>
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
									pathname: PATH.ProjectCreate,
									query: null,
									title: 'Danh sách giải ngân',
								},
								{
									pathname: PATH.ProjectCreate,
									query: 'contractor',
									title: 'Danh sách nhà thầu',
								},
							]}
							listKeyRemove={['_page', '_pageSize', '_keyword', '_state']}
						/>
					</div>
					<div className={styles.line}></div>
					<div className={styles.main_table}>
						{!_type && <TableContractFund />}
						{_type == 'contractor' && <TableContractors />}
					</div>
				</div>
			</div>
		</div>
	);
}

export default DetailAppendices;
