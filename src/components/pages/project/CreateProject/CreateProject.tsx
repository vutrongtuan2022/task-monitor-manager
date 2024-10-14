import React, {useState} from 'react';

import {IFormCreateProject, PropsCreateProject} from './interfaces';
import styles from './CreateProject.module.scss';
import Breadcrumb from '~/components/common/Breadcrumb';
import {PATH} from '~/constants/config';
import Form, {Input} from '~/components/common/Form';
import {useMutation, useQuery} from '@tanstack/react-query';
import {QUERY_KEY, STATUS_CONFIG, TYPE_ACCOUNT} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import Select, {Option} from '~/components/common/Select';
import clsx from 'clsx';
import SelectMany from '~/components/common/SelectMany';
import {price} from '~/common/funcs/convertCoin';
import DatePicker from '~/components/common/DatePicker';
import TextArea from '~/components/common/Form/components/TextArea';
import Button from '~/components/common/Button';
import moment from 'moment';
import {useRouter} from 'next/router';
import Loading from '~/components/common/Loading';
import {toastWarn} from '~/common/funcs/toast';
import GridColumn from '~/components/layouts/GridColumn';
import {useSelector} from 'react-redux';
import {RootState} from '~/redux/store';
import branchesServices from '~/services/branchesServices';
import taskCatServices from '~/services/taskCatServices';
import userServices from '~/services/userServices';
import provineServices from '~/services/provineServices';
import projectServices from '~/services/projectServices';

function CreateProject({}: PropsCreateProject) {
	const router = useRouter();

	const {infoUser} = useSelector((state: RootState) => state.user);

	const [users, setUsers] = useState<any[]>([]);

	// const [listContractor, setListContractor] = useState<
	// 	{
	// 		idGroupContractor: number;
	// 		uuidGroupContractor: string;
	// 		codeGroupContractor: string;
	// 		nameGroupContractor: string;
	// 		uuidContractor: string;
	// 		codeContractor: string;
	// 		nameContractor: string;
	// 	}[]
	// >([]);

	const [form, setForm] = useState<IFormCreateProject>({
		branchUuid: '',
		branchCode: '',
		name: '',
		type: null,
		managerUuid: infoUser?.userUuid || '',
		expectBudget: 0,
		realBudget: 0,
		reserveBudget: 0,
		totalInvest: 0,
		matp: '',
		maqh: '',
		xaid: '',
		address: '',
		expectStart: '',
		expectEnd: '',
		realStart: '',
		description: '',
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

	// useQuery([QUERY_KEY.dropdown_group_contractor], {
	// 	queryFn: () =>
	// 		httpRequest({
	// 			http: contractorcatServices.categoryContractorCat({
	// 				keyword: '',
	// 				status: STATUS_CONFIG.ACTIVE,
	// 				isDefault: 2,
	// 			}),
	// 		}),
	// 	onSuccess(data) {
	// 		if (data) {
	// 			setListContractor(
	// 				data?.map((v: any) => ({
	// 					idGroupContractor: v?.id,
	// 					uuidGroupContractor: v?.uuid,
	// 					codeGroupContractor: v?.code,
	// 					nameGroupContractor: v?.name,
	// 					uuidContractor: '',
	// 					codeContractor: '',
	// 					nameContractor: '',
	// 				}))
	// 			);
	// 		}
	// 	},
	// });

	const funcCreateProject = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Thêm dự án thành công!',
				http: projectServices.createProject({
					branchUuid: form?.branchUuid,
					name: form?.name,
					type: form?.type!,
					employeeUuid: users?.map((v: any) => v?.uuid),
					managerUuid: form?.managerUuid,
					contractorUuid: [],
					// contractorUuid: listContractor?.map((v) => v?.uuidContractor),
					description: form?.description,
					expectBudget: price(form?.expectBudget),
					realBudget: price(form?.realBudget),
					reserveBudget: price(form?.reserveBudget),
					totalInvest: price(form?.totalInvest),
					expectStart: moment(form?.expectStart).format('YYYY-MM-DD'),
					expectEnd: moment(form?.expectEnd).format('YYYY-MM-DD'),
					realStart: moment(form?.realStart).format('YYYY-MM-DD'),
					matp: form?.matp,
					maqh: form?.maqh,
					xaid: form?.xaid,
					address: form?.address,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				router.back();
			}
		},
	});

	const handleCreateProject = () => {
		if (!form.type) {
			return toastWarn({msg: 'Chọn quy trình áp dụng!'});
		}
		if (users?.length == 0) {
			return toastWarn({msg: 'Chọn cán bộ chuyên quản!'});
		}
		if (!form.managerUuid) {
			return toastWarn({msg: 'Chọn lãnh đạo phụ trách!'});
		}
		// if (listContractor?.some((v) => v.uuidContractor == '')) {
		// 	return toastWarn({msg: 'Chọn đầy đủ nhà thầu!'});
		// }
		if (!form?.expectStart) {
			return toastWarn({msg: 'Chọn thời gian bắt đầu dự kiến!'});
		}
		if (!form?.expectEnd) {
			return toastWarn({msg: 'Chọn thời gian kết thúc dự kiến!'});
		}
		if (!form?.realStart) {
			return toastWarn({msg: 'Chọn thời gian bắt đầu dự án được phê duyệt!'});
		}

		return funcCreateProject.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={funcCreateProject.isLoading} />
			<Breadcrumb
				listUrls={[
					{
						path: PATH.Project,
						title: 'Danh sách dự án',
					},
					{
						path: '',
						title: 'Thêm mới dự án',
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
							Hủy bỏ
						</Button>
						<Button p_14_24 rounded_8 blueLinear onClick={handleCreateProject}>
							Lưu lại
						</Button>
					</div>
				}
			/>
			<div className={styles.main}>
				<Form form={form} setForm={setForm}>
					<div className={styles.grid}>
						<div className={styles.basic_info}>
							<div className={styles.head}>
								<h4>Thông tin cơ bản</h4>
							</div>
							<div className={styles.form}>
								<div className={styles.col_2}>
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
								</div>
								<div className={clsx(styles.mt, styles.col_2)}>
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
								</div>
								<div className={clsx(styles.mt, styles.col_2)}>
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
								</div>
								{/* <div className={styles.mt}>
									<div className={styles.col_2}>
										<p className={styles.label}>
											Nhóm nhà thầu <span style={{color: 'red'}}>*</span>
										</p>
										<p className={styles.label}>
											Nhà thầu <span style={{color: 'red'}}>*</span>
										</p>
									</div>
									{listContractor?.map((v) => (
										<GroupContractor
											key={v?.uuidGroupContractor}
											data={v}
											listContractor={listContractor}
											setListContractor={setListContractor}
										/>
									))}
								</div> */}
							</div>
						</div>
						<div className={styles.basic_info}>
							<div className={styles.head}>
								<h4>Thông tin vốn dự án</h4>
							</div>
							<div className={styles.form}>
								<Input
									label={
										<span>
											Kế hoạch vốn đầu tư <span style={{color: 'red'}}>*</span>
										</span>
									}
									placeholder='Nhập kế hoạch vốn đầu tư'
									type='text'
									isMoney
									name='expectBudget'
									value={form?.expectBudget}
									isRequired={true}
									blur={true}
									unit='VND'
								/>
								<Input
									label={
										<span>
											Tổng dự toán <span style={{color: 'red'}}>*</span>
										</span>
									}
									type='text'
									placeholder='Nhập tổng dự toán'
									isMoney
									name='realBudget'
									value={form?.realBudget}
									isRequired={true}
									blur={true}
									unit='VND'
								/>
								<Input
									label={
										<span>
											Vốn dự phòng được duyệt <span style={{color: 'red'}}>*</span>
										</span>
									}
									type='text'
									placeholder='Nhập vốn dự phòng được duyệt '
									isMoney
									name='reserveBudget'
									value={form?.reserveBudget}
									isRequired={true}
									blur={true}
									unit='VND'
								/>
								<Input
									label={
										<span>
											Tổng mức đầu tư dự án <span style={{color: 'red'}}>*</span>
										</span>
									}
									placeholder='Nhập tổng mức đầu tư dự án'
									type='text'
									isMoney
									name='totalInvest'
									value={form?.totalInvest}
									unit='VND'
								/>
							</div>
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
									label={
										<span>
											Thời gian bắt đầu dự kiến <span style={{color: 'red'}}>*</span>
										</span>
									}
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
									label={
										<span>
											Thời gian kết thúc dự kiến <span style={{color: 'red'}}>*</span>
										</span>
									}
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
									label={
										<span>
											Thời gian bắt đầu dự án được phê duyệt <span style={{color: 'red'}}>*</span>
										</span>
									}
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
							</GridColumn>
							<div className={clsx(styles.mt)}>
								<GridColumn col_3>
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
								</GridColumn>
							</div>
							<div className={clsx(styles.mt)}>
								<GridColumn col_2>
									<TextArea name='address' placeholder='Nhập địa chỉ' label='Địa chỉ' />
									<TextArea name='description' placeholder='Nhập mô tả' label='Mô tả' />
								</GridColumn>
							</div>
						</div>
					</div>
				</Form>
			</div>
		</div>
	);
}

export default CreateProject;
