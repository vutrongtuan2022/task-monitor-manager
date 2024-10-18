import React from 'react';

import {IDetailLogin, PropsMainPageProfile} from './interfaces';
import styles from './MainPageProfile.module.scss';
import GridColumn from '~/components/layouts/GridColumn';
import Button from '~/components/common/Button';
import Breadcrumb from '~/components/common/Breadcrumb';
import Loading from '~/components/common/Loading';
import clsx from 'clsx';
import {useSelector} from 'react-redux';
import {useRouter} from 'next/router';
import {RootState} from '~/redux/store';
import {PATH} from '~/constants/config';
import {useQuery} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import userServices from '~/services/userServices';
import {QUERY_KEY, TYPE_ACCOUNT, TYPE_GENDER} from '~/constants/config/enum';
import StateActive from '~/components/common/StateActive';
import accountServices from '~/services/accountServices';
import PositionContainer from '~/components/common/PositionContainer';
import UpdateUser from '../UpdateUser';
import Moment from 'react-moment';
import Popup from '~/components/common/Popup';
import FormChangePassword from '../FormChangePassword';

function MainPageProfile({}: PropsMainPageProfile) {
	const router = useRouter();

	const {_action} = router.query;

	const {data: detaillUser} = useQuery<IDetailLogin>([QUERY_KEY.detail_profile], {
		queryFn: () =>
			httpRequest({
				http: accountServices.getInfor({}),
			}),
		select(data) {
			return data;
		},
	});

	const handleOpenChangePassword = () => {
		router.replace(
			{
				pathname: router.pathname,
				query: {
					...router.query,
					_action: 'change-password',
				},
			},
			undefined,
			{shallow: true, scroll: false}
		);
	};

	const handleClosePopup = () => {
		const {_action, ...rest} = router.query;

		router.replace(
			{
				pathname: router.pathname,
				query: {
					...rest,
				},
			},
			undefined,
			{shallow: true, scroll: false}
		);
	};

	return (
		<div className={styles.container}>
			{/* <Loading loading={funcDeleteTaskCat.isLoading} /> */}
			<Breadcrumb
				listUrls={[
					{path: PATH.Home, title: 'Trang chủ'},
					{path: '', title: 'Thông tin cá nhân'},
				]}
				action={
					<div className={styles.group_btn}>
						<Button p_14_24 rounded_8 light-blue onClick={handleOpenChangePassword}>
							Đổi mật khẩu
						</Button>
						<Button
							p_14_24
							rounded_8
							blueRedLinear
							onClick={() => {
								router.replace({
									pathname: router.pathname,
									query: {
										...router.query,
										_action: 'update',
									},
								});
							}}
						>
							Chỉnh sửa
						</Button>
					</div>
				}
			/>

			<div className={styles.basic_info}>
				<div className={styles.head}>
					<h4>Thông tin cá nhân</h4>
				</div>
				<div className={styles.progress_group}>
					<GridColumn col_2>
						<div className={styles.item}>
							<p>Tên đăng nhập</p>
							<p>{detaillUser?.userName || '---'}</p>
						</div>
						<div className={styles.item}>
							<p>Nhóm quyền</p>
							<p>
								<StateActive
									stateActive={
										detaillUser?.role?.code === 'R1'
											? TYPE_ACCOUNT.USER
											: detaillUser?.role?.code === 'R2'
											? TYPE_ACCOUNT.MANAGER
											: TYPE_ACCOUNT.ADMIN
									}
									listState={[
										{
											state: TYPE_ACCOUNT.ADMIN,
											text: 'ADMIN',
											textColor: '#fff',
											backgroundColor: '#06D7A0',
										},
										{
											state: TYPE_ACCOUNT.MANAGER,
											text: 'MANAGER',
											textColor: '#fff',
											backgroundColor: '#FDAD73',
										},
										{
											state: TYPE_ACCOUNT.USER,
											text: 'USER',
											textColor: '#fff',
											backgroundColor: '#6CD1F2',
										},
									]}
								/>
							</p>
						</div>
						{/* <div className={styles.item}>
							<p>Ngày tạo</p>
							<p>
								<Moment date={detailTask?.created} format='DD/MM/YYYY' />
							</p>
						</div> */}
					</GridColumn>
				</div>
			</div>

			<div className={clsx(styles.basic_info, styles.mt)}>
				<div className={styles.head}>
					<h4>Thông tin cá nhân</h4>
				</div>
				<div className={styles.progress_group}>
					<GridColumn col_3>
						<div className={styles.item}>
							<p>Họ tên</p>
							<p>{detaillUser?.user?.fullname || '---'}</p>
						</div>
						<div className={styles.item}>
							<p>Số điện thoại</p>
							<p>{detaillUser?.user?.phone || '---'}</p>
						</div>
						<div className={styles.item}>
							<p>Email</p>
							<p>{detaillUser?.user?.email || '---'}</p>
						</div>
						<div className={styles.item}>
							<p>Ngày sinh</p>
							<p>
								<Moment date={detaillUser?.user?.birthday} format='DD/MM/YYYY' />
							</p>
						</div>
						<div className={styles.item}>
							<p>Giới tính</p>
							<p>{detaillUser?.user?.gender == TYPE_GENDER.MALE ? 'Nam' : 'Nữ'}</p>
						</div>
					</GridColumn>
					<div className={styles.mt}>
						<GridColumn col_3>
							<div className={styles.item}>
								<p>Tỉnh/thành phố</p>
								<p>{detaillUser?.user?.tp?.name || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Quận/ Huyện</p>
								<p>{detaillUser?.user?.qh?.name || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Thị trấn/ Xã</p>
								<p>{detaillUser?.user?.xa?.name || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Địa chỉ chi tiết</p>
								<p>{detaillUser?.user?.address || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Mô tả</p>
								<p>{detaillUser?.user?.note || '---'}</p>
							</div>
						</GridColumn>
					</div>
				</div>
			</div>
			<PositionContainer
				open={_action == 'update'}
				onClose={() => {
					const {_action, ...rest} = router.query;

					router.replace({
						pathname: router.pathname,
						query: {
							...rest,
						},
					});
				}}
			>
				<UpdateUser
					onClose={() => {
						const {_action, ...rest} = router.query;

						router.replace({
							pathname: router.pathname,
							query: {
								...rest,
							},
						});
					}}
				/>
			</PositionContainer>
			<Popup open={_action == 'change-password'} onClose={handleClosePopup}>
				<FormChangePassword onClose={handleClosePopup} />
			</Popup>
		</div>
	);
}

export default MainPageProfile;
