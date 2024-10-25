import React, {useState} from 'react';

import {IProject, PropsMainPageProject} from './interfaces';
import styles from './MainPageProject.module.scss';
import Search from '~/components/common/Search';
import Button from '~/components/common/Button';
import icons from '~/constants/images/icons';
import Image from 'next/image';
import Table from '~/components/common/Table';
import Pagination from '~/components/common/Pagination';
import WrapperScrollbar from '~/components/layouts/WrapperScrollbar';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import {useRouter} from 'next/router';
import StateActive from '~/components/common/StateActive';
import IconCustom from '~/components/common/IconCustom';
import {Edit, Trash} from 'iconsax-react';
import Progress from '~/components/common/Progress';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {QUERY_KEY, STATUS_CONFIG, STATE_PROJECT} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import FilterCustom from '~/components/common/FilterCustom';
import Loading from '~/components/common/Loading';
import Dialog from '~/components/common/Dialog';
import {PATH} from '~/constants/config';
import Link from 'next/link';
import Tippy from '@tippyjs/react';
import {convertCoin} from '~/common/funcs/convertCoin';
import projectServices from '~/services/projectServices';

function MainPageProject({}: PropsMainPageProject) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const [deleteProject, setDeleteProject] = useState<IProject | null>(null);

	const {_page, _pageSize, _keyword, _status, _managerUuid, _state} = router.query;

	const listProject = useQuery([QUERY_KEY.table_list_user, _page, _pageSize, _state, _keyword, _status, _managerUuid], {
		queryFn: () =>
			httpRequest({
				http: projectServices.listProject({
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 20,
					keyword: (_keyword as string) || '',
					status: STATUS_CONFIG.ACTIVE,
					state: !!_state ? Number(_state) : null,
					managerUuid: (_managerUuid as string) || '',
				}),
			}),
		select(data) {
			return data;
		},
	});

	const funcDeleteProject = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Xóa dự án thành công',
				http: projectServices.updateStatus({
					uuid: deleteProject?.uuid!,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setDeleteProject(null);
				queryClient.invalidateQueries([QUERY_KEY.table_list_user]);
			}
		},
	});

	return (
		<div className={styles.container}>
			<Loading loading={funcDeleteProject.isLoading} />
			<div className={styles.head}>
				<div className={styles.main_search}>
					<div className={styles.search}>
						<Search keyName='_keyword' placeholder='Tìm kiếm theo tên dự án, ID' />
					</div>

					<div className={styles.filter}>
						<FilterCustom
							isSearch
							name='Trạng thái'
							query='_state'
							listFilter={[
								{
									id: STATE_PROJECT.PREPARE,
									name: 'Chuẩn bị',
								},
								{
									id: STATE_PROJECT.DO,
									name: 'Thực hiện',
								},
								{
									id: STATE_PROJECT.FINISH,
									name: 'Kết thúc',
								},
							]}
						/>
					</div>
				</div>
				<div className={styles.btn}>
					<Button
						p_10_24
						rounded_8
						light-blue
						href={PATH.ProjectCreate}
						icon={<Image alt='icon add' src={icons.iconAdd} width={20} height={20} />}
					>
						Thêm mới dự án
					</Button>
				</div>
			</div>
			<WrapperScrollbar>
				<DataWrapper
					data={listProject?.data?.items || []}
					loading={listProject.isLoading}
					noti={
						<Noti
							button={
								<Button
									p_10_24
									rounded_8
									light-blue
									href={PATH.ProjectCreate}
									icon={<Image alt='icon add' src={icons.iconAdd} width={20} height={20} />}
								>
									Thêm mới dự án
								</Button>
							}
						/>
					}
				>
					<Table
						fixedHeader={true}
						data={listProject?.data?.items || []}
						column={[
							{
								title: 'STT',
								render: (data: IProject, index: number) => <>{index + 1}</>,
							},
							{
								title: 'ID dự án',
								fixedLeft: true,
								render: (data: IProject) => (
									<Tippy content='Chi tiết dự án'>
										<Link href={`${PATH.ProjectInfo}?_uuid=${data?.uuid}`} className={styles.link}>
											{data?.code}
										</Link>
									</Tippy>
								),
							},
							{
								title: 'Tên công trình',
								render: (data: IProject) => <>{data?.name}</>,
							},
							{
								title: 'Quy trình áp dụng',
								render: (data: IProject) => <>{data?.taskCat?.name}</>,
							},
							{
								title: 'Lãnh đạo phụ trách',
								render: (data: IProject) => <>{data?.manager?.fullname}</>,
							},
							{
								title: 'Cán bộ chuyên quản',
								render: (data: IProject) => <>{data?.user?.fullname}</>,
							},
							{
								title: 'TMĐT(VND)',
								render: (data: IProject) => <>{convertCoin(data?.totalInvest)}</>,
							},
							{
								title: 'Tiến độ dự án',
								render: (data: IProject) => <Progress percent={data?.progress} width={80} />,
							},
							{
								title: 'Trạng thái',
								render: (data: IProject) => (
									<StateActive
										stateActive={data?.state}
										listState={[
											{
												state: STATE_PROJECT.PREPARE,
												text: 'Chuẩn bị',
												textColor: '#fff',
												backgroundColor: '#5B70B3',
											},
											{
												state: STATE_PROJECT.DO,
												text: 'Thực hiện',
												textColor: '#fff',
												backgroundColor: '#16C1F3',
											},
											{
												state: STATE_PROJECT.FINISH,
												text: 'Kết thúc',
												textColor: '#fff',
												backgroundColor: '#06D7A0',
											},
										]}
									/>
								),
							},
							{
								title: 'Hành động',
								fixedRight: true,
								render: (data: IProject) => (
									<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
										<IconCustom
											type='edit'
											icon={<Edit fontSize={20} fontWeight={600} />}
											tooltip='Chỉnh sửa'
											disnable={data?.state == STATE_PROJECT.FINISH}
											href={`${PATH.UpdateInfoProject}?_uuid=${data?.uuid}`}
										/>
										<IconCustom
											type='delete'
											icon={<Trash fontSize={20} fontWeight={600} />}
											tooltip='Xóa bỏ'
											disnable={data?.state == STATE_PROJECT.DO || data?.state == STATE_PROJECT.FINISH}
											onClick={() => {
												setDeleteProject(data);
											}}
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
					total={listProject?.data?.pagination?.totalCount}
					dependencies={[_pageSize, _keyword, _status, _managerUuid, _state]}
				/>
			</WrapperScrollbar>
			<Dialog
				type='error'
				open={!!deleteProject}
				onClose={() => setDeleteProject(null)}
				title={'Xác nhận xóa'}
				note={'Bạn có chắc chắn muốn xóa dự án này?'}
				onSubmit={funcDeleteProject.mutate}
			/>
		</div>
	);
}

export default MainPageProject;
