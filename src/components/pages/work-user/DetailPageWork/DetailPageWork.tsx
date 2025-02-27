import React from 'react';
import styles from './DetailPageWork.module.scss';
import {IDetailActivityContract, PropsDetailPageWork} from './interface';
import Breadcrumb from '~/components/common/Breadcrumb';
import {PATH} from '~/constants/config';
import {QUERY_KEY} from '~/constants/config/enum';
import GridColumn from '~/components/layouts/GridColumn';
import {clsx} from 'clsx';
import {useRouter} from 'next/router';
import {useQuery} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import activityServices from '~/services/activityServices';
import TabNavLink from '~/components/common/TabNavLink';
import TableContractHistory from './components/TableContractHistory';
import TableContractAppendices from './components/TableContractAppendices';

function DetailPageWork({}: PropsDetailPageWork) {
	const router = useRouter();

	const {_page, _pageSize, _uuid, _type} = router.query;

	const {data: detailActivityContract} = useQuery<IDetailActivityContract>([QUERY_KEY.detail_activity_contract, _uuid], {
		queryFn: () =>
			httpRequest({
				http: activityServices.getDetailActivityContract({
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
						path: '',
						title: 'Chi tiết công việc',
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
								<p>Tên công trình</p>
								<p>{detailActivityContract?.project?.name || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Tên công việc</p>
								<p>{detailActivityContract?.name || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Chi nhánh</p>
								<p>
									<span>{detailActivityContract?.project?.branch?.code || '---'}</span> -
									<span style={{marginLeft: '4px'}}>{detailActivityContract?.project?.branch?.name || '---'}</span>
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
									pathname: PATH.ProjectCreate,
									query: null,
									title: 'Lịch sử hợp đồng chính',
								},
								{
									pathname: PATH.ProjectCreate,
									query: 'appendices',
									title: 'Danh sách phụ lục hợp đồng',
								},
							]}
							listKeyRemove={['_page', '_pageSize', '_keyword', '_state']}
						/>
					</div>
					<div className={styles.line}></div>
					<div className={styles.main_table}>
						{!_type && <TableContractHistory />}
						{_type == 'appendices' && <TableContractAppendices />}
					</div>
				</div>
			</div>
		</div>
	);
}

export default DetailPageWork;
