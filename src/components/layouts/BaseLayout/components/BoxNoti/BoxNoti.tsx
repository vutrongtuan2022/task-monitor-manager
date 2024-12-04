import React, {Fragment, useEffect} from 'react';

import {INotify, PropsBoxNoti} from './interfaces';
import styles from './BoxNoti.module.scss';
import Moment from 'react-moment';
import clsx from 'clsx';
import {useInfiniteQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {QUERY_KEY, STATE_NOTIFY, TYPE_NOTIFY} from '~/constants/config/enum';
import notifyServices from '~/services/notifyServices';
import {httpRequest} from '~/services';
import Noti from '~/components/common/DataWrapper/components/Noti';
import WrapperLoadMore from '~/components/common/WrapperLoadMore';
import {useRouter} from 'next/router';
import {PATH} from '~/constants/config';

function BoxNoti({countUnSeenNoti, onClose}: PropsBoxNoti) {
	const queryClient = useQueryClient();

	const {data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch} = useInfiniteQuery(
		[QUERY_KEY.list_notify],
		async ({pageParam = 1}) => {
			const notis: any = await httpRequest({
				http: notifyServices.getListNotify({
					page: pageParam,
					pageSize: 10,
				}),
			});

			return {
				items: notis?.items || [],
				total: notis?.pagination.totalCount || 0,
			};
		},
		{
			getNextPageParam: (lastPage: any, pages) => {
				if (pages.length < Math.ceil(lastPage.total / 20)) {
					return pages.length + 1;
				}
				return undefined;
			},
		}
	);

	useEffect(() => {
		const interval = setInterval(() => {
			queryClient.invalidateQueries([QUERY_KEY.list_notify]);
			queryClient.invalidateQueries([QUERY_KEY.count_unseen_noti]);
		}, 60000);

		return () => clearInterval(interval);
	}, [refetch]);

	const readAllNoti = useMutation({
		mutationFn: () =>
			httpRequest({
				http: notifyServices.updateStateAllNotify({}),
			}),
		onSuccess(data) {
			if (data) {
				queryClient.invalidateQueries([QUERY_KEY.list_notify]);
				queryClient.invalidateQueries([QUERY_KEY.count_unseen_noti]);
			}
		},
	});

	const handleSeenAllNoti = () => {
		readAllNoti.mutate();
	};

	return (
		<div className={styles.container}>
			<div className={styles.head}>
				<h4>
					Thông báo chưa đọc <span>({countUnSeenNoti})</span>
				</h4>
				<p className={styles.readAll} onClick={handleSeenAllNoti}>
					Đọc tất cả
				</p>
			</div>

			{data?.pages[0]?.items?.length == 0 ? (
				<div className={styles.empty}>
					<Noti title='Thông báo' des='Chưa có thông báo nào!' />
				</div>
			) : (
				<WrapperLoadMore
					fetchNextPage={fetchNextPage}
					isFetchingNextPage={isFetchingNextPage}
					hasNextPage={hasNextPage}
					className={styles.main}
				>
					{data?.pages.map((group: any, i: any) => (
						<Fragment key={i}>
							{group.items.map((v: any) => (
								<ItemNoti key={v?.uuid} noti={v} onClose={onClose} />
							))}
						</Fragment>
					))}
				</WrapperLoadMore>
			)}
		</div>
	);
}

export default BoxNoti;

function ItemNoti({noti, onClose}: {noti: INotify; onClose: () => void}) {
	const router = useRouter();

	const queryClient = useQueryClient();

	const readOneNoti = useMutation({
		mutationFn: () =>
			httpRequest({
				http: notifyServices.updateStateNotify({
					uuid: noti.uuid,
				}),
			}),
		onSuccess(data) {
			if (data) {
				queryClient.invalidateQueries([QUERY_KEY.list_notify]);
				queryClient.invalidateQueries([QUERY_KEY.count_unseen_noti]);
			}
		},
	});

	const handleRedirectNoti = () => {
		readOneNoti.mutate();
		onClose();

		if (noti.type == TYPE_NOTIFY.PROJECT) {
			router.push(`${PATH.ProjectInfo}?_uuid=${noti?.data?.projectUuid}`);
		}
		if (noti.type == TYPE_NOTIFY.REPORT) {
			router.push(`${PATH.ReportWork}/${noti?.data?.reportUuid}`);
		}
		if (noti.type == TYPE_NOTIFY.CONTRACT) {
			router.push(`${PATH.ContractReportDisbursement}/${noti?.data?.contractUuid}`);
		}
		if (noti.type == TYPE_NOTIFY.OVERVIEW) {
			router.push(`${PATH.ReportOverview}/${noti?.data?.overviewUuid}`);
		}
		if (noti.type == TYPE_NOTIFY.CONTRACT_FUND) {
			router.push(`${PATH.ReportDisbursement}/${noti?.data?.contractFundUuid}`);
		}
	};

	return (
		<div className={clsx(styles.item, {[styles.notRead]: noti?.state == STATE_NOTIFY.NOT_READ})} onClick={handleRedirectNoti}>
			<div dangerouslySetInnerHTML={{__html: noti?.content}} className={styles.text}></div>
			<p className={styles.time}>
				<Moment fromNow date={noti?.created} locale='vi' />
			</p>
		</div>
	);
}
