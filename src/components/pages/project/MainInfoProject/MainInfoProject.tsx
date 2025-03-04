import React, {useState} from 'react';

import {IDetailInfoProject, PropsMainInfoProject} from './interfaces';
import styles from './MainInfoProject.module.scss';
import LayoutPages from '~/components/layouts/LayoutPages';
import {PATH} from '~/constants/config';
import {useRouter} from 'next/router';
import Button from '~/components/common/Button';
import GridColumn from '~/components/layouts/GridColumn';
import StateActive from '~/components/common/StateActive';
import {QUERY_KEY, STATE_PROJECT} from '~/constants/config/enum';
import Progress from '~/components/common/Progress';
import Moment from 'react-moment';
import clsx from 'clsx';
import {httpRequest} from '~/services';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {convertCoin} from '~/common/funcs/convertCoin';
import Dialog from '~/components/common/Dialog';
import Loading from '~/components/common/Loading';
import Breadcrumb from '~/components/common/Breadcrumb';
import icons from '~/constants/images/icons';
import WrapperScrollbar from '~/components/layouts/WrapperScrollbar';
import projectServices from '~/services/projectServices';
import Tippy from '@tippyjs/react';

function MainInfoProject({}: PropsMainInfoProject) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_uuid} = router.query;

	const [openDelete, setOpenDelete] = useState<boolean>(false);
	const [openStart, setOpenStart] = useState<boolean>(false);
	const [openFinish, setOpenFinish] = useState<boolean>(false);
	const [openReStart, setOpenReStart] = useState<boolean>(false);

	const {data: detailProject} = useQuery<IDetailInfoProject>([QUERY_KEY.detail_project, _uuid], {
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
				queryClient.invalidateQueries([QUERY_KEY.detail_project]);
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
				queryClient.invalidateQueries([QUERY_KEY.detail_project]);
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
				queryClient.invalidateQueries([QUERY_KEY.detail_project]);
			}
		},
	});

	return (
		<div className={styles.container}>
			<Loading
				loading={
					funcDeleteProject.isLoading || funcStartProject.isLoading || funcFinishProject.isLoading || funcReStartProject.isLoading
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
						title: 'Quản lý công việc',
						path: `${PATH.ProjectWorkReport}?_uuid=${_uuid}`,
					},
					{
						title: 'Quản lý hợp đồng',
						path: `${PATH.ProjectDisbursementProgress}?_uuid=${_uuid}`,
					},
					{
						title: 'Quản lý nhà thầu',
						path: `${PATH.ProjectContractor}?_uuid=${_uuid}`,
					},
					// {
					// 	title: 'Nhật ký kế hoạch vốn',
					// 	path: `${PATH.ProjectPlanningCapital}?_uuid=${_uuid}`,
					// },
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
				<WrapperScrollbar isWrappreTable={false}>
					<div className={styles.grid}>
						<div className={styles.basic_info}>
							<div className={styles.head}>
								<h4>Thông tin cơ bản</h4>
								<div className={styles.state}>
									<p>Trạng thái dự án:</p>
									<StateActive
										stateActive={detailProject?.state!}
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
								</div>
							</div>
							<div className={styles.progress_group}>
								<GridColumn col_3>
									<div className={styles.item}>
										<p>Mã dự án</p>
										<p>{detailProject?.code || '---'}</p>
									</div>
									<div className={styles.item}>
										<p>Tiến độ dự án</p>
										<Progress percent={detailProject?.progress!} width={80} />
									</div>
								</GridColumn>
								<div className={styles.mt}>
									<GridColumn col_3>
										<div className={styles.item}>
											<p>Tên chi nhánh</p>
											<p>{detailProject?.branch?.name || '---'}</p>
										</div>
										<div className={styles.item}>
											<p>Mã chi nhánh</p>
											<p>{detailProject?.branch?.code || '---'}</p>
										</div>
									</GridColumn>
								</div>
								<div className={styles.mt}>
									<GridColumn col_3>
										<div className={styles.item}>
											<p>Tên công trình</p>
											<p>{detailProject?.name || '---'}</p>
										</div>
										<div className={styles.item}>
											<p>Quy trình áp dụng</p>
											<p>{detailProject?.taskCat?.name}</p>
										</div>
									</GridColumn>
								</div>
								<div className={styles.mt}>
									<GridColumn col_3>
										<div className={styles.item}>
											<p>Lãnh đạo phụ trách</p>
											<p>{detailProject?.manager?.fullname || '---'}</p>
										</div>
										<div className={styles.item}>
											<p>Cán bộ chuyên quản</p>
											<p>
												{detailProject?.user?.[0]?.fullname}
												{detailProject?.user?.length! > 1 && (
													<Tippy
														content={
															<ol style={{paddingLeft: '16px'}}>
																{[...detailProject?.user!]?.slice(1)?.map((v, i) => (
																	<li key={i}>{v?.fullname}</li>
																))}
															</ol>
														}
													>
														<span className={styles.link}>
															và {detailProject?.user?.length! - 1} người khác
														</span>
													</Tippy>
												)}
											</p>
										</div>
										{/* <div className={styles.item}>
											<p>Công tác số hóa hồ sơ</p>
											<p>{detailProject?.digitalFile}</p>
										</div> */}
									</GridColumn>
								</div>
								<div className={styles.mt}>
									<GridColumn col_3>
										<div className={styles.item}>
											<p>Ngày tạo dự án</p>
											<p>
												{detailProject?.created ? (
													<Moment date={detailProject?.created} format='DD/MM/YYYY' />
												) : (
													'---'
												)}
											</p>
										</div>
										<div className={styles.item}>
											<p>Thời gian bắt đầu dự tính</p>
											<p>
												{detailProject?.expectStart ? (
													<Moment date={detailProject?.expectStart} format='DD/MM/YYYY' />
												) : (
													'---'
												)}
											</p>
										</div>
										<div className={styles.item}>
											<p>Thời gian kết thúc dự tính</p>
											<p>
												{detailProject?.expectEnd ? (
													<Moment date={detailProject?.expectEnd} format='DD/MM/YYYY' />
												) : (
													'---'
												)}
											</p>
										</div>
									</GridColumn>
								</div>
								<div className={styles.mt}>
									<GridColumn col_3>
										<div className={styles.item}>
											<p>Thời gian bắt đầu dự án được phê duyệt</p>
											<p>
												{detailProject?.realStart ? (
													<Moment date={detailProject?.realStart} format='DD/MM/YYYY' />
												) : (
													'---'
												)}
											</p>
										</div>
										<div className={styles.item}>
											<p>Thời gian kết thúc dự án</p>
											<p>
												{detailProject?.realEnd ? (
													<Moment date={detailProject?.realEnd} format='DD/MM/YYYY' />
												) : (
													'---'
												)}
											</p>
										</div>
									</GridColumn>
								</div>
							</div>
						</div>
						<div className={styles.basic_info}>
							<div className={styles.head}>
								<h4>Thông tin vốn dự án</h4>
							</div>
							<div className={styles.progress_group}>
								<div className={styles.item_capital}>
									<p>Kế hoạch vốn đầu tư</p>
									<p style={{color: '#2970FF'}}>{convertCoin(detailProject?.expectBudget!)} VND</p>
								</div>
								<div className={styles.line}></div>
								<div className={styles.item_capital}>
									<p>Tổng mức đầu tư dự án</p>
									<p>{convertCoin(detailProject?.totalInvest!)} VND</p>
								</div>
								<div className={styles.line}></div>
								<div className={styles.item_capital}>
									<p>Tổng dự toán</p>
									<p>{convertCoin(detailProject?.realBudget!)} VND</p>
								</div>
								<div className={styles.line}></div>
								<div className={styles.item_capital}>
									<p>Vốn dự phòng được duyệt</p>
									<p>{convertCoin(detailProject?.reserveBudget!)} VND</p>
								</div>
								<div className={styles.line}></div>
								<div className={styles.item_capital}>
									<p>Vốn dự phòng còn lại</p>
									<p>{convertCoin(detailProject?.remainReserveBudget!)} VND</p>
								</div>
								<div className={styles.line}></div>
								<div className={styles.item_capital}>
									<p>Số tiền giải ngân lũy kế theo năm</p>
									<p>{convertCoin(detailProject?.annualAccumAmount!)} VND</p>
								</div>
								<div className={styles.line}></div>
								<div className={styles.item_capital}>
									<p>Kế hoạch vốn theo năm</p>
									<p>{convertCoin(detailProject?.annualBudget!)} VND</p>
								</div>
								<div className={styles.line}></div>
								<div className={styles.item_capital}>
									<p>Số tiền giải ngân lũy kế đến hiện tại</p>
									<p>{convertCoin(detailProject?.accumAmount!)} VND</p>
								</div>
							</div>
						</div>
					</div>
					<div className={clsx(styles.basic_info, styles.mt)}>
						<div className={styles.head}>
							<h4>Thông tin khác</h4>
						</div>
						<div className={styles.progress_group}>
							<GridColumn col_3>
								<div className={styles.item}>
									<p>Tỉnh/TP</p>
									<p>{detailProject?.tp?.name || '---'}</p>
								</div>
								<div className={styles.item}>
									<p>Quận/Huyện</p>
									<p>{detailProject?.qh?.name || '---'}</p>
								</div>
								<div className={styles.item}>
									<p>Xã/Phường</p>
									<p>{detailProject?.xa?.name || '---'}</p>
								</div>
							</GridColumn>
							<div className={styles.mt}>
								<GridColumn col_3>
									<div className={styles.item}>
										<p>Địa chỉ chi tiết</p>
										<p>{detailProject?.address || '---'}</p>
									</div>
									<div className={styles.item}>
										<p>Quy mô công trình</p>
										<p>{detailProject?.description || '---'}</p>
									</div>
								</GridColumn>
							</div>
						</div>
					</div>
				</WrapperScrollbar>
			</LayoutPages>
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
				type='primary'
				open={openReStart}
				icon={icons.success}
				onClose={() => setOpenReStart(false)}
				title={'Tái hoạt động dự án'}
				note={'Bạn có chắc chắn muốn tái hoạt động dự án này không?'}
				onSubmit={funcReStartProject.mutate}
			/>
		</div>
	);
}

export default MainInfoProject;
