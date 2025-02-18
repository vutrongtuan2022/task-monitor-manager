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
import Popup from '~/components/common/Popup';

function UpdateInforContractor({}: PropsUpdateInforContractor) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_uuid} = router.query;

	const [listContractor, setListContractor] = useState<
		{
			uuidGroupContractor: string;
			contractorLinkUuid: string;
			note: string;
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
							uuidGroupContractor: '',
							contractorLinkUuid: '',
							note: '',
						},
					]);
				} else
					setListContractor(
						data?.map((v: any) => ({
							uuidGroupContractor: v?.contractorCategory?.uuid || null,
							contractorLinkUuid: v?.contractorLinkUuid,
							note: v?.note,
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
					credels: listContractor?.map((v) => ({
						contractorCatLinkUuids: v.contractorLinkUuid,
						note: v?.note,
					})),
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
		if (listContractor?.some((v) => !v?.contractorLinkUuid)) {
			return toastWarn({msg: 'Chọn đầy đủ nhà thầu!'});
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
							<GridColumn col_3>
								<p className={styles.label}>
									Nhóm nhà thầu <span style={{color: 'red'}}>*</span>
								</p>
								<p className={styles.label}>
									Nhà thầu <span style={{color: 'red'}}>*</span>
								</p>
								<p className={styles.label}>
									Ghi chú <span style={{color: 'red'}}>*</span>
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
											uuidGroupContractor: '',
											contractorLinkUuid: '',
											note: '',
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
		uuidGroupContractor: string;
		contractorLinkUuid: string;
		note: string;
	};
	listContractor: {
		uuidGroupContractor: string;
		contractorLinkUuid: string;
		note: string;
	}[];
	setListContractor: (any: any) => void;
}) {
	const [uuidGroupContractor, setUuidGroupContractor] = useState<string>('');

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

	const {data: dropdownContractor} = useQuery([`${QUERY_KEY.dropdown_contractor}_${data?.uuidGroupContractor}`], {
		queryFn: () =>
			httpRequest({
				http: contractorServices.categoryContractor({
					keyword: '',
					status: STATUS_CONFIG.ACTIVE,
					type: data?.uuidGroupContractor!,
				}),
			}),

		select(data) {
			return data;
		},
		enabled: !!data?.uuidGroupContractor,
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
			<GridColumn col_3>
				<Select isSearch={true} name='uuidGroupContractor' value={data?.uuidGroupContractor} placeholder='Chọn'>
					{dropdownGroupContractor?.map((v: any) => (
						<Option
							key={v?.uuid}
							value={v.uuid}
							title={v?.name}
							onClick={() => handleChangeValue(index, 'uuidGroupContractor', v?.uuid)}
						/>
					))}
				</Select>
				<div>
					<Select
						isSearch={true}
						name='contractorLinkUuid'
						value={data?.contractorLinkUuid}
						placeholder='Chọn'
						// action={
						// 	<Button border-dashed rounded_8 onClick={() => setUuidGroupContractor(data?.uuidGroupContractor)}>
						// 		Thêm nhà thầu mới
						// 	</Button>
						// }
					>
						{dropdownContractor?.map((v: any) => (
							<Option
								key={v?.uuid}
								value={v.contractorLinkUuid}
								title={v?.name}
								onClick={() => handleChangeValue(index, 'contractorLinkUuid', v?.contractorLinkUuid)}
							/>
						))}
					</Select>
				</div>
				<div className={styles.grid}>
					<div className={styles.box_input}>
						<input
							placeholder='Nhập ghi chú'
							className={styles.input}
							name={`note_${index}`}
							value={data?.note}
							onChange={(e) => handleChangeValue(index, 'note', e?.target?.value)}
						/>
					</div>
					{index >= 1 && (
						<div className={styles.delete} onClick={handleDelete}>
							<Trash size={22} color='#fff' />
						</div>
					)}
				</div>
			</GridColumn>

			<Popup open={!!uuidGroupContractor} onClose={() => setUuidGroupContractor('')}>
				<div className={styles.main_popup}>a</div>
			</Popup>
		</div>
	);
}
