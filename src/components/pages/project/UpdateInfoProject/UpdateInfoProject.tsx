import React, {useState} from 'react';

import {IFormUpdateInfoProject, PropsUpdateInfoProject} from './interfaces';
import styles from './UpdateInfoProject.module.scss';
import {useRouter} from 'next/router';
import LayoutPages from '~/components/layouts/LayoutPages';
import {PATH} from '~/constants/config';
import Button from '~/components/common/Button';
import Breadcrumb from '~/components/common/Breadcrumb';
import Form, {Input} from '~/components/common/Form';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {QUERY_KEY, STATE_PROJECT, STATUS_CONFIG, TYPE_ACCOUNT} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import Select, {Option} from '~/components/common/Select';
import clsx from 'clsx';
import SelectMany from '~/components/common/SelectMany';
import TextArea from '~/components/common/Form/components/TextArea';
import DatePicker from '~/components/common/DatePicker';
import {IDetailInfoProject} from '../MainInfoProject/interfaces';
import Loading from '~/components/common/Loading';
import moment from 'moment';
import GridColumn from '~/components/layouts/GridColumn';
import projectServices from '~/services/projectServices';
import branchesServices from '~/services/branchesServices';
import taskCatServices from '~/services/taskCatServices';
import userServices from '~/services/userServices';
import provineServices from '~/services/provineServices';
import {toastWarn} from '~/common/funcs/toast';

function UpdateInfoProject({}: PropsUpdateInfoProject) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_uuid} = router.query;

	const [users, setUsers] = useState<any[]>([]);
	const [form, setForm] = useState<IFormUpdateInfoProject>({
		branchUuid: '',
		branchCode: '',
		name: '',
		type: null,
		managerUuid: '',
		matp: '',
		maqh: '',
		xaid: '',
		address: '',
		expectEnd: '',
		expectStart: '',
		realStart: '',
		description: '',
	});

	const {data: detailProject} = useQuery<IDetailInfoProject>([QUERY_KEY.detail_general_update_project, _uuid], {
		queryFn: () =>
			httpRequest({
				http: projectServices.detailInfoProject({
					uuid: _uuid as string,
				}),
			}),
		onSuccess(data) {
			setForm({
				branchUuid: data?.branch?.uuid || '',
				branchCode: data?.branch?.code || '',
				name: data?.name || '',
				type: data?.taskCat?.id || null,
				managerUuid: data?.manager?.uuid || '',
				matp: data?.tp?.uuid || '',
				maqh: data?.qh?.uuid || '',
				xaid: data?.xa?.uuid || '',
				address: data?.address || '',
				expectEnd: data?.expectEnd || '',
				expectStart: data?.expectStart || '',
				realStart: data?.realStart || '',
				description: data?.description || '',
			});
			setUsers(
				data?.user?.map((v) => ({
					uuid: v?.uuid,
					title: v?.fullname,
					code: v?.code,
				}))
			);
		},
		enabled: !!_uuid,
	});

	const {data: listBranches} = useQuery([QUERY_KEY.dropdown_branches], {
		queryFn: () =>
			httpRequest({
				http: branchesServices.categoryBranches({
					keyword: '',
					status: STATUS_CONFIG.ACTIVE,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const {data: listTasks} = useQuery([QUERY_KEY.dropdown_task_cat], {
		queryFn: () =>
			httpRequest({
				http: taskCatServices.categoryTaskCat({
					keyword: '',
					status: STATUS_CONFIG.ACTIVE,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const {data: listUser} = useQuery([QUERY_KEY.dropdown_user], {
		queryFn: () =>
			httpRequest({
				http: userServices.categoryUser({
					keyword: '',
					status: STATUS_CONFIG.ACTIVE,
					roleUuid: '',
					type: TYPE_ACCOUNT.USER,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const {data: listManager} = useQuery([QUERY_KEY.dropdown_manager], {
		queryFn: () =>
			httpRequest({
				http: userServices.categoryUser({
					keyword: '',
					status: STATUS_CONFIG.ACTIVE,
					roleUuid: '',
					type: TYPE_ACCOUNT.MANAGER,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const {data: listProvince} = useQuery([QUERY_KEY.dropdown_province], {
		queryFn: () =>
			httpRequest({
				http: provineServices.listProvine({
					keyword: '',
				}),
			}),
		select(data) {
			return data;
		},
	});

	const {data: listDistrict} = useQuery([QUERY_KEY.dropdown_district, form.matp], {
		queryFn: () =>
			httpRequest({
				http: provineServices.listDistrict({
					keyword: '',
					idParent: form.matp,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!form?.matp,
	});

	const {data: listTown} = useQuery([QUERY_KEY.dropdown_town, form.maqh], {
		queryFn: () =>
			httpRequest({
				http: provineServices.listTown({
					keyword: '',
					idParent: form.maqh,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!form?.maqh,
	});

	const funcUpdateGeneralProject = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Chỉnh sửa dự án thành công!',
				http: projectServices.updateGeneralProject({
					uuid: _uuid as string,
					branchUuid: form?.branchUuid,
					name: form?.name,
					type: form?.type!,
					employeeUuid: users?.map((v: any) => v?.uuid),
					managerUuid: form?.managerUuid,
					description: form?.description,
					expectStart: form.expectStart ? moment(form?.expectStart).format('YYYY-MM-DD') : null,
					expectEnd: form.expectEnd ? moment(form?.expectEnd).format('YYYY-MM-DD') : null,
					realStart: form.realStart ? moment(form?.realStart).format('YYYY-MM-DD') : null,
					matp: form?.matp,
					maqh: form?.maqh,
					xaid: form?.xaid,
					address: form?.address,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				queryClient.invalidateQueries([QUERY_KEY.detail_general_update_project]);
			}
		},
	});

	const handleUpdateGeneralProject = () => {
		if (!form.type) {
			return toastWarn({msg: 'Chọn quy trình áp dụng!'});
		}
		if (users?.length == 0) {
			return toastWarn({msg: 'Chọn cán bộ chuyên quản!'});
		}
		if (!form.managerUuid) {
			return toastWarn({msg: 'Chọn lãnh đạo phụ trách!'});
		}
		// if (!form?.expectStart) {
		// 	return toastWarn({msg: 'Chọn thời gian bắt đầu dự kiến!'});
		// }
		// if (!form?.expectEnd) {
		// 	return toastWarn({msg: 'Chọn thời gian kết thúc dự kiến!'});
		// }
		// if (!form?.realStart) {
		// 	return toastWarn({msg: 'Chọn thời gian bắt đầu dự án được phê duyệt!'});
		// }

		return funcUpdateGeneralProject.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={funcUpdateGeneralProject.isLoading} />
			<Breadcrumb
				listUrls={[
					{
						path: PATH.Project,
						title: 'Danh sách dự án',
					},
					{
						path: '',
						title: 'Chỉnh sửa dự án',
					},
				]}
			/>
			<LayoutPages
				listPages={[
					{
						title: 'Thông tin chung',
						path: `${PATH.UpdateInfoProject}?_uuid=${_uuid}`,
					},
					{
						title: 'Thông tin kế hoạch vốn',
						path: `${PATH.UpdateInfoCapital}?_uuid=${_uuid}`,
					},
					{
						title: 'Quản lý nhà thầu',
						path: `${PATH.UpdateInfoContractor}?_uuid=${_uuid}`,
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
							Hủy bỏ
						</Button>
						<Button p_14_24 rounded_8 blueLinear onClick={handleUpdateGeneralProject}>
							Lưu lại
						</Button>
					</div>
				}
			>
				<div className={styles.main}>
					<Form form={form} setForm={setForm}>
						<div className={styles.basic_info}>
							<div className={styles.head}>
								<h4>Thông tin cơ bản</h4>
							</div>
							<div className={styles.form}>
								<GridColumn col_2>
									<Select
										isSearch={true}
										label={
											<span>
												Tên chi nhánh <span style={{color: 'red'}}>*</span>
											</span>
										}
										name='branchUuid'
										value={form.branchUuid}
										placeholder='Chọn'
									>
										{listBranches?.map((v: any) => (
											<Option
												key={v.uuid}
												value={v.uuid}
												title={v?.name}
												onClick={() =>
													setForm((prev) => ({
														...prev,
														branchUuid: v?.uuid,
														branchCode: v?.code,
													}))
												}
											/>
										))}
									</Select>
									<Input
										label={
											<span>
												Mã chi nhánh <span style={{color: 'red'}}>*</span>
											</span>
										}
										type='text'
										placeholder='Mã chi nhánh'
										name='branchCode'
										value={form?.branchCode}
										readOnly={true}
									/>
									<div>
										<Input
											label={
												<span>
													Tên công trình <span style={{color: 'red'}}>*</span>
												</span>
											}
											type='text'
											placeholder='Nhập tên công trình'
											name='name'
											value={form?.name}
											isRequired={true}
											blur={true}
										/>
									</div>
									<Select
										isSearch={true}
										label={
											<span>
												Quy trình áp dụng <span style={{color: 'red'}}>*</span>
											</span>
										}
										name='type'
										value={form.type}
										placeholder='Chọn'
										readOnly={detailProject?.state == STATE_PROJECT.DO}
									>
										{listTasks?.map((v: any) => (
											<Option
												key={v.id}
												value={v.id}
												title={v?.name}
												onClick={() =>
													setForm((prev) => ({
														...prev,
														type: v?.id,
													}))
												}
											/>
										))}
									</Select>
									<SelectMany
										placeholder='Chọn'
										label={
											<span>
												Cán bộ chuyên quản <span style={{color: 'red'}}>*</span>
											</span>
										}
										value={users}
										setValue={(user) =>
											setUsers(
												users?.find((v: any) => v?.uuid == user.uuid)
													? users?.filter((v: any) => v?.uuid != user.uuid)
													: [...users, user]
											)
										}
										listData={listUser?.map((v: any) => ({
											uuid: v?.uuid,
											title: v?.fullname,
											code: v?.code,
										}))}
									/>
									<Select
										isSearch={true}
										label={
											<span>
												Lãnh đạo phụ trách <span style={{color: 'red'}}>*</span>
											</span>
										}
										name='managerUuid'
										value={form.managerUuid}
										placeholder='Chọn'
									>
										{listManager?.map((v: any) => (
											<Option
												key={v.uuid}
												value={v.uuid}
												title={v?.fullname}
												onClick={() =>
													setForm((prev) => ({
														...prev,
														managerUuid: v?.uuid,
													}))
												}
											/>
										))}
									</Select>
								</GridColumn>
							</div>
						</div>
						<div className={clsx(styles.basic_info, styles.mt)}>
							<div className={styles.head}>
								<h4>Thông tin khác</h4>
							</div>
							<div className={styles.form}>
								<GridColumn col_3>
									<DatePicker
										onClean={true}
										icon={true}
										label={<span>Thời gian bắt đầu dự kiến</span>}
										name='expectStart'
										value={form.expectStart}
										placeholder='Chọn thời gian bắt đầu dự kiến'
										onSetValue={(date) =>
											setForm((prev) => ({
												...prev,
												expectStart: date,
											}))
										}
									/>
									<DatePicker
										onClean={true}
										icon={true}
										label={<span>Thời gian kết thúc dự kiến</span>}
										name='expectEnd'
										value={form.expectEnd}
										placeholder='Chọn thời gian kết thúc dự kiến'
										onSetValue={(date) =>
											setForm((prev) => ({
												...prev,
												expectEnd: date,
											}))
										}
									/>
									<DatePicker
										onClean={true}
										icon={true}
										label={<span>Thời gian bắt đầu dự án được phê duyệt</span>}
										name='realStart'
										value={form.realStart}
										placeholder='Chọn thời gian bắt đầu dự án được phê duyệt'
										onSetValue={(date) =>
											setForm((prev) => ({
												...prev,
												realStart: date,
											}))
										}
									/>
									<Select isSearch name='matp' value={form.matp} placeholder='Lựa chọn' label={<span>Tỉnh/ TP</span>}>
										{listProvince?.map((v: any) => (
											<Option
												key={v?.matp}
												value={v?.matp}
												title={v?.name}
												onClick={() =>
													setForm((prev: any) => ({
														...prev,
														matp: v?.matp,
														maqh: '',
														xaid: '',
													}))
												}
											/>
										))}
									</Select>

									<div>
										<Select
											isSearch
											name='maqh'
											value={form.maqh}
											placeholder='Lựa chọn'
											label={<span>Quận/ Huyện</span>}
										>
											{listDistrict?.map((v: any) => (
												<Option
													key={v?.maqh}
													value={v?.maqh}
													title={v?.name}
													onClick={() =>
														setForm((prev: any) => ({
															...prev,
															maqh: v?.maqh,
															xaid: '',
														}))
													}
												/>
											))}
										</Select>
									</div>
									<Select
										isSearch
										name='xaid'
										value={form.xaid}
										placeholder='Lựa chọn'
										label={<span>Thị trấn/ Xã </span>}
									>
										{listTown?.map((v: any) => (
											<Option
												key={v?.xaid}
												value={v?.xaid}
												title={v?.name}
												onClick={() =>
													setForm((prev: any) => ({
														...prev,
														xaid: v?.xaid,
													}))
												}
											/>
										))}
									</Select>
									<TextArea name='address' placeholder='Nhập địa chỉ chi tiết' label='Địa chỉ chi tiết' />
									<TextArea name='description' placeholder='Nhập quy mô công trình' label='Quy mô công trình' />
								</GridColumn>
							</div>
						</div>
					</Form>
				</div>
			</LayoutPages>
		</div>
	);
}

export default UpdateInfoProject;
