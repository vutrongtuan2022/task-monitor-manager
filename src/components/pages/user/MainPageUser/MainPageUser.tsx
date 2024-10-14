import React, {Fragment} from 'react';

import {IUser, PropsMainPageUser} from './interfaces';
import styles from './MainPageUser.module.scss';
import DataWrapper from '~/components/common/DataWrapper';
import WrapperScrollbar from '~/components/layouts/WrapperScrollbar';
import Pagination from '~/components/common/Pagination';
import Table from '~/components/common/Table';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Search from '~/components/common/Search';
import {useRouter} from 'next/router';
import {useQuery} from '@tanstack/react-query';
import StateActive from '~/components/common/StateActive';
import {STATUS_ACCOUNT, QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import userServices from '~/services/userServices';
import FilterCustom from '~/components/common/FilterCustom';
import Link from 'next/link';
import {PATH} from '~/constants/config';
import Tippy from '@tippyjs/react';
import IconCustom from '~/components/common/IconCustom';
import {Eye} from 'iconsax-react';

function MainPageUser({}: PropsMainPageUser) {
	const router = useRouter();

	const {_page, _pageSize, _keyword, _isHaveAcc} = router.query;

	const listUser = useQuery([QUERY_KEY.table_list_user, _page, _pageSize, _keyword, _isHaveAcc], {
		queryFn: () =>
			httpRequest({
				http: userServices.listUser({
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 20,
					keyword: (_keyword as string) || '',
					status: 1,
					isHaveAcc: !!_isHaveAcc ? Number(_isHaveAcc) : null,
				}),
			}),
		select(data) {
			return data;
		},
	});

	return (
		<Fragment>
			<div className={styles.container}>
				<div className={styles.head}>
					<div className={styles.main_search}>
						<div className={styles.search}>
							<Search keyName='_keyword' placeholder='Tìm kiếm theo tên nhân viên, ID' />
						</div>

						<div className={styles.filter}>
							<FilterCustom
								isSearch
								name='Tình trạng'
								query='_isHaveAcc'
								listFilter={[
									{
										id: STATUS_ACCOUNT.HAVE,
										name: 'Đã cấp tài khoản',
									},
									{
										id: STATUS_ACCOUNT.NOT_HAVE,
										name: 'Chưa cấp tài khoản',
									},
								]}
							/>
						</div>
					</div>
				</div>
				<WrapperScrollbar>
					<DataWrapper
						data={listUser?.data?.items || []}
						loading={listUser.isLoading}
						noti={<Noti title='Danh sách trống!' des='Danh sách nhân viên trống!' />}
					>
						<Table
							fixedHeader={true}
							data={listUser?.data?.items || []}
							column={[
								{
									title: 'STT',
									render: (data: IUser, index: number) => <>{index + 1}</>,
								},
								{
									title: 'Mã nhân viên',
									render: (data: IUser) => <p style={{fontWeight: 600}}>{data?.code || '---'}</p>,
								},
								{
									title: 'Họ tên',
									fixedLeft: true,
									render: (data: IUser) => (
										<Tippy content='Xem chi tiết'>
											<Link href={`${PATH.User}/${data?.uuid}`} className={styles.link}>
												{data?.fullname || '---'}
											</Link>
										</Tippy>
									),
								},
								{
									title: 'Số điện thoại',
									render: (data: IUser) => <>{data?.phone || '---'}</>,
								},
								{
									title: 'Email',
									render: (data: IUser) => <span>{data?.email || '---'}</span>,
								},
								{
									title: 'Tình trạng tài khoản',
									render: (data: IUser) => (
										<StateActive
											stateActive={data?.isHaveAcc}
											listState={[
												{
													state: STATUS_ACCOUNT.HAVE,
													text: 'Đã cấp tài khoản',
													textColor: '#fff',
													backgroundColor: '#06D7A0',
												},
												{
													state: STATUS_ACCOUNT.NOT_HAVE,
													text: 'Chưa cấp tài khoản',
													textColor: '#fff',
													backgroundColor: '#F37277',
												},
											]}
										/>
									),
								},
								{
									title: 'Hành động',
									fixedRight: true,
									render: (data: IUser) => (
										<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
											<IconCustom
												color='#005994'
												icon={<Eye fontSize={20} fontWeight={600} />}
												tooltip='Xem chi tiết'
												href={`${PATH.User}/${data?.uuid}`}
											/>
										</div>
									),
								},
							]}
						/>
					</DataWrapper>
					<Pagination
						currentPage={Number(_page) || 1}
						pageSize={Number(_pageSize) || 20}
						total={listUser?.data?.pagination?.totalCount}
						dependencies={[_pageSize, _keyword, _isHaveAcc]}
					/>
				</WrapperScrollbar>
			</div>
		</Fragment>
	);
}

export default MainPageUser;
