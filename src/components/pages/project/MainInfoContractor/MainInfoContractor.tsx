import React, {useState} from 'react';

import {IContractorProject, PropsMainInfoContractor} from './interfaces';
import styles from './MainInfoContractor.module.scss';
import LayoutPages from '~/components/layouts/LayoutPages';
import {PATH} from '~/constants/config';
import {useRouter} from 'next/router';
import Button from '~/components/common/Button';
import DataWrapper from '~/components/common/DataWrapper';
import Pagination from '~/components/common/Pagination';
import Table from '~/components/common/Table';
import Search from '~/components/common/Search';
import clsx from 'clsx';
import Image from 'next/image';
import icons from '~/constants/images/icons';
import IconCustom from '~/components/common/IconCustom';
import {Edit, Trash} from 'iconsax-react';
import Breadcrumb from '~/components/common/Breadcrumb';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import {QUERY_KEY, STATE_PROJECT, STATUS_CONFIG} from '~/constants/config/enum';
import {IDetailInfoProject} from '../MainInfoProject/interfaces';
import Dialog from '~/components/common/Dialog';
import {convertCoin} from '~/common/funcs/convertCoin';
import Moment from 'react-moment';
import Loading from '~/components/common/Loading';
import FormAddContractor from '../FormAddContractor';
import FormUpdateContractor from '../FormUpdateContractor';
import projectServices from '~/services/projectServices';
import projectContractorServices from '~/services/projectContractorServices';
import PositionContainer from '~/components/common/PositionContainer';

function MainInfoContractor({}: PropsMainInfoContractor) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_uuid, _keyword, _page, _pageSize, _action, _projectContractorUuid} = router.query;

	const [openDelete, setOpenDelete] = useState<boolean>(false);
	const [openStart, setOpenStart] = useState<boolean>(false);
	const [openFinish, setOpenFinish] = useState<boolean>(false);
	const [openReStart, setOpenReStart] = useState<boolean>(false);
	const [uuidDeleteContractor, setUuidDeleteContractor] = useState<string>('');

	const {data: detailProject} = useQuery<IDetailInfoProject>([QUERY_KEY.detail_contractor_project, _uuid], {
		queryFn: () =>
			httpRequest({
				http: projectServices.detailInfoProject({
					uuid: _uuid as string,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!_uuid,
	});

	const {data: listContractorProject, isLoading} = useQuery(
		[QUERY_KEY.table_list_contractor_project, _uuid, _keyword, _page, _pageSize],
		{
			queryFn: () =>
				httpRequest({
					http: projectContractorServices.listContractorProject({
						uuid: _uuid as string,
						keyword: (_keyword as string) || '',
						page: Number(_page) || 1,
						pageSize: Number(_pageSize) || 20,
						status: STATUS_CONFIG.ACTIVE,
					}),
				}),
			select(data) {
				return data;
			},
			enabled: !!_uuid,
		}
	);

	const funcDeleteProject = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Xóa dự án thành công',
				http: projectServices.updateStatus({
					uuid: _uuid as string,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setOpenDelete(false);
				router.replace(`${PATH.Project}`, undefined, {
					scroll: false,
					shallow: false,
				});
			}
		},
	});

	const funcStartProject = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Dự án được bắt đầu thực hiện!',
				http: projectServices.updateState({
					uuid: _uuid as string,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setOpenStart(false);
				queryClient.invalidateQueries([QUERY_KEY.detail_contractor_project]);
			}
		},
	});

	const funcFinishProject = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Kết thúc dự án thành công!',
				http: projectServices.updateState({
					uuid: _uuid as string,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setOpenFinish(false);
				queryClient.invalidateQueries([QUERY_KEY.detail_contractor_project]);
			}
		},
	});

	const funcDeleteContractorProject = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Xóa nhà thầu thành công!',
				http: projectContractorServices.deleteContractorProject({
					uuid: uuidDeleteContractor!,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setUuidDeleteContractor('');
				queryClient.invalidateQueries([QUERY_KEY.table_list_contractor_project]);
			}
		},
	});

	const funcReStartProject = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Tái hoạt động dự án thành công!',
				http: projectServices.updateState({
					uuid: _uuid as string,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setOpenReStart(false);
				queryClient.invalidateQueries([QUERY_KEY.detail_contractor_project]);
			}
		},
	});

	return (
		<div className={styles.container}>
			<Loading
				loading={
					funcDeleteContractorProject.isLoading ||
					funcDeleteProject.isLoading ||
					funcStartProject.isLoading ||
					funcFinishProject.isLoading ||
					funcReStartProject.isLoading
				}
			/>
			<Breadcrumb
				listUrls={[
					{
						path: PATH.Project,
						title: 'Danh sách dự án',
					},
					{
						path: '',
						title: 'Chi tiết dự án',
					},
				]}
			/>
			<LayoutPages
				listPages={[
					{
						title: 'Thông tin chung',
						path: `${PATH.ProjectInfo}?_uuid=${_uuid}`,
					},
					{
						title: 'Báo cáo công việc',
						path: `${PATH.ProjectWorkReport}?_uuid=${_uuid}`,
					},
					{
						title: 'Tiến độ giải ngân',
						path: `${PATH.ProjectDisbursementProgress}?_uuid=${_uuid}`,
					},
					{
						title: 'Thông tin nhà thầu',
						path: `${PATH.ProjectContractor}?_uuid=${_uuid}`,
					},
				]}
				action={
					<div className={styles.group_btn}>
						{detailProject?.state == STATE_PROJECT.PREPARE && (
							<Button p_14_24 rounded_8 blueLinear onClick={() => setOpenStart(true)}>
								Thực hiện dự án
							</Button>
						)}
						{detailProject?.state == STATE_PROJECT.DO && (
							<Button p_14_24 rounded_8 primary onClick={() => setOpenFinish(true)}>
								Kết thúc dự án
							</Button>
						)}
						{detailProject?.state == STATE_PROJECT.PREPARE && (
							<Button p_14_24 rounded_8 light-red onClick={() => setOpenDelete(true)}>
								Xóa
							</Button>
						)}
						{detailProject?.state != STATE_PROJECT.FINISH && (
							<Button p_14_24 rounded_8 primaryLinear href={`${PATH.UpdateInfoProject}?_uuid=${_uuid}`}>
								Chỉnh sửa
							</Button>
						)}
						{detailProject?.state == STATE_PROJECT.FINISH && (
							<Button p_14_24 rounded_8 blueLinear onClick={() => setOpenReStart(true)}>
								Tái hoạt động dự án
							</Button>
						)}
					</div>
				}
			>
				<div className={clsx(styles.basic_info)}>
					<div className={styles.head}>
						<h4>Thông tin nhà thầu</h4>
					</div>
					<div className={styles.main_table}>
						<div className={styles.head_filt}>
							<div className={styles.main_search}>
								<div className={styles.search}>
									<Search keyName='_keyword' placeholder='Tìm kiếm theo tên nhà thầu,nhóm nhà thầu' />
								</div>
							</div>
							<div className={styles.btn}>
								<Button
									p_14_24
									rounded_8
									light-blue
									icon={<Image alt='icon add' src={icons.iconAdd} width={20} height={20} />}
									onClick={() => {
										router.replace({
											pathname: router.pathname,
											query: {
												...router.query,
												_action: 'create',
											},
										});
									}}
								>
									Thêm mới nhà thầu
								</Button>
							</div>
						</div>
						<DataWrapper loading={isLoading} data={listContractorProject?.items || []}>
							<Table
								data={listContractorProject?.items || []}
								column={[
									{
										title: 'STT',
										render: (data: IContractorProject, index: number) => <>{index + 1}</>,
									},
									{
										title: 'Thuộc nhóm',
										render: (data: IContractorProject) => <>{data?.contractorCategory?.name}</>,
									},
									{
										title: 'Tên nhà thầu',
										render: (data: IContractorProject) => <>{data?.name || ''}</>,
									},
									{
										title: 'Giá trị hợp đồng (VND)',
										render: (data: IContractorProject) => <>{convertCoin(data?.contractAmount)}</>,
									},
									{
										title: 'Thời gian THHĐ',
										render: (data: IContractorProject) => (
											<>
												{data?.contractEndDate ? (
													<Moment date={data?.contractEndDate} format='DD/MM/YYYY' />
												) : (
													'---'
												)}
											</>
										),
									},
									{
										title: 'GTBLTHHĐ (VND)',
										render: (data: IContractorProject) => <>{convertCoin(data?.projectGuarantee?.amount)}</>,
									},
									{
										title: 'NKTBLTHHĐ',
										render: (data: IContractorProject) => (
											<>
												{data?.projectGuarantee?.endDate ? (
													<Moment date={data?.projectGuarantee?.endDate} format='DD/MM/YYYY' />
												) : (
													'---'
												)}
											</>
										),
									},
									{
										title: 'Giá trị BLTƯ (VND)',
										render: (data: IContractorProject) => <>{convertCoin(data?.disbursementGuarantee?.amount)}</>,
									},
									{
										title: 'Ngày kết thúc BLTƯ',
										render: (data: IContractorProject) => (
											<>
												{data?.disbursementGuarantee?.endDate ? (
													<Moment date={data?.disbursementGuarantee?.endDate} format='DD/MM/YYYY' />
												) : (
													'---'
												)}
											</>
										),
									},
									{
										title: 'Hành động',
										fixedRight: true,
										render: (data: IContractorProject) => (
											<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
												<IconCustom
													type='edit'
													icon={<Edit fontSize={20} fontWeight={600} />}
													tooltip='Chỉnh sửa'
													onClick={() => {
														router.replace({
															pathname: router.pathname,
															query: {
																...router.query,
																_projectContractorUuid: data?.projectContractorUuid,
															},
														});
													}}
												/>
												<IconCustom
													type='delete'
													icon={<Trash fontSize={20} fontWeight={600} />}
													tooltip='Xóa bỏ'
													onClick={() => {
														setUuidDeleteContractor(data?.projectContractorUuid);
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
							total={listContractorProject?.pagination?.totalCount || 0}
							dependencies={[_uuid, _pageSize, _keyword]}
						/>
					</div>
				</div>
			</LayoutPages>

			<PositionContainer
				open={_action == 'create'}
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
				<FormAddContractor
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

			<PositionContainer
				open={!!_projectContractorUuid}
				onClose={() => {
					const {_projectContractorUuid, ...rest} = router.query;

					router.replace({
						pathname: router.pathname,
						query: {
							...rest,
						},
					});
				}}
			>
				<FormUpdateContractor
					onClose={() => {
						const {_projectContractorUuid, ...rest} = router.query;

						router.replace({
							pathname: router.pathname,
							query: {
								...rest,
							},
						});
					}}
				/>
			</PositionContainer>

			<Dialog
				type='error'
				open={openDelete}
				onClose={() => setOpenDelete(false)}
				title={'Xác nhận xóa'}
				note={'Bạn có chắc chắn muốn xóa dự án này?'}
				onSubmit={funcDeleteProject.mutate}
			/>
			<Dialog
				type='primary'
				open={openStart}
				icon={icons.success}
				onClose={() => setOpenStart(false)}
				title={'Thực hiện dự án'}
				note={'Bạn có chắc chắn muốn thực hiện dự án này không?'}
				onSubmit={funcStartProject.mutate}
			/>
			<Dialog
				type='error'
				open={openFinish}
				onClose={() => setOpenFinish(false)}
				title={'Kết thúc dự án'}
				note={'Bạn có chắc chắn muốn kết thúc dự án này?'}
				onSubmit={funcFinishProject.mutate}
			/>
			<Dialog
				type='error'
				open={!!uuidDeleteContractor}
				onClose={() => setUuidDeleteContractor('')}
				title={'Xóa nhà thầu'}
				note={'Bạn có chắc chắn muốn xóa nhà thầu ra khỏi dự án này không?'}
				onSubmit={funcDeleteContractorProject.mutate}
			/>
			<Dialog
				type='primary'
				open={openReStart}
				icon={icons.success}
				onClose={() => setOpenReStart(false)}
				title={'Tái hoạt động dự án'}
				note={'Bạn có chắc chắn muốn tái hoạt động dự án này không?'}
				onSubmit={funcStartProject.mutate}
			/>
		</div>
	);
}

export default MainInfoContractor;
