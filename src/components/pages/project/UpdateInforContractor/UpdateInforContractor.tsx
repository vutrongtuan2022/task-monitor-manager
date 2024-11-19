import React, {useState} from 'react';

import {PropsUpdateInforContractor} from './interfaces';
import styles from './UpdateInforContractor.module.scss';
import {useRouter} from 'next/router';
import LayoutPages from '~/components/layouts/LayoutPages';
import {PATH} from '~/constants/config';
import Button from '~/components/common/Button';
import Breadcrumb from '~/components/common/Breadcrumb';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {QUERY_KEY, STATUS_CONFIG} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import clsx from 'clsx';
import {AddCircle, Trash} from 'iconsax-react';
import Select, {Option} from '~/components/common/Select';
import Loading from '~/components/common/Loading';
import GridColumn from '~/components/layouts/GridColumn';
import projectContractorServices from '~/services/projectContractorServices';
import {toastWarn} from '~/common/funcs/toast';
import contractorcatServices from '~/services/contractorcatServices';
import contractorServices from '~/services/contractorServices';

function UpdateInforContractor({}: PropsUpdateInforContractor) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_uuid} = router.query;

	const [listContractor, setListContractor] = useState<
		{
			idGroupContractor: number | null;
			uuidContractor: string;
		}[]
	>([]);

	useQuery<any>([QUERY_KEY.detail_contractor_project, _uuid], {
		queryFn: () =>
			httpRequest({
				http: projectContractorServices.detailContractorProject({
					uuid: _uuid as string,
				}),
			}),
		onSuccess(data) {
			if (data) {
				if (data?.length == 0) {
					setListContractor([
						{
							idGroupContractor: null,
							uuidContractor: '',
						},
					]);
				} else
					setListContractor(
						data?.map((v: any) => ({
							idGroupContractor: v?.contractorCategory?.id || null,
							uuidContractor: v?.contractorUuid,
						}))
					);
			}
		},
		enabled: !!_uuid,
	});

	const funcUpdateContractorProject = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Cập nhật nhà thầu thành công!',
				http: projectContractorServices.addContractorProject({
					projectUuid: _uuid as string,
					contractorUuids: listContractor?.map((v) => v.uuidContractor),
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				queryClient.invalidateQueries([QUERY_KEY.detail_contractor_project]);
			}
		},
	});

	const updateContractorProject = () => {
		if (listContractor?.some((v) => !v?.uuidContractor)) {
			return toastWarn({msg: 'Chọn đầy đủ nhà thầu!'});
		}

		if (
			listContractor.some((item, index) => {
				return listContractor.findIndex((otherItem) => otherItem.idGroupContractor === item.idGroupContractor) !== index;
			})
		) {
			return toastWarn({msg: 'Trùng nhóm nhà thầu!'});
		}

		return funcUpdateContractorProject.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={funcUpdateContractorProject.isLoading} />
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
						<Button p_14_24 rounded_8 blueLinear onClick={updateContractorProject}>
							Lưu lại
						</Button>
					</div>
				}
			>
				<div className={styles.main}>
					<div className={styles.basic_info}>
						<div className={styles.head}>
							<h4>Quản lý nhà thầu</h4>
						</div>
						<div className={styles.form}>
							<GridColumn col_2>
								<p className={styles.label}>
									Nhóm nhà thầu <span style={{color: 'red'}}>*</span>
								</p>
								<p className={styles.label}>
									Nhà thầu <span style={{color: 'red'}}>*</span>
								</p>
							</GridColumn>
							<div>
								{listContractor?.map((v, i) => (
									<ItemContractorProject
										key={i}
										index={i}
										data={v}
										listContractor={listContractor}
										setListContractor={setListContractor}
									/>
								))}
							</div>
							<div
								className={clsx(styles.mt, styles.btn_add)}
								onClick={() =>
									setListContractor((prev) => [
										...prev,
										{
											idGroupContractor: null,
											uuidContractor: '',
										},
									])
								}
							>
								<div>
									<AddCircle size={20} />
								</div>
								<p>Thêm nhóm nhà thầu</p>
							</div>
						</div>
					</div>
				</div>
			</LayoutPages>
		</div>
	);
}

export default UpdateInforContractor;

function ItemContractorProject({
	index,
	data,
	listContractor,
	setListContractor,
}: {
	index: number;
	data: {
		idGroupContractor: number | null;
		uuidContractor: string;
	};
	listContractor: {
		idGroupContractor: number | null;
		uuidContractor: string;
	}[];
	setListContractor: (any: any) => void;
}) {
	const {data: dropdownGroupContractor} = useQuery([QUERY_KEY.detail_group_contractor], {
		queryFn: () =>
			httpRequest({
				http: contractorcatServices.categoryContractorCat({
					keyword: '',
					status: STATUS_CONFIG.ACTIVE,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const {data: dropdownContractor} = useQuery([`${QUERY_KEY.dropdown_contractor}_${data?.idGroupContractor}`], {
		queryFn: () =>
			httpRequest({
				http: contractorServices.categoryContractor({
					keyword: '',
					status: STATUS_CONFIG.ACTIVE,
					type: data?.idGroupContractor!,
				}),
			}),

		select(data) {
			return data;
		},
		enabled: !!data?.idGroupContractor,
	});

	const handleChangeValue = (index: number, name: string, value: any) => {
		const newData = [...listContractor];

		newData[index] = {
			...newData[index],
			[name]: value,
		};

		setListContractor(newData);
	};

	const handleDelete = () => {
		const updateData = [...listContractor];
		updateData.splice(index, 1);
		setListContractor([...updateData]);
	};

	return (
		<div className={clsx(styles.item_contractor_project)}>
			<GridColumn col_2>
				<Select isSearch={true} name='idGroupContractor' value={data?.idGroupContractor} placeholder='Chọn'>
					{dropdownGroupContractor?.map((v: any) => (
						<Option
							key={v.uuid}
							value={v.id}
							title={v?.name}
							onClick={() => handleChangeValue(index, 'idGroupContractor', v?.id)}
						/>
					))}
				</Select>
				<div className={styles.grid}>
					<Select isSearch={true} name='uuidContractor' value={data?.uuidContractor} placeholder='Chọn'>
						{dropdownContractor?.map((v: any) => (
							<Option
								key={v.uuid}
								value={v.uuid}
								title={v?.name}
								onClick={() => handleChangeValue(index, 'uuidContractor', v?.uuid)}
							/>
						))}
					</Select>
					{index >= 1 && (
						<div className={styles.delete} onClick={handleDelete}>
							<Trash size={22} color='#fff' />
						</div>
					)}
				</div>
			</GridColumn>
		</div>
	);
}
