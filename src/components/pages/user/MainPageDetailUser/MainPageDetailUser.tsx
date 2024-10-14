import React from 'react';

import {IDetailUser, PropsMainPageDetailUser} from './interfaces';
import styles from './MainPageDetailUser.module.scss';
import Breadcrumb from '~/components/common/Breadcrumb';
import {PATH} from '~/constants/config';
import Button from '~/components/common/Button';
import GridColumn from '~/components/layouts/GridColumn';
import {QUERY_KEY, STATE_REPORT_DISBURSEMENT, STATUS_ACCOUNT, TYPE_GENDER} from '~/constants/config/enum';
import StateActive from '~/components/common/StateActive';
import {useRouter} from 'next/router';
import {useQuery} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import {convertCoin} from '~/common/funcs/convertCoin';
import Progress from '~/components/common/Progress';
import Moment from 'react-moment';
import userServices from '~/services/userServices';

function MainPageDetailUser({}: PropsMainPageDetailUser) {
	const router = useRouter();

	const {_uuid} = router.query;

	const {data: detailUser} = useQuery<IDetailUser>([QUERY_KEY.detail_user, _uuid], {
		queryFn: () =>
			httpRequest({
				http: userServices.detailUser({
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
						path: PATH.User,
						title: 'Quản lý nhân viên',
					},
					{
						path: '',
						title: 'Chi tiết nhân viên',
					},
				]}
				action={
					<div className={styles.group_btn}>
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
						<h4>Thông tin nhân viên</h4>
					</div>
					<div className={styles.form}>
						<GridColumn col_3>
							<div className={styles.item}>
								<p>Họ và tên</p>
								<p>{detailUser?.fullname || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Mã nhân viên</p>
								<p style={{color: '#2970FF'}}>{detailUser?.code || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Tình trạng</p>
								<p>
									{detailUser?.isHaveAcc == STATUS_ACCOUNT.HAVE && 'Đã cấp tài khoản'}
									{detailUser?.isHaveAcc == STATUS_ACCOUNT.NOT_HAVE && 'Chưa cấp tài khoản'}
								</p>
							</div>
							<div className={styles.item}>
								<p>Số điện thoại</p>
								<p>{detailUser?.phone || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Email</p>
								<p>{detailUser?.email || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Giới tính</p>
								<p>
									{detailUser?.gender == TYPE_GENDER.FEMALE && 'Nữ'}
									{detailUser?.gender == TYPE_GENDER.MALE && 'Nam'}
									{detailUser?.gender == TYPE_GENDER.OTHER && 'Khác'}
								</p>
							</div>
							<div className={styles.item}>
								<p>Ngày sinh</p>
								<p>{detailUser?.birthday ? <Moment date={detailUser?.birthday} format='DD/MM/YYYY' /> : '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Địa chỉ chi tiết</p>
								<p>{detailUser?.address || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Mô tả</p>
								<p>{detailUser?.note || '---'}</p>
							</div>
						</GridColumn>
					</div>
				</div>
			</div>
		</div>
	);
}

export default MainPageDetailUser;
